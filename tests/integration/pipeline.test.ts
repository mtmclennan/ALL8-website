import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ captcha: vi.fn(), limit: vi.fn(), capture: vi.fn(), background: vi.fn(), newsletter: vi.fn() }));
vi.mock('@/lib/intake/verifyCaptcha', () => ({ verifyCaptcha: mocks.captcha }));
vi.mock('@/lib/intake/rateLimit', () => ({ checkRateLimit: mocks.limit }));
vi.mock('@/lib/leads/runLeadBackgroundTasks', () => ({ captureLeadNotification: mocks.capture, runLeadBackgroundTasks: mocks.background, runNewsletterBackgroundTasks: mocks.newsletter }));

import { submitLeadPipeline } from '../../lib/leads/submitLead';
import { submitLeadReview } from '../../app/actions/submit-lead-review';
import { submitNewsletter } from '../../app/actions/submit-newsletter';

const data = { name: 'Test Owner', email: 'monitor@example.invalid', leadType: 'lead-review' as const, token: 'test-token' };
beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset().mockResolvedValue(undefined);
  mocks.captcha.mockResolvedValue(true);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

it('rejects server CAPTCHA failure without primary or secondary integration calls', async () => {
  mocks.captcha.mockResolvedValue(false);
  expect((await submitLeadPipeline(data, 'lead_review')).ok).toBe(false);
  expect(mocks.capture).not.toHaveBeenCalled();
  expect(mocks.background).not.toHaveBeenCalled();
});

it('rate limiting blocks CAPTCHA and downstream calls', async () => {
  mocks.limit.mockRejectedValue(new Error('Too many requests'));
  expect((await submitLeadPipeline(data, 'contact_form')).ok).toBe(false);
  expect(mocks.captcha).not.toHaveBeenCalled();
  expect(mocks.capture).not.toHaveBeenCalled();
});

it('failed durable capture cannot report success or run CRM enrichment', async () => {
  mocks.capture.mockRejectedValue(new Error('Brevo failure'));
  expect((await submitLeadPipeline(data, 'lead_review')).ok).toBe(false);
  expect(mocks.background).not.toHaveBeenCalled();
});

it('successful primary capture survives logged secondary failure', async () => {
  mocks.background.mockRejectedValue(new Error('HubSpot unavailable'));
  expect((await submitLeadPipeline(data, 'lead_review')).ok).toBe(true);
  expect(mocks.capture).toHaveBeenCalledOnce();
  await vi.waitFor(() => expect(console.error).toHaveBeenCalled());
});

it('newsletter must await durable subscription capture and rejects failed capture', async () => {
  mocks.newsletter.mockRejectedValue(new Error('Subscriber not saved'));
  expect(await submitLeadPipeline({ ...data, leadType: 'newsletter' }, 'newsletter_signup')).toMatchObject({ ok: false, captured: false });
  expect(mocks.capture).not.toHaveBeenCalled();
  expect(mocks.background).not.toHaveBeenCalled();
});

it('newsletter success is separate from sales enrichment', async () => {
  expect(await submitLeadPipeline({ ...data, leadType: 'newsletter' }, 'newsletter_signup')).toMatchObject({ ok: true, captured: true, message: "You're on the list." });
  expect(mocks.capture).not.toHaveBeenCalled();
  expect(mocks.background).not.toHaveBeenCalled();
});

it.each(['Contact Page Form', 'Lead Leak Review'])('real lead action validates and dispatches %s safely', async (leadType) => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ ...data, business: 'Example Service', leadType })) form.set(key, value);
  expect((await submitLeadReview({ ok: false }, form)).ok).toBe(true);
  expect(mocks.captcha).toHaveBeenCalledWith('test-token', leadType === 'Contact Page Form' ? 'contact_form' : 'lead_review');
});

it('real newsletter action validates malformed data before reaching integrations', async () => {
  const form = new FormData();
  form.set('email', 'invalid');
  expect((await submitNewsletter({ ok: false }, form)).ok).toBe(false);
  expect(mocks.newsletter).not.toHaveBeenCalled();
});
