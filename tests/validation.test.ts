import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {contentSchema,safeHref} from '../src/lib/content-validation';
import {validateImage,MAX_UPLOAD} from '../src/lib/upload';
import {enquirySchema} from '../src/lib/validation';
test('content rejects unknown fields, executable URLs and invalid FAQ',()=>{for(const value of [{'unknown':'x'},{'navigation.links':'[{"label":"x","href":"javascript:alert(1)"}]'},{'navigation.links':'[{"label":"x","href":"//evil.com"}]'},{'faq.items':'not JSON'},{'image.hero.url':'https://evil.com/x.png'}])assert.equal(contentSchema.safeParse(value).success,false);assert.ok(safeHref('/services/consultations'));assert.ok(contentSchema.safeParse({'privacy.page.tsx.2':'<script>alert(1)</script>'}).success)});
test('real image decoding, metadata removal and limits',async()=>{const input=await sharp({create:{width:20,height:30,channels:3,background:'#ffcc00'}}).jpeg().toBuffer();const out=await validateImage(input,'image/jpeg');assert.equal(out.info.format,'webp');assert.equal(out.info.width,20);assert.equal((await sharp(out.data).metadata()).exif,undefined);await assert.rejects(()=>validateImage(input,'image/png'));await assert.rejects(()=>validateImage(Buffer.from('<svg onload="alert(1)"/>'),'image/svg+xml'));await assert.rejects(()=>validateImage(Buffer.alloc(MAX_UPLOAD+1),'image/jpeg'));await assert.rejects(()=>validateImage(Buffer.from('not a photo'),'image/jpeg'))});
test('enquiry validates required fields and bounds',()=>{assert.equal(enquirySchema.safeParse({kind:'appointment',full_name:'x',email:'invalid',phone:'1'}).success,false);assert.ok(enquirySchema.safeParse({kind:'contact',full_name:'Pet Owner',email:'owner@example.com',phone:'08012345678',message:'Question'}).success)});

import {internationalPhone, whatsappLink, directionsLink} from '../src/lib/contact-links';
test('WhatsApp links require international numbers and encode messages safely',()=>{
 assert.equal(internationalPhone('+234 (801) 234-5678'),'2348012345678');
 assert.equal(internationalPhone('00234 801 234 5678'),'2348012345678');
 for(const invalid of ['08012345678','https://wa.me/2348012345678','javascript:alert(1)','++2348012345678','+234+8012345678','123','1234567890123456',''])assert.equal(whatsappLink(invalid),null);
 const link=whatsappLink('+2348012345678','Hello & welcome? #care 🐾');
 assert.equal(new URL(link!).origin,'https://wa.me');
 assert.equal(new URL(link!).pathname,'/2348012345678');
 assert.equal(new URL(link!).searchParams.get('text'),'Hello & welcome? #care 🐾');
 assert.equal(whatsappLink('2348012345678',''),'https://wa.me/2348012345678');
 assert.equal(contentSchema.safeParse({whatsapp:'08012345678'}).success,false);
 assert.equal(contentSchema.safeParse({whatsapp:'+2348012345678',whatsapp_enabled:'true'}).success,true);
 assert.equal(contentSchema.safeParse({whatsapp_enabled:'yes'}).success,false);
 assert.equal(directionsLink('  '),null);
 assert.equal(new URL(directionsLink('Clinic & pets, Akure')!).searchParams.get('query'),'Clinic & pets, Akure');
});

import {groupsFor,allContentGroups} from '../src/lib/content-editor';
import contentDefaults from '../src/lib/content-defaults.json';
test('content editor organizes fields into named sections and validates editable keys',()=>{
 const groups=groupsFor('home');assert.equal(groups[0].title,'Hero');assert.ok(groups[0].fields.some(field=>field.label==='Main headline'&&field.key==='hero_title'));assert.equal(groups.length,6);
 assert.equal(groupsFor('policies','privacy')[0].fields.find(field=>field.label==='Policy text')?.key,'privacy.page.tsx.3');
 assert.ok(groupsFor('clinic').some(group=>group.title==='WhatsApp'));
 for(const group of allContentGroups(contentDefaults))for(const field of group.fields){assert.ok(field.key in contentDefaults,field.key);assert.equal(/\.tsx|^image\.|^seo\./.test(field.label),false,field.label);}
});
