import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ upsert: vi.fn(), confirmation: vi.fn(), deal: vi.fn(), note: vi.fn(), task: vi.fn(), sheets: vi.fn() }));
vi.mock('@/lib/email/emailBrevo', () => ({ default: vi.fn(), sendNewsletterConfirmation: mocks.confirmation }));
vi.mock('@/lib/integrations/hubspot/forms', () => ({ submitToHubSpotForm: vi.fn() }));
vi.mock('@/lib/integrations/google/googleSheets', () => ({ isDuplicateEntry: vi.fn(), appendLeadRow: mocks.sheets }));
vi.mock('@/lib/integrations/hubspot/crm', () => ({ upsertContact: mocks.upsert, createDealForContact: mocks.deal, addNoteToContactAndDeal: mocks.note, createTaskForContactAndDeal: mocks.task }));

import { runNewsletterBackgroundTasks } from '../../lib/leads/runLeadBackgroundTasks';
beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

it('subscriber persistence failure rejects and never sends a false confirmation', async () => {
  mocks.upsert.mockRejectedValue(new Error('HubSpot unavailable'));
  await expect(runNewsletterBackgroundTasks({ email: 'monitor@example.invalid' })).rejects.toThrow('HubSpot unavailable');
  expect(mocks.confirmation).not.toHaveBeenCalled();
});

it('confirmation failure is logged after durable capture; no sales records are created', async () => {
  mocks.confirmation.mockRejectedValue(new Error('private-provider-response private@example.invalid'));
  await expect(runNewsletterBackgroundTasks({ email: 'monitor@example.invalid' })).resolves.toBeUndefined();
  expect(mocks.upsert).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalled();
  expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toMatch(/private-provider-response|private@example/);
  for (const mock of [mocks.deal, mocks.note, mocks.task, mocks.sheets]) expect(mock).not.toHaveBeenCalled();
});
