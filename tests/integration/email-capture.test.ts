import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import sendEmail from '../../lib/email/emailBrevo';

afterEach(() => vi.unstubAllEnvs());
beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
const lead = { name: 'Test Owner', email: 'monitor@example.invalid', projectType: 'Lead Leak Review' };

it('email provider rejection prevents primary capture and customer acknowledgement', async () => {
  vi.stubEnv('BREVO_API_KEY', 'test-only');
  vi.stubEnv('CONTACT_TO', 'owner@example.invalid');
  const request = vi.mocked(fetch).mockResolvedValueOnce(new Response('failure', { status: 500 }));
  await expect(sendEmail(lead)).rejects.toThrow('Owner lead notification failed');
  expect(request).toHaveBeenCalledOnce();
  const payload = JSON.parse(String(request.mock.calls[0][1]?.body));
  expect(payload.to).toEqual([{ email: 'owner@example.invalid' }]);
  expect(console.error).toHaveBeenCalledWith('[LeadSubmission]', {
    event: 'owner_notification_failed', reason: 'provider_http_error', status: 500,
  });
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
  expect(console.error).toHaveBeenCalledWith('[LeadSubmission]', {
    event: 'owner_notification_failed', reason: 'missing_provider_key',
  });
});

it('missing owner destination fails before any provider call', async () => {
  vi.stubEnv('BREVO_API_KEY', 'test-only');
  vi.stubEnv('CONTACT_TO', '');
  await expect(sendEmail(lead)).rejects.toThrow('Missing CONTACT_TO');
  expect(fetch).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledWith('[LeadSubmission]', {
    event: 'owner_notification_failed', reason: 'missing_owner_recipient',
  });
});

it.each(['owner', 'customer'])('%s network errors never enter diagnostics', async (recipient) => {
  vi.stubEnv('BREVO_API_KEY', 'private-secret');
  vi.stubEnv('CONTACT_TO', 'owner@example.invalid');
  if (recipient === 'customer') vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 201 }));
  vi.mocked(fetch).mockRejectedValueOnce(new Error('private-name private@example.invalid 555-0100 192.0.2.1 private-secret secret-token form-contents'));
  if (recipient === 'owner') await expect(sendEmail(lead)).rejects.toThrow('Owner lead notification failed');
  else await expect(sendEmail(lead)).resolves.toBeUndefined();
  expect(console.error).toHaveBeenCalledWith('[LeadSubmission]', {
    event: recipient === 'owner' ? 'owner_notification_failed' : 'customer_acknowledgement_failed', reason: 'provider_network_error',
  });
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(/private-name|private@|555-0100|192\.0\.2\.1|private-secret|secret-token|form-contents/);
});

it('bounds owner delivery with an abort signal and reports a safe timeout', async () => {
  vi.stubEnv('BREVO_API_KEY', 'test-only');
  vi.stubEnv('CONTACT_TO', 'owner@example.invalid');
  const controller = new AbortController();
  vi.spyOn(AbortSignal, 'timeout').mockReturnValue(controller.signal);
  vi.mocked(fetch).mockImplementationOnce(async (_url, options) => new Promise<Response>((_resolve, reject) => {
    options!.signal!.addEventListener('abort', () => reject(options!.signal!.reason), { once: true });
  }));
  const pending = sendEmail(lead);
  controller.abort(new DOMException('private-provider-response', 'TimeoutError'));
  await expect(pending).rejects.toThrow('Owner lead notification failed');
  expect(AbortSignal.timeout).toHaveBeenCalledWith(10_000);
  expect(fetch).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith('[LeadSubmission]', {
    event: 'owner_notification_failed', reason: 'provider_timeout',
  });
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain('private-provider-response');
});
