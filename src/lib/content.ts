import 'server-only';
import {cache} from 'react';
import type {Metadata} from 'next';
import {db} from './db';
import defaults from './content-defaults.json';
export const publicContent=cache(async ():Promise<Record<string,string>>=>{try{const rows=await db()`select key,value from settings`;const services=await db()`select slug,title from services where active=true order by sort_order,title`;return {...defaults,'services.options':JSON.stringify(services),...Object.fromEntries(rows.map(r=>[r.key,r.value]))}}catch{return {...defaults}}});
export async function pageMetadata(key:string,title:string):Promise<Metadata>{const c=await publicContent();return {title:c['seo.'+key+'.title']||title,description:c['seo.'+key+'.description']||c['seo.description']||'Veterinary care in Akure, Ondo State.',openGraph:{title:c['seo.'+key+'.title']||title,description:c['seo.'+key+'.description']||c['seo.description']||'Veterinary care in Akure, Ondo State.'}}}
