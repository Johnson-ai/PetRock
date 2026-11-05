import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);const read=p=>readFileSync(new URL(p,root),'utf8');
test('database schema has core tables',()=>{const s=read('db/schema.sql');for(const t of ['admins','sessions','enquiries','services','posts','products','audit_logs','request_limits'])assert.match(s,new RegExp('create table if not exists '+t))});
test('no public admin link in site navigation',()=>assert.ok(!read('src/app/(public)/layout.tsx').includes('href="/admin')));
test('no production environment file bundled',()=>assert.ok(!existsSync(new URL('.env.local',root))));
test('critical route handlers exist',()=>{for(const f of ['src/app/api/admin/login/route.ts','src/app/api/admin/manage/route.ts','src/app/api/enquiries/route.ts'])assert.ok(existsSync(new URL(f,root)))});
