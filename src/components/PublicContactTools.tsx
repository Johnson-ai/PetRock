import {MessageCircle, Phone, MapPin, ArrowUpRight} from 'lucide-react';
import {publicContent} from '@/lib/content';
import {whatsappLink, directionsLink} from '@/lib/contact-links';

export async function FloatingWhatsApp() {
  const content = await publicContent();
  if (content.whatsapp_enabled === 'false') return null;
  const href = whatsappLink(content.whatsapp || '', content.whatsapp_message);
  // Keep a working contact path until the clinic has configured its number.
  return <a className={`floatingContact ${href ? 'whatsappReady' : ''}`}
    data-whatsapp={href ? 'ready' : 'unconfigured'}
    href={href || '/contact'}
    target={href ? '_blank' : undefined}
    rel={href ? 'noopener noreferrer' : undefined}
    aria-label={href ? content.whatsapp_label : content.contact_fallback_label}>
    <MessageCircle aria-hidden="true" size={24}/>
    <span>{href ? content.whatsapp_label : content.contact_fallback_label}</span>
    <ArrowUpRight aria-hidden="true" size={18}/>
  </a>;
}

export async function ContactActions() {
  const content = await publicContent();
  const whatsapp = whatsappLink(content.whatsapp || '', content.whatsapp_message);
  // A town name alone is not a confirmed clinic location.
  const directions = directionsLink(content.address || '');
  return <div className="contactActions">
    {whatsapp && <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" size={18}/>{content.whatsapp_label}</a>}
    {content.phone && <a className="btn outline" href={'tel:' + content.phone}><Phone aria-hidden="true" size={18}/>{content.contact_call_label}</a>}
    {directions && <a className="btn outline" href={directions} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden="true" size={18}/>{content.contact_directions_label}</a>}
  </div>;
}

export async function FooterClinicDetails() {
  const content = await publicContent();
  return <div className="footerClinicDetails">
    {content.phone && <a href={'tel:' + content.phone}>{content.phone}</a>}
    {content.email && <a href={'mailto:' + content.email}>{content.email}</a>}
    {content.address && <p>{content.address}</p>}
    {content.hours && <p>{content.hours}</p>}
  </div>;
}
