import {NextRequest, NextResponse} from 'next/server';
import {randomBytes, scryptSync} from 'node:crypto';
import {z} from 'zod';
import {requireAdmin, checkOrigin, rateLimit, verifyPassword} from '@/lib/auth';
import {db} from '@/lib/db';

const password = z.string().min(12).max(256);
const mutation = z.discriminatedUnion('action', [
  z.object({action:z.literal('create'), email:z.email().max(254).transform(v=>v.toLowerCase().trim()), password, role:z.enum(['owner','editor']), currentPassword:z.string().min(1).max(256)}).strict(),
  z.object({action:z.literal('delete'), id:z.coerce.number().int().positive(), currentPassword:z.string().min(1).max(256)}).strict(),
]);
class TeamError extends Error {
  constructor(message:string, readonly status:number) { super(message); }
}
function failure(error:unknown) {
  if (error instanceof Error && error.message==='UNAUTHORIZED') return NextResponse.json({error:'Unauthorized'},{status:401});
  if (error instanceof TeamError) return NextResponse.json({error:error.message},{status:error.status});
  if (error instanceof z.ZodError) return NextResponse.json({error:'Check the email, role and password. New passwords need at least 12 characters.'},{status:400});
  return NextResponse.json({error:'Unable to change the admin accounts. Please try again.'},{status:400});
}
export async function GET() {
  try {
    const actor=await requireAdmin();
    if(actor.role!=='owner')throw new TeamError('Owner access required.',403);
    const admins=await db()`select id,email,role,created_at from admins order by created_at,id`;
    return NextResponse.json({admins},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {return failure(error);}
}
export async function POST(request:NextRequest) {
  try {
    const actor=await requireAdmin();
    if(actor.role!=='owner')throw new TeamError('Owner access required.',403);
    if(!await checkOrigin())throw new TeamError('Invalid origin.',403);
    if(!await rateLimit('team:'+actor.id,10,15))throw new TeamError('Too many account changes or password attempts. Try again later.',429);
    const raw=await request.text();
    if(Buffer.byteLength(raw)>4000)throw new TeamError('Request too large.',413);
    const data=mutation.parse(JSON.parse(raw));
    await db().begin(async sql=>{
      // Serialize account mutations, and recheck the acting owner's role/password.
      const owners=await sql`select id,password_hash from admins where role='owner' order by id for update`;
      const current=owners.find(row=>String(row.id)===String(actor.id));
      if(!current)throw new TeamError('Owner access required.',403);
      if(!verifyPassword(data.currentPassword,String(current.password_hash)))throw new TeamError('Your current password is incorrect.',403);
      if(data.action==='create') {
        const exists=await sql`select id from admins where lower(email)=${data.email}`;
        if(exists.length)throw new TeamError('An admin with that email already exists.',409);
        const salt=randomBytes(16).toString('hex');
        const hash='scrypt:'+salt+':'+scryptSync(data.password,salt,64).toString('hex');
        const created=await sql`insert into admins(email,password_hash,role) values(${data.email},${hash},${data.role}) returning id`;
        await sql`insert into audit_logs(admin_id,action,entity,entity_id) values(${actor.id},'create','admin',${String(created[0].id)})`;
      } else {
        if(String(data.id)===String(actor.id))throw new TeamError('You cannot remove your own account.',409);
        const target=await sql`select id,role from admins where id=${data.id} for update`;
        if(!target.length)throw new TeamError('This admin account no longer exists.',404);
        if(target[0].role==='owner'&&owners.length<=1)throw new TeamError('The last owner cannot be removed.',409);
        // sessions.admin_id uses ON DELETE CASCADE, revoking every target session.
        await sql`delete from admins where id=${data.id}`;
        await sql`insert into audit_logs(admin_id,action,entity,entity_id) values(${actor.id},'delete','admin',${String(data.id)})`;
      }
    });
    return NextResponse.json({ok:true});
  } catch(error) {return failure(error);}
}
