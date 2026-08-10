export function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return `tel:+1${digits}`;
}

export function toSmsHref(phone: string, body?: string) {
  const digits = phone.replace(/\D/g, "");
  const query = body ? `?&body=${encodeURIComponent(body)}` : "";

  return `sms:+1${digits}${query}`;
}
