'use client';
import Link from 'next/link';
import {createContext,useContext} from 'react';
import defaults from '@/lib/content-defaults.json';
const Context=createContext<Record<string,string>>(defaults);
export function ContentProvider({values,children}:{values:Record<string,string>,children:React.ReactNode}){return <Context.Provider value={values}>{children}</Context.Provider>}
export function Text({id}:{id:string}){const c=useContext(Context);return <>{c[id]??(defaults as Record<string,string>)[id]??''}</>}
export function ContentImage({slot,className=''}:{slot:string,className?:string}){const c=useContext(Context);const url=c['image.'+slot+'.url'];return url?<img className={className} src={url} alt={c['image.'+slot+'.alt']||''} width={900} height={1000} loading={slot==='hero'?'eager':'lazy'}/>:null}
export function ContentLinks({area}:{area:string}){const c=useContext(Context);let links:{label:string,href:string}[]=[];try{links=JSON.parse(c[area+'.links']||'[]')}catch{}return <>{links.map((x,i)=><a key={i} href={x.href}>{x.label}</a>)}</>}

export function useContent(){return useContext(Context)}

export function ManagedLink({cmsId,href,...props}:React.ComponentProps<typeof Link>&{cmsId?:string}){const c=useContext(Context);return <Link {...props} href={cmsId?(c[cmsId]||href):href}/> }
