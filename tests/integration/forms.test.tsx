import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import type { LeadActionState } from '../../lib/leads/leadSubmission';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ lead: vi.fn(), newsletter: vi.fn() }));
vi.mock('@/app/actions/submit-lead-review', () => ({ submitLeadReview: mocks.lead }));
vi.mock('@/app/actions/submit-newsletter', () => ({ submitNewsletter: mocks.newsletter }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('next/link', () => ({ default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));
vi.mock('@/hooks/use-hubspotContextFields', () => ({ useHubSpotContextFields: () => ({ hutk: '', pageUrl: 'http://localhost/', pageName: 'Test', utm: {} }) }));
vi.mock('@/app/(site)/_components/ui/Button', () => ({ default: ({ variant: _variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => <button {...props} /> }));

import LeadModal from '../../app/(site)/_components/LeadModal';
import InlineLeadForm from '../../app/(site)/contact/components/InlineLeadForm';
import Newsletter from '../../app/(site)/blog/_components/Newsletter';

const execute = vi.fn();
beforeEach(() => {
  mocks.lead.mockReset().mockResolvedValue({ ok: true, captured: true });
  mocks.newsletter.mockReset().mockResolvedValue({ ok: true, captured: true });
  execute.mockReset().mockResolvedValue('test-token');
  Object.assign(window, { grecaptcha: { ready: (callback: () => void) => callback(), execute }, dataLayer: [] });
});

const events = () => (window.dataLayer ?? []).filter((item: { event?: string }) => item.event === 'generate_lead');

describe.each([
  { name: 'homepage lead modal', component: () => <LeadModal open onClose={() => {}} />, action: 'lead_review', success: /Request received/i, submit: mocks.lead, conversion: true },
  { name: 'contact form', component: () => <InlineLeadForm />, action: 'contact_form', success: /Request received/i, submit: mocks.lead, conversion: true },
  { name: 'newsletter', component: () => <Newsletter />, action: 'newsletter_signup', success: /First note lands next month/i, submit: mocks.newsletter, conversion: false },
])('$name', ({ component, action, success, submit, conversion }) => {
  function mount() {
    const view = render(component());
    const form = view.container.querySelector('form')!;
    for (const input of form.querySelectorAll<HTMLInputElement>('input')) {
      if (input.name === 'name') fireEvent.change(input, { target: { value: 'Test Owner' } });
      if (input.name === 'business') fireEvent.change(input, { target: { value: 'Example Service' } });
      if (input.name === 'email') fireEvent.change(input, { target: { value: 'monitor@example.invalid' } });
    }
    return { ...view, form };
  }

  it('uses the correct CAPTCHA action and shows success only after server confirmation', async () => {
    let resolve: (state: LeadActionState) => void = () => {};
    submit.mockImplementationOnce(() => new Promise<LeadActionState>((done) => { resolve = done; }));
    const { form, rerender } = mount();
    fireEvent.submit(form);
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(execute).toHaveBeenCalledWith('all8-test-site-key', { action });
    expect(screen.queryByText(success)).toBeNull();
    expect(events()).toHaveLength(0);
    expect(form.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(true);
    resolve({ ok: true, captured: true });
    await screen.findByText(success);
    await waitFor(() => expect(events()).toHaveLength(conversion ? 1 : 0));
    rerender(component());
    expect(events()).toHaveLength(conversion ? 1 : 0);
  });

  it('preserves server rejection, allows retry and fires no failed conversion', async () => {
    submit.mockResolvedValueOnce({ ok: false, message: 'Server rejected this request' });
    const { form } = mount();
    fireEvent.submit(form);
    expect((await screen.findByRole('alert')).textContent).toContain('Server rejected');
    expect(screen.queryByText(success)).toBeNull();
    expect(events()).toHaveLength(0);
    execute.mockResolvedValueOnce('fresh-retry-token');
    fireEvent.submit(form);
    await screen.findByText(success);
    expect(execute).toHaveBeenCalledTimes(2);
    expect(submit).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(events()).toHaveLength(conversion ? 1 : 0));
  });

  it('blocks submission on token failure and can retry', async () => {
    execute.mockRejectedValueOnce(new Error('CAPTCHA unavailable'));
    const { form } = mount();
    fireEvent.submit(form);
    expect((await screen.findByRole('alert')).textContent).toContain('spam verification');
    expect(submit).not.toHaveBeenCalled();
    expect(events()).toHaveLength(0);
    fireEvent.submit(form);
    await screen.findByText(success);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('never converts a honeypot response into a completed lead event', async () => {
    submit.mockResolvedValueOnce({ ok: true, captured: false });
    const { form } = mount();
    fireEvent.submit(form);
    await screen.findByText(success);
    expect(events()).toHaveLength(0);
  });
});
