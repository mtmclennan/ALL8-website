import { afterEach, expect, it, vi } from 'vitest';

import sendEmail from '../../lib/email/emailBrevo';

afterEach(() => vi.unstubAllEnvs());
const lead = { name: 'Test Owner', email: 'monitor@example.invalid', projectType: 'Lead Leak Review' };

it('email provider rejection prevents primary capture and customer acknowledgement', async () => {
  vi.stubEnv('BREVO_API_KEY', 'test-only');
  vi.stubEnv('CONTACT_TO', 'owner@example.invalid');
  const request = vi.mocked(fetch).mockResolvedValueOnce(new Response('failure', { status: 500 }));
  await expect(sendEmail(lead)).rejects.toThrow('Owner lead notification failed');
  expect(request).toHaveBeenCalledOnce();
  const payload = JSON.parse(String(request.mock.calls[0][1]?.body));
  expect(payload.to).toEqual([{ email: 'owner@example.invalid' }]);
});

it('secondary acknowledgement failure is logged after successful primary acceptance', async () => {
  vi.stubEnv('BREVO_API_KEY', 'test-only');
  vi.stubEnv('CONTACT_TO', 'owner@example.invalid');
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const request = vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }))
    .mockResolvedValueOnce(new Response('failure', { status: 500 }));
  await expect(sendEmail(lead)).resolves.toBeUndefined();
  expect(request).toHaveBeenCalledTimes(2);
  expect(console.error).toHaveBeenCalled();
});

it('missing provider credentials fail explicitly without attempting delivery', async () => {
  vi.stubEnv('BREVO_API_KEY', '');
  await expect(sendEmail(lead)).rejects.toThrow('Missing BREVO_API_KEY');
  expect(fetch).not.toHaveBeenCalled();
});
