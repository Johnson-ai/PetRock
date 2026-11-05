import {pageMetadata} from '@/lib/content';
import {Text} from '@/components/Content';
import {Suspense} from 'react';import EnquiryForm from '@/components/EnquiryForm';export async function generateMetadata(){return pageMetadata('book','Request an appointment')};
export default function Book(){return <main className="page formPage"><div><div className="eyebrow"><Text id="book.page.tsx.1"/></div><h1><Text id="book.page.tsx.2"/></h1><p className="lede"><Text id="book.page.tsx.3"/></p><div className="infoCard"><strong><Text id="book.page.tsx.4"/></strong><p><Text id="book.page.tsx.5"/></p></div></div><Suspense><EnquiryForm kind="appointment"/></Suspense></main>}
