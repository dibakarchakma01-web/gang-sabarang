export const VERIFIED_GOOGLE_MAPS_SEARCH_URL =
  'https://www.google.com/maps/search/?api=1&query=Pagoda+Road+Assambosti+Rangamati+Bangladesh';

export function formatPhoneDisplay(rawPhone: string): string {
  const trimmed = rawPhone.trim();
  const compact = trimmed.replace(/[\s-]+/g, '');
  const bdMobileMatch = /^\+880(\d{4})(\d{6})$/.exec(compact);
  if (bdMobileMatch) {
    return `+880 ${bdMobileMatch[1]}-${bdMobileMatch[2]}`;
  }
  return trimmed;
}

export function toTelHref(rawPhone: string): string | null {
  const compact = rawPhone.trim().replace(/[\s()-]+/g, '');
  if (!/^\+?\d{7,15}$/.test(compact)) {
    return null;
  }
  return `tel:${compact}`;
}

export function toWhatsAppHref(rawWhatsApp: string): string | null {
  const digits = rawWhatsApp.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return null;
  }
  return `https://wa.me/${digits}`;
}

export function toSafeExternalUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
