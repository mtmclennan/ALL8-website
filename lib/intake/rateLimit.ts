import { headers } from 'next/headers';
import { limitContact } from '@/lib/rate-limit';

export async function checkRateLimit() {
  const h = await headers();
  const ip =
    (h.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim() || 'unknown';
  const { ok, resetSeconds } = await limitContact(`contact:${ip}`).catch(
    () => ({ ok: true, resetSeconds: 0 })
  );
  if (!ok)
    throw new Error(`Too many requests. Wait ${Math.max(resetSeconds, 5)}s`);
  return ip;
}
