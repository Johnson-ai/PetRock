/** Require an international number; never guess a country or accept a URL. */
export function internationalPhone(value: string): string | null {
  const input = value.trim();
  if (!/^(?:\+)?[\d\s().-]+$/.test(input)) return null;
  const digits = input.replace(/[+\s().-]/g, '').replace(/^00/, '');
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function whatsappLink(number: string, message = ''): string | null {
  const digits = internationalPhone(number);
  if (!digits) return null;
  return `https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ''}`;
}

export function directionsLink(address: string): string | null {
  return address.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}` : null;
}
