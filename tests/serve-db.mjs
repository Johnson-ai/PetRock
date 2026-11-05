// Isolated in-memory PostgreSQL-compatible fixture; never uses DATABASE_URL.
import {PGlite} from '@electric-sql/pglite';
import {PGLiteSocketServer} from '@electric-sql/pglite-socket';
import {readFileSync} from 'node:fs';
import {scryptSync} from 'node:crypto';
const db=await PGlite.create();await db.exec(readFileSync(new URL('../db/schema.sql',import.meta.url),'utf8'));
const hash='scrypt:test-salt:'+scryptSync('test-only-password-123','test-salt',64).toString('hex');
for(const role of ['owner','editor'])await db.query('insert into admins(email,password_hash,role) values($1,$2,$3)',[role+'@example.com',hash,role]);
await db.exec("insert into services(slug,title,summary,body,price) values ('consultations','Consultations','Wellness consultations','Talk to our veterinary team.','Contact for pricing'); insert into settings(key,value) values('business_name','PetRock Veterinary')");
const server=new PGLiteSocketServer({db,host:'127.0.0.1',port:55440,maxConnections:20});await server.start();console.log('Test database ready');
process.on('SIGTERM',async()=>{await server.stop();await db.close();process.exit(0)});
