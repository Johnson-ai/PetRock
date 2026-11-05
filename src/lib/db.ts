import 'server-only';import postgres from 'postgres';
const url=process.env.DATABASE_URL;
const globalDb=globalThis as unknown as {petrockSql?:ReturnType<typeof postgres>};
export const sql=globalDb.petrockSql??(url?postgres(url,{max:Math.max(1,Math.min(10,Number(process.env.DB_POOL_SIZE)||5)),prepare:false,connect_timeout:10}):null);
if(process.env.NODE_ENV!=='production'&&sql)globalDb.petrockSql=sql;
export function db(){if(!sql)throw Error('DATABASE_URL is missing');return sql}
export async function settings(){const rows=await db()`select key,value from settings`;return Object.fromEntries(rows.map(x=>[String(x.key),String(x.value)])) as Record<string,string>}
export async function audit(adminId:number,action:string,entity:string,id:string){await db()`insert into audit_logs(admin_id,action,entity,entity_id) values(${adminId},${action},${entity},${id})`}
