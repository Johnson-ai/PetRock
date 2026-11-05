'use client';
import {useState} from 'react';
export type TeamMember={id:number|string,email:string,role:'owner'|'editor',created_at:string};
export default function TeamManager({initial,currentId}:{initial:TeamMember[],currentId:number|string}) {
  const [admins,setAdmins]=useState(initial),[busy,setBusy]=useState(false),[notice,setNotice]=useState('');
  const [removing,setRemoving]=useState<TeamMember|null>(null);
  async function send(payload:Record<string,unknown>) {
    const response=await fetch('/api/admin/team',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();
    if(!response.ok)throw Error(result.error||'Unable to update accounts.');
    const list=await fetch('/api/admin/team',{cache:'no-store'});
    if(!list.ok)throw Error('Account changed. Refresh this page to see the updated list.');
    setAdmins((await list.json()).admins);
  }
  async function create(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();const form=event.currentTarget;setBusy(true);setNotice('');
    try {await send({action:'create',...Object.fromEntries(new FormData(form))});form.reset();setNotice('Admin account created. Share its initial password through your trusted private channel.');}
    catch(error){setNotice(error instanceof Error?error.message:'Unable to create account.');}
    finally{setBusy(false);}
  }
  async function remove(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();if(!removing)return;const form=event.currentTarget;setBusy(true);setNotice('');
    try {await send({action:'delete',id:Number(removing.id),currentPassword:new FormData(form).get('currentPassword')});setRemoving(null);setNotice('Admin removed. Their active sessions have been revoked.');}
    catch(error){setNotice(error instanceof Error?error.message:'Unable to remove account.');}
    finally{setBusy(false);}
  }
  return <section className="teamManager"><p className="lede">Give each staff member their own account and the access they need.</p>
    {notice&&<p className="notice" role="status">{notice}</p>}
    <div className="adminTableWrap"><table><thead><tr><th>Email</th><th>Access</th><th>Account</th></tr></thead><tbody>{admins.map(admin=><tr key={admin.id}><td>{admin.email}{String(admin.id)===String(currentId)&&<span className="cmsBadge">You</span>}</td><td>{admin.role==='owner'?'Owner':'Editor'}</td><td><button disabled={busy||String(admin.id)===String(currentId)} onClick={()=>{setRemoving(admin);setNotice('');}}>{String(admin.id)===String(currentId)?'Current account':'Remove admin'}</button></td></tr>)}</tbody></table></div>
    {removing&&<form className="cmsCard teamRemove" onSubmit={remove}><h2>Remove {removing.email}?</h2><p>Their sign-in access and all active sessions will end immediately. Their published content will stay on the website.</p><label>Your current password<input name="currentPassword" type="password" autoComplete="current-password" required maxLength={256}/></label><div className="actions"><button className="btn danger" disabled={busy}>Remove this admin</button><button type="button" onClick={()=>setRemoving(null)} disabled={busy}>Cancel</button></div></form>}
    <form className="cmsCard" onSubmit={create}><h2>Create an admin account</h2><div className="cmsFieldGrid"><label>Email address<input name="email" type="email" autoComplete="off" required maxLength={254}/></label><label>Initial password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={256} required/><small>Use a unique password with at least 12 characters.</small></label><label>Access level<select name="role" defaultValue="editor"><option value="editor">Editor</option><option value="owner">Owner</option></select></label><label>Your current password<input name="currentPassword" type="password" autoComplete="current-password" maxLength={256} required/></label></div><p>Editors manage services, articles, products, enquiries and image uploads. Owners also publish global website content and manage admin accounts.</p><button className="btn" disabled={busy}>{busy?'Saving…':'Create admin'}</button></form>
  </section>;
}
