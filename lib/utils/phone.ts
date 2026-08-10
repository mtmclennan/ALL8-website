export function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return `tel:+1${digits}`;
}
