import sendEmail from '@/lib/email/emailBrevo';
import { submitToHubSpotForm } from '@/lib/integrations/hubspot/forms';
import {
  isDuplicateEntry,
  appendLeadRow,
} from '@/lib/integrations/google/googleSheets';
import {
  upsertContact,
  createDealForContact,
  addNoteToContactAndDeal,
  createTaskForContactAndDeal,
} from '@/lib/integrations/hubspot/crm';

import type { LeadPayload } from './types';

export async function runLeadBackgroundTasks(data: LeadPayload) {
  const errors: string[] = [];
  const step = async <T>(label: string, fn: () => Promise<T>) => {
    try {
      return await fn();
    } catch (e) {
      console.error(`[Lead] ${label} failed:`, e);
      errors.push(label);
    }
  };

  // unify what you write into sheets/email/crm
  const projectType =
    data.leadType === 'tuneup' ? 'tuneup' : (data.primary ?? 'website');
  const notes = data.notes ?? '';

  await Promise.allSettled([
    step('HubSpot Form', () =>
      submitToHubSpotForm({
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website,
        projectType: projectType as any,
        goal: (data.goal as any) ?? 'other',
        timeline: (data.timeline as any) ?? 'exploring',
        budget: (data.budget as any) ?? 'planning',
        notes,
        hutk: data.hutk,
        pageUrl: data.pageUrl,
        pageName: data.pageName,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        marketingOptIn: data.marketingOptIn,
      }),
    ),

    step('Brevo Email', () =>
      sendEmail({
        leadType: data.leadType,
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website,
        projectType,
        goal: data.goal,
        timeline: data.timeline,
        budget: data.budget,
        notes,
        primary: data.primary,
      }),
    ),

    step('Sheets', async () => {
      const dup = await isDuplicateEntry(data.email, projectType);
      if (!dup) {
        await appendLeadRow({
          name: data.name,
          email: data.email,
          phone: '',
          projectType,
          message: notes,
        });
      }
    }),
  ]);

  // CRM chain (still optional, but now consistent)
  try {
    const contactId = await upsertContact(data.email, {
      firstname: data.name,
      company: data.company ?? undefined,
      website: data.website || undefined,
      lifecyclestage: 'lead',
      all8_project_type: projectType,
      all8_primary_goal: data.goal,
      all8_timeline: data.timeline,
      all8_budget_range: data.budget,
    });

    if (contactId) {
      const dealId = await createDealForContact(
        contactId,
        `ALL8 – ${data.name}`,
        data.budget ?? 'planning',
        {
          pipelineId: 'default',
          stageId: 'appointmentscheduled',
        },
      );

      if (dealId) {
        const note = [
          `Lead Type: ${data.leadType}`,
          `Primary: ${data.primary ?? '-'}`,
          `Website: ${data.website ?? '-'}`,
          data.goal ? `Goal: ${data.goal}` : null,
          data.timeline ? `Timeline: ${data.timeline}` : null,
          data.budget ? `Budget: ${data.budget}` : null,
          '',
          'Notes:',
          notes || '-',
        ]
          .filter(Boolean)
          .join('\n');

        await Promise.allSettled([
          addNoteToContactAndDeal(contactId, dealId, note),
          createTaskForContactAndDeal(contactId, dealId, {
            subject: `Follow up: new ${data.leadType} lead`,
            body: `Reach out to ${data.name} (${data.email}).`,
            dueAtISO: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            priority: 'HIGH',
          }),
        ]);
      }
    }
  } catch (e) {
    console.error('[Lead] HubSpot CRM chain failed:', e);
  }

  if (errors.length) console.error('[Lead] Background partial errors:', errors);
}
