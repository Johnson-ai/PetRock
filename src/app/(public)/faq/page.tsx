import {publicContent,pageMetadata} from '@/lib/content';
export async function generateMetadata(){return pageMetadata('faq','Frequently asked questions')}
export default async function FAQ(){const c=await publicContent();let items:{question:string,answer:string}[]=[];try{items=JSON.parse(c['faq.items'])}catch{}return <main className="page article"><h1>{c['faq.title']}</h1>{items.map((x,i)=><details key={i}><summary>{x.question}</summary><p>{x.answer}</p></details>)}</main>}
