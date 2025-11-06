import { IntakeData } from './schema';
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

export async function runBackgroundTasks(data: IntakeData) {
  const errors: string[] = [];
  const step = async <T>(label: string, fn: () => Promise<T>) => {
    try {
      return await fn();
    } catch (e) {
      console.error(`[Lead] ${label} failed:`, e);
      errors.push(label);
    }
  };

  await Promise.allSettled([
    step('HubSpot Form', () => submitToHubSpotForm(data)),
    step('Brevo Email', () => sendEmail(data)),
    step('Sheets', async () => {
      const dup = await isDuplicateEntry(data.email, data.projectType);
      if (!dup) {
        await appendLeadRow({
          name: data.name,
          email: data.email,
          phone: '',
          projectType: data.projectType,
          message: data.notes,
        });
      }
    }),
  ]);

  // CRM follow-up chain
  try {
    const contactId = await upsertContact(data.email, {
      firstname: data.name,
      company: data.company ?? undefined,
      website: data.website || undefined,
      lifecyclestage: 'lead',
      all8_project_type: data.projectType,
      all8_primary_goal: data.goal,
      all8_timeline: data.timeline,
      all8_budget_range: data.budget,
    });

    if (contactId) {
      const dealId = await createDealForContact(
        contactId,
        `ALL8 – ${data.name}`,
        data.budget,
        {
          pipelineId: 'default',
          stageId: 'appointmentscheduled',
        }
      );
      if (dealId) {
        const note = `Website Intake\n\nProject: ${data.projectType}\nGoal: ${data.goal}\nTimeline: ${data.timeline}\nBudget: ${data.budget}\nWebsite: ${data.website || '-'}\n\nNotes:\n${data.notes}`;
        await Promise.allSettled([
          addNoteToContactAndDeal(contactId, dealId, note),
          createTaskForContactAndDeal(contactId, dealId, {
            subject: 'Follow up: new website inquiry',
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
