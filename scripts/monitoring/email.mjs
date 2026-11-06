import { randomUUID } from 'node:crypto';
import { jsonRequest, required, retry, sleep } from './http.mjs';

export const emailSecrets = ['MONITOR_BREVO_API_KEY', 'MONITOR_EMAIL_FROM', 'MONITOR_EMAIL_TO',
  'MONITOR_GMAIL_CLIENT_ID', 'MONITOR_GMAIL_CLIENT_SECRET', 'MONITOR_GMAIL_REFRESH_TOKEN'];

export async function emailDelivery(env, { json = jsonRequest, wait = sleep, now = Date.now, deliveryTimeoutMs = 180_000 } = {}) {
  required(env, emailSecrets);
  const id = `all8-monitor-${randomUUID()}`;
  const subject = `[ALL8 MONITOR] ${id}`;
  // Authenticate and verify the intended dedicated mailbox before sending anything.
  const auth = await json('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.MONITOR_GMAIL_CLIENT_ID,
      client_secret: env.MONITOR_GMAIL_CLIENT_SECRET, refresh_token: env.MONITOR_GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token' }).toString(),
  });
  if (!auth.access_token) throw new Error('Mailbox authorization did not return an access token');
  const headers = { Authorization: `Bearer ${auth.access_token}` };
  const profile = await retry(() => json('https://gmail.googleapis.com/gmail/v1/users/me/profile', { headers }));
  if (profile.emailAddress?.toLowerCase() !== env.MONITOR_EMAIL_TO.toLowerCase()) throw new Error('Authorized mailbox does not match the dedicated recipient');
  // Direct transactional message only: no site form, contact upsert, list, template or CRM automation.
  // Deliberately no send retry: a timeout may mean Brevo accepted the first request.
  const accepted = await json('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': env.MONITOR_BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ sender: { email: env.MONITOR_EMAIL_FROM, name: 'ALL8 Webworks Monitor' },
      to: [{ email: env.MONITOR_EMAIL_TO }], subject,
      textContent: `Delivery probe ${id}. Synthetic monitoring only. No customer data.`,
      tags: ['all8-monitor', 'delivery-probe'] }),
  });
  if (!accepted.messageId) throw new Error('Brevo acceptance response missing messageId');
  console.log('Brevo accepted the monitoring message; inbox delivery is not yet confirmed.');
  const deadline = now() + deliveryTimeoutMs;
  let consecutiveReadFailures = 0;
  while (now() < deadline) {
    const remaining = () => Math.max(1, Math.min(10_000, deadline - now()));
    try {
      const query = new URLSearchParams({ q: `in:inbox subject:${id}`, maxResults: '10' });
      const inbox = await json(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${query}`, { headers }, { timeoutMs: remaining() });
      for (const message of inbox.messages ?? []) {
        if (now() >= deadline) break;
        const detail = await json(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(message.id)}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To`, { headers }, { timeoutMs: remaining() });
        const header = (name) => detail.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';
        if (header('Subject') === subject && header('From').includes(env.MONITOR_EMAIL_FROM) &&
            header('To').includes(env.MONITOR_EMAIL_TO) && detail.labelIds?.includes('INBOX') && now() <= deadline) {
          return `Confirmed dedicated inbox receipt (${id})`;
        }
      }
      consecutiveReadFailures = 0;
    } catch {
      if (++consecutiveReadFailures >= 3) throw new Error('Mailbox read failed after 3 attempts; Brevo acceptance does not confirm inbox delivery');
    }
    await wait(Math.min(10_000, Math.max(0, deadline - now())));
  }
  throw new Error('Brevo accepted the message, but dedicated inbox receipt was NOT confirmed within 180 seconds');
}
