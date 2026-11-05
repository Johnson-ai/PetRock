'use client';
import {useEffect,useMemo,useState} from 'react';
import defaults from '@/lib/content-defaults.json';
import {contentAreas,pageChoices,policyChoices,groupsFor,allContentGroups,seoChoices,type ContentArea,type ContentField} from '@/lib/content-editor';
type Media={id:number|string,url:string,alt:string,width:number,height:number};
type Pair=Record<string,string>;
type Props={initial:Record<string,string>,media:Media[],placementLabels?:Record<string,string>};
export default function ContentEditor({initial,media,placementLabels={}}:Props) {
 const [values,setValues]=useState<Record<string,string>>({...defaults,...initial});
 const [saved,setSaved]=useState(values),[library,setLibrary]=useState(media);
 const [area,setArea]=useState<ContentArea>('home'),[page,setPage]=useState('about'),[policy,setPolicy]=useState('privacy'),[seoPage,setSeoPage]=useState('home');
 const [filter,setFilter]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[slot,setSlot]=useState('hero');
 const changed=Object.keys(values).filter(key=>values[key]!==saved[key]);
 const current=contentAreas.find(item=>item.id===area)!;
 const set=(key:string,value:string)=>setValues(previous=>({...previous,[key]:value}));
 useEffect(()=>{if(!changed.length)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[changed.length]);
 const groups=useMemo(()=>{
   if(!filter.trim())return groupsFor(area,area==='policies'?policy:page,seoPage);
   const search=filter.toLowerCase();
   return allContentGroups(values).map(group=>({...group,fields:group.fields.filter(field=>`${group.title} ${field.label} ${values[field.key]||''}`.toLowerCase().includes(search))})).filter(group=>group.fields.length);
 },[area,page,policy,seoPage,filter,values]);
 async function save() {
   const payload=Object.fromEntries(changed.map(key=>[key,values[key]]));setBusy(true);setNotice('');
   try{const response=await fetch('/api/admin/content',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw Error(result.error||'Unable to save.');setSaved(previous=>({...previous,...payload}));setNotice('Your changes are now published.');}
   catch(error){setNotice(error instanceof Error?error.message:'Unable to save. Please retry.');}
   finally{setBusy(false);}
 }
 async function upload(event:React.FormEvent<HTMLFormElement>) {
   event.preventDefault();const form=event.currentTarget;setBusy(true);setNotice('');
   try{const response=await fetch('/api/admin/media',{method:'POST',body:new FormData(form)});const result=await response.json();if(!response.ok)throw Error(result.error);const list=await fetch('/api/admin/media',{cache:'no-store'});if(!list.ok)throw Error('Image uploaded. Refresh the page to update the library.');setLibrary((await list.json()).media);form.reset();setNotice('Image uploaded. Choose a placement, select your photo and save changes.');}
   catch(error){setNotice(error instanceof Error?error.message:'Upload failed.');}
   finally{setBusy(false);}
 }
 function collection(field:ContentField) {
   let rows:Pair[]=[];try{rows=JSON.parse(values[field.key]||'[]');}catch{}
   const faq=field.kind==='faq',fields=faq?['question','answer']:['label','href'];
   const update=(next:Pair[])=>set(field.key,JSON.stringify(next));
   const move=(index:number,direction:number)=>{const next=[...rows];[next[index],next[index+direction]]=[next[index+direction],next[index]];update(next);};
   return <fieldset className="cmsCollection" key={field.key}><legend>{field.label}</legend>
    {rows.map((row,index)=><div className="cmsCollectionRow" key={index}><div className="cmsRowHeading"><strong>{faq?'Question':'Link'} {index+1}</strong><div className="cmsRowActions"><button type="button" aria-label={`Move ${faq?'question':'link'} ${index+1} up`} disabled={busy||index===0} onClick={()=>move(index,-1)}>↑</button><button type="button" aria-label={`Move ${faq?'question':'link'} ${index+1} down`} disabled={busy||index===rows.length-1} onClick={()=>move(index,1)}>↓</button><button type="button" disabled={busy} onClick={()=>update(rows.filter((_,n)=>n!==index))}>Remove</button></div></div>
      {fields.map(name=><label key={name}>{name==='href'?'Destination page':name[0].toUpperCase()+name.slice(1)}{name==='answer'?<textarea rows={4} value={row[name]||''} onChange={event=>update(rows.map((item,n)=>n===index?{...item,[name]:event.target.value}:item))}/>:<input value={row[name]||''} placeholder={name==='href'?'/services':undefined} onChange={event=>update(rows.map((item,n)=>n===index?{...item,[name]:event.target.value}:item))}/>}</label>)}
    </div>)}
    <button type="button" className="cmsAdd" disabled={busy} onClick={()=>update([...rows,Object.fromEntries(fields.map(name=>[name,'']))])}>+ Add {faq?'question':'link'}</button>
   </fieldset>;
 }
 function renderField(field:ContentField) {
   if(field.kind==='links'||field.kind==='faq')return collection(field);
   const value=values[field.key]||'';
   const multiline=field.kind==='long'||value.length>160;
   return <label className={multiline?'cmsWide':''} key={field.key}>{field.label}
    {field.kind==='toggle'?<select value={value||'true'} onChange={event=>set(field.key,event.target.value)}><option value="true">Show</option><option value="false">Hide</option></select>:multiline?<textarea rows={field.label==='Policy text'?12:4} value={value} maxLength={20000} onChange={event=>set(field.key,event.target.value)}/>:<input value={value} maxLength={20000} placeholder={field.kind==='href'?'/contact':undefined} onChange={event=>set(field.key,event.target.value)}/>}
    {field.help&&<small>{field.help}</small>}{field.kind==='href'&&<small>Use a page address beginning with /.</small>}
   </label>;
 }
 const selectedUrl=values['image.'+slot+'.url'];
 const imageLabel=(id:string)=>({hero:'Homepage · Main image',feature:'Homepage & about · Feature image',...placementLabels})[id]||id.replaceAll('-',' ');
 return <section className="contentWorkspace">
  <div className="cmsToolbar"><div><h2>Website content</h2><p>{changed.length?`${changed.length} unsaved ${changed.length===1?'change':'changes'}`:'Your published content is up to date.'}</p></div><button className="btn" disabled={busy||!changed.length} onClick={save}>{busy?'Saving…':'Save changes'}</button></div>
  {notice&&<p className="notice" role="status">{notice}</p>}
  <div className="cmsLayout"><nav className="cmsAreaNav" aria-label="Content areas">{contentAreas.map(item=><button key={item.id} className={area===item.id&&!filter?'active':''} aria-current={area===item.id&&!filter?'page':undefined} onClick={()=>{setArea(item.id);setFilter('');}}>{item.label}</button>)}</nav>
   <div className="cmsBody"><label className="cmsSearch">Find content<input type="search" value={filter} onChange={event=>setFilter(event.target.value)} placeholder="Search wording or field labels…"/></label>
    <div className="cmsSectionHeading"><h3>{filter?'Search results':current.label}</h3><p>{filter?'Matching content across your website.':current.description}</p></div>
    {!filter&&area==='pages'&&<label className="cmsPagePicker">Page<select value={page} onChange={event=>setPage(event.target.value)}>{pageChoices.map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label>}
    {!filter&&area==='policies'&&<label className="cmsPagePicker">Policy<select value={policy} onChange={event=>setPolicy(event.target.value)}>{policyChoices.map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label>}
    {!filter&&area==='seo'&&<><label className="cmsPagePicker">Page<select value={seoPage} onChange={event=>setSeoPage(event.target.value)}>{seoChoices(values).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label><div className="cmsSearchPreview"><strong>{values['seo.'+seoPage+'.title']}</strong><p>{values['seo.'+seoPage+'.description']}</p></div></>}
    {!filter&&area==='images'?<>
      <form className="cmsCard" onSubmit={upload}><h4>Upload a photo</h4><div className="cmsFieldGrid"><label>Photo<input name="file" type="file" accept="image/jpeg,image/png,image/webp" required/><small>JPEG, PNG or WebP, up to 4 MB.</small></label><label>Image description<input name="alt" required maxLength={300}/><small>Describe what people using screen readers need to know.</small></label></div><button className="btn small" disabled={busy}>Upload to library</button></form>
      <section className="cmsCard"><h4>Image placement</h4><label>Where should this image appear?<select value={slot} onChange={event=>setSlot(event.target.value)}>{Object.keys(values).filter(key=>key.startsWith('image.')&&key.endsWith('.url')).map(key=>key.slice(6,-4)).map(id=><option key={id} value={id}>{imageLabel(id)}</option>)}</select></label>
       <div className="cmsPlacement">{selectedUrl?<img src={selectedUrl} alt={values['image.'+slot+'.alt']||''} width={240} height={180}/>:<p>No photo assigned to this placement.</p>}<div><label>Description for this placement<input value={values['image.'+slot+'.alt']||''} onChange={event=>set('image.'+slot+'.alt',event.target.value)} maxLength={300}/></label><button type="button" disabled={busy||!selectedUrl} onClick={()=>{set('image.'+slot+'.url','');set('image.'+slot+'.alt','');}}>Remove from this placement</button></div></div>
       <h4>Choose a library photo</h4>{!library.length&&<p>Upload your first clinic photo above, then choose it here.</p>}<div className="mediaGrid">{library.map(image=><button type="button" key={image.id} disabled={busy} aria-pressed={selectedUrl===image.url} onClick={()=>{set('image.'+slot+'.url',image.url);set('image.'+slot+'.alt',image.alt);setNotice('Photo selected. Save changes to publish this placement.');}}><img src={image.url} alt={image.alt} width={160} height={120}/><span>{image.alt}</span></button>)}</div>
      </section>
    </>:<fieldset className="cmsFields" disabled={busy}>{groups.map((group,index)=><section className="cmsCard" key={group.title+index}><h4>{group.title}</h4><div className="cmsFieldGrid">{group.fields.map(renderField)}</div></section>)}{!groups.length&&<p>No matching content found.</p>}</fieldset>}
   </div>
  </div>
 </section>;
}
