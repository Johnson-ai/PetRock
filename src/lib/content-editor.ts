export type ContentArea='home'|'pages'|'navigation'|'faq'|'policies'|'forms'|'seo'|'images'|'clinic';
export type ContentField={key:string,label:string,kind?:'long'|'href'|'toggle'|'links'|'faq',help?:string};
export type ContentGroup={title:string,fields:ContentField[]};
export const contentAreas:{id:ContentArea,label:string,description:string}[]=[
 {id:'home',label:'Homepage',description:'Edit each section in the order visitors see it.'},
 {id:'pages',label:'Other pages',description:'Choose a page to edit its introduction, buttons and supporting text.'},
 {id:'navigation',label:'Header & footer',description:'Manage branding, navigation and footer links.'},
 {id:'faq',label:'FAQs',description:'Add, reorder and answer common questions.'},
 {id:'policies',label:'Policies',description:'Keep your privacy, cookie and terms pages accurate.'},
 {id:'forms',label:'Enquiry forms',description:'Edit form labels, consent wording and confirmation messages.'},
 {id:'seo',label:'Search previews',description:'Set the title and description used by search engines and shared links.'},
 {id:'images',label:'Images',description:'Upload photography, choose where it appears and describe it.'},
 {id:'clinic',label:'Clinic & WhatsApp',description:'Update contact details, hours, announcements and WhatsApp.'},
];
export const pageChoices=[['about','About us'],['services','Services'],['blog','Pet journal'],['pharmacy','Pharmacy'],['contact','Contact'],['book','Appointments']];
export const policyChoices=[['privacy','Privacy policy'],['cookies','Cookie policy'],['terms','Terms of use']];
const f=(key:string,label:string,kind?:ContentField['kind'],help?:string):ContentField=>({key,label,kind,help});
const numbered=(prefix:string,items:[number,string][])=>items.map(([n,label])=>f(prefix+'.'+n,label));
const group=(title:string,fields:ContentField[]):ContentGroup=>({title,fields});
const home=(items:[number,string][])=>numbered('page.tsx',items);
export function groupsFor(area:ContentArea,page='about',seoPage='home'):ContentGroup[]{
 if(area==='home')return [
  group('Hero',[f('hero_title','Main headline'),f('hero_subtitle','Introduction','long'),...home([[1,'Eyebrow'],[2,'Primary button label']]),f('link.page.1.href','Primary button destination','href'),...home([[3,'Secondary button label']]),f('link.page.2.href','Secondary button destination','href'),...home([[4,'Supporting note'],[5,'Floating card caption']])]),
  group('Care highlights',home([[6,'First highlight'],[7,'Second highlight'],[8,'Third highlight']])),
  group('Services section',[...home([[9,'Eyebrow'],[10,'Headline — first line'],[11,'Headline — second line'],[12,'All services link label']]),f('link.page.3.href','All services destination','href'),...home([[13,'Service card link label']])]),
  group('About PetRock',[...home([[14,'Photo caption'],[15,'Eyebrow'],[16,'Headline'],[17,'Description'],[18,'Button label']]),f('link.page.4.href','Button destination','href')]),
  group('Request care banner',[...home([[19,'Eyebrow'],[20,'Headline — first line'],[21,'Headline — second line'],[22,'Description'],[23,'Button label']]),f('link.page.5.href','Button destination','href')]),
  group('Journal section',[...home([[24,'Eyebrow'],[25,'Headline'],[26,'Introduction'],[27,'Button label']]),f('link.page.6.href','Button destination','href')]),
 ];
 if(area==='navigation')return [
  group('Header branding',[...numbered('layout.tsx',[[1,'Top bar message'],[2,'Top bar supporting text'],[3,'Brand name'],[4,'Brand subtitle'],[10,'Appointment button label']]),f('link.layout.1.href','Brand link destination','href'),f('link.layout.2.href','Appointment button destination','href')]),
  group('Main navigation',[f('navigation.links','Navigation links','links')]),
  group('Footer branding',numbered('layout.tsx',[[11,'Brand name'],[12,'Brand subtitle'],[13,'Clinic description'],[14,'Explore column heading'],[19,'Information column heading'],[24,'Copyright wording']])),
  group('Footer links',[f('link.layout.3.href','Brand link destination','href'),f('footer.explore.links','Explore links','links'),f('footer.information.links','Information links','links')]),
 ];
 if(area==='faq')return [group('Frequently asked questions',[f('faq.title','Page headline'),f('faq.items','Questions & answers','faq')])];
 if(area==='policies')return [group(policyChoices.find(([id])=>id===page)?.[1]||'Policy',numbered(page+'.page.tsx',[[1,'Eyebrow'],[2,'Page title'],[3,'Policy text']]).map(x=>x.key.endsWith('.3')?{...x,kind:'long'}:x))];
 if(area==='forms')return [
  group('Headings & buttons',[f('form.contact.title','Contact form heading'),f('form.appointment.title','Appointment form heading'),f('form.send','Send button'),f('form.submitting','Sending message')]),
  group('Contact & appointment fields',numbered('EnquiryForm.tsx',[[4,'Full name label'],[5,'Email label'],[6,'Phone label'],[7,'Pet name label'],[8,'Service label'],[9,'Service prompt'],[10,'Preferred date label'],[11,'Preferred time label'],[12,'Flexible time option'],[13,'Morning option'],[14,'Afternoon option'],[15,'Evening option'],[16,'Message label']])),
  group('Privacy & consent',numbered('EnquiryForm.tsx',[[17,'Consent text before the policy link'],[18,'Privacy link label'],[19,'Consent text after the policy link'],[21,'Form supporting note']])),
  group('After submission',numbered('EnquiryForm.tsx',[[1,'Confirmation heading'],[2,'Confirmation message'],[3,'Send another request button']])),
 ];
 if(area==='seo')return [group('Search preview',[f('seo.'+seoPage+'.title','Page title'),f('seo.'+seoPage+'.description','Page description','long')]),group('Website default',[f('seo.description','Default description','long')])];
 if(area==='clinic')return [
  group('Clinic details',[f('business_name','Business name'),f('location','Town / area'),f('address','Clinic address','long'),f('phone','Phone number'),f('email','Email address'),f('hours','Opening hours','long')]),
  group('WhatsApp',[f('whatsapp','WhatsApp number',undefined,'Include the country code, for example +234… . Leave blank until ready.'),f('whatsapp_enabled','Show floating contact button','toggle'),f('whatsapp_label','WhatsApp button label'),f('whatsapp_message','Prefilled message','long','Visitors can edit this message before sending it.'),f('contact_fallback_label','Button label when no WhatsApp number is set')]),
  group('Other contact links',[f('contact_call_label','Call button label'),f('contact_directions_label','Directions button label')]),
  group('Clinic notices',[f('announcement','Website announcement','long','Leave blank to hide the extra announcement bar.'),f('emergency_notice','Emergency guidance','long')]),
 ];
 const lists:Record<string,[number,string][] >={
  about:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Feature headline'],[5,'Feature description'],[6,'Supporting description'],[7,'Button label']],
  services:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Service card link label']],
  blog:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Article link label'],[5,'Empty journal heading'],[6,'Empty journal message']],
  pharmacy:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Product enquiry link label'],[5,'Empty catalogue heading'],[6,'Empty catalogue message'],[7,'Contact button label']],
  contact:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Contact details heading'],[5,'Location label'],[6,'Phone label'],[7,'Email label'],[8,'Hours label'],[9,'Message when phone is not set']],
  book:[[1,'Eyebrow'],[2,'Page headline'],[3,'Introduction'],[4,'Urgent help heading'],[5,'Urgent help message']],
 };
 if(area==='pages'){
  const result=[group(pageChoices.find(([id])=>id===page)?.[1]||'Page',numbered(page+'.page.tsx',lists[page]||[]))];
  if(page==='about')result[0].fields.push(f('link.about.page.1.href','Button destination','href'));
  if(page==='pharmacy')result[0].fields.push(f('link.pharmacy.page.1.href','Product enquiry destination','href'),f('link.pharmacy.page.2.href','Empty catalogue contact destination','href'));
  if(page==='services')result.push(group('Service detail pages',[...numbered('services.slug.page.tsx',[[1,'Eyebrow'],[2,'Details heading'],[3,'Visit planning heading'],[4,'Price label'],[5,'Booking confirmation note'],[6,'Request button label'],[7,'Back link label']]),f('link.services.[slug].page.1.href','Back link destination','href')]));
  if(page==='blog')result.push(group('Article detail pages',[f('blog.slug.page.tsx.1','Back link label'),f('link.blog.[slug].page.1.href','Back link destination','href')]));
  return result;
 }
 return [];
}
export function seoChoices(values:Record<string,string>){
 const names:Record<string,string>={home:'Homepage',about:'About us',services:'Services',blog:'Pet journal',book:'Appointments',contact:'Contact',privacy:'Privacy policy',cookies:'Cookie policy',terms:'Terms of use',pharmacy:'Pharmacy',faq:'FAQs'};
 return Object.keys(values).filter(k=>k.startsWith('seo.')&&k.endsWith('.title')).map(k=>{const id=k.slice(4,-6);return [id,names[id]||values[k]||id.replaceAll('-',' ')]});
}
export function allContentGroups(values:Record<string,string>){return [
 ...groupsFor('home'),...pageChoices.flatMap(([id])=>groupsFor('pages',id)),...groupsFor('navigation'),...groupsFor('faq'),...policyChoices.flatMap(([id])=>groupsFor('policies',id)),...groupsFor('forms'),...seoChoices(values).flatMap(([id])=>groupsFor('seo','',id).slice(0,1)),...groupsFor('clinic'),
 ];}
