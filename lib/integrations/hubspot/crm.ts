// // lib/integrations/hubspot/crm.ts
// import { HS, HSjson, hsUrl } from './client';

// /** Find a contact id by email (undefined if not found) */
// export async function findContactIdByEmail(
//   email: string
// ): Promise<string | undefined> {
//   const json = await HSjson<{
//     results?: Array<{ id: string }>;
//   }>('/crm/v3/objects/contacts/search', {
//     method: 'POST',
//     body: JSON.stringify({
//       filterGroups: [
//         { filters: [{ propertyName: 'email', operator: 'EQ', value: email }] },
//       ],
//       limit: 1,
//       properties: ['email'],
//     }),
//   });
//   return json?.results?.[0]?.id;
// }

// /**
//  * Upsert a HubSpot contact by email.
//  * - If a contact with this email exists → PATCH it with provided props (excluding `email`)
//  * - Else → POST create with `idProperty=email` so HubSpot upserts by email server-side
//  *
//  * Returns the contact id.
//  */
// export async function upsertContact(
//   email: string,
//   props: Record<string, any>
// ): Promise<string> {
//   // Look up by email first (never attempt to "move" an email across contacts)
//   const existingId = await findContactIdByEmail(email).catch(() => undefined);
//   const { email: _ignoreEmail, ...safeProps } = props ?? {};

//   if (existingId) {
//     await HS(`/crm/v3/objects/contacts/${existingId}`, {
//       method: 'PATCH',
//       body: JSON.stringify({ properties: safeProps }),
//     });
//     return existingId;
//   }

//   // Create new (or upsert) by email using idProperty=email
//   const url = hsUrl('/crm/v3/objects/contacts', { idProperty: 'email' });
//   const created = await HSjson<{ id: string }>(url, {
//     method: 'POST',
//     body: JSON.stringify({ properties: { email, ...safeProps } }),
//   });
//   return created.id;
// }

// /** Rough amount estimate from your budget codes (tweak as needed) */
// export function estimateAmount(budget?: string) {
//   if (budget === '3-5k') return 4000;
//   if (budget === '5-10k') return 7500;
//   if (budget === '10k+') return 12000;
//   return undefined;
// }

// export type DealOptions = {
//   pipelineId?: string; // default: "default"
//   stageId?: string; // default: "appointmentscheduled"
//   properties?: Record<string, any>;
// };

// /** Create a deal and associate it to a contact; returns deal id */
// export async function createDealForContact(
//   contactId: string,
//   dealName: string,
//   budget?: string,
//   opts: DealOptions = {}
// ): Promise<string> {
//   const deal = await HSjson<{ id: string }>('/crm/v3/objects/deals', {
//     method: 'POST',
//     body: JSON.stringify({
//       properties: {
//         dealname: dealName,
//         pipeline: opts.pipelineId ?? 'default',
//         dealstage: opts.stageId ?? 'appointmentscheduled',
//         amount: estimateAmount(budget),
//         ...(opts.properties ?? {}),
//       },
//     }),
//   });

//   await HS('/crm/v4/associations/deal/contact/batch/create', {
//     method: 'POST',
//     body: JSON.stringify({
//       inputs: [
//         {
//           from: { id: deal.id },
//           to: { id: contactId },
//           type: 'deal_to_contact',
//         },
//       ],
//     }),
//   });

//   return deal.id;
// }

// export async function addNoteToContactAndDeal(
//   contactId: string,
//   dealId: string,
//   noteBody: string
// ) {
//   // 1) create note
//   const note = await HSjson<{ id: string }>('/crm/v3/objects/notes', {
//     method: 'POST',
//     body: JSON.stringify({
//       properties: {
//         hs_note_body: noteBody,
//         hs_timestamp: new Date().toISOString(),
//       },
//     }),
//   });

//   // 2) associate to Contact
//   await HS(
//     `/crm/v3/objects/notes/${note.id}/associations/contact/${contactId}/note_to_contact`,
//     { method: 'PUT' }
//   );

//   // 3) associate to Deal
//   await HS(
//     `/crm/v3/objects/notes/${note.id}/associations/deal/${dealId}/note_to_deal`,
//     { method: 'PUT' }
//   );

//   return note.id;
// }

// /** Create a task and associate to Contact + Deal; returns task id */
// export async function createTaskForContactAndDeal(
//   contactId: string,
//   dealId: string,
//   opts: {
//     subject: string;
//     body?: string;
//     ownerId?: string;
//     dueAtISO?: string;
//     priority?: 'LOW' | 'MEDIUM' | 'HIGH';
//     type?: 'EMAIL' | 'CALL' | 'TODO';
//   }
// ) {
//   const task = await HSjson<{ id: string }>('/crm/v3/objects/tasks', {
//     method: 'POST',
//     body: JSON.stringify({
//       properties: {
//         hs_task_subject: opts.subject,
//         hs_task_body: opts.body ?? '',
//         hs_task_status: 'NOT_STARTED',
//         hs_task_priority: opts.priority ?? 'HIGH',
//         hs_task_type: opts.type ?? 'TODO',
//         hs_timestamp: opts.dueAtISO ?? new Date().toISOString(),
//         ...(opts.ownerId ? { hubspot_owner_id: opts.ownerId } : {}),
//       },
//     }),
//   });

//   // Associate to Contact
//   await HS(
//     `/crm/v3/objects/tasks/${task.id}/associations/contact/${contactId}/task_to_contact`,
//     { method: 'PUT' }
//   );

//   // Associate to Deal
//   await HS(
//     `/crm/v3/objects/tasks/${task.id}/associations/deal/${dealId}/task_to_deal`,
//     { method: 'PUT' }
//   );

//   return task.id;
// }

// /** Optional: merge duplicates safely when you decide to dedupe */
// export async function mergeContacts(primaryId: string, secondaryId: string) {
//   // Irreversible: secondary is merged into primary
//   await HS('/crm/v3/objects/contacts/merge', {
//     method: 'POST',
//     body: JSON.stringify({
//       primaryObjectId: primaryId,
//       objectIdToMerge: secondaryId,
//     }),
//   });
// }
// lib/integrations/hubspot/crm.ts
import { HS, HSjson, hsUrl, HubSpotError } from './client';

/** Find a contact id by email (undefined if not found) */
export async function findContactIdByEmail(
  email: string
): Promise<string | undefined> {
  const json = await HSjson<{
    results?: Array<{ id: string }>;
  }>('/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: 'email', operator: 'EQ', value: email }] },
      ],
      limit: 1,
      properties: ['email'],
    }),
  });
  return json?.results?.[0]?.id;
}

/**
 * Upsert a HubSpot contact by email.
 * - If a contact with this email exists → PATCH it with provided props (excluding `email`)
 * - Else → POST create with `idProperty=email` (and handle rare 409 by refinding and PATCHing)
 *
 * Returns the contact id.
 */
export async function upsertContact(
  email: string,
  props: Record<string, any>
): Promise<string> {
  // Look up by email first (never attempt to "move" an email across contacts)
  const existingId = await findContactIdByEmail(email).catch(() => undefined);
  const { email: _ignoreEmail, ...safeProps } = props ?? {};

  if (existingId) {
    await HS(`/crm/v3/objects/contacts/${existingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties: safeProps }),
    });
    return existingId;
  }

  // Create new (or upsert) by email using idProperty=email
  const url = hsUrl('/crm/v3/objects/contacts', { idProperty: 'email' });
  try {
    const created = await HSjson<{ id: string }>(url, {
      method: 'POST',
      body: JSON.stringify({ properties: { email, ...safeProps } }),
    });
    return created.id;
  } catch (e: any) {
    // Handle rare race: HubSpot returns 409 even with idProperty=email
    const is409 =
      (e instanceof HubSpotError && e.status === 409) ||
      String(e?.message || e).includes('409') ||
      String(e?.message || e).includes('Contact already exists');

    if (is409) {
      const id = await findContactIdByEmail(email);
      if (id) {
        await HS(`/crm/v3/objects/contacts/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ properties: safeProps }),
        });
        return id;
      }
    }
    throw e;
  }
}

/** Rough amount estimate from your budget codes (tweak as needed) */
export function estimateAmount(budget?: string) {
  if (budget === '3-5k') return 4000;
  if (budget === '5-10k') return 7500;
  if (budget === '10k+') return 12000;
  return undefined;
}

export type DealOptions = {
  pipelineId?: string; // default: "default"
  stageId?: string; // default: "appointmentscheduled"
  properties?: Record<string, any>;
};

/** Create a deal and associate it to a contact; returns deal id */
export async function createDealForContact(
  contactId: string,
  dealName: string,
  budget?: string,
  opts: DealOptions = {}
): Promise<string> {
  const deal = await HSjson<{ id: string }>('/crm/v3/objects/deals', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        dealname: dealName,
        pipeline: opts.pipelineId ?? 'default',
        dealstage: opts.stageId ?? 'appointmentscheduled',
        amount: estimateAmount(budget),
        ...(opts.properties ?? {}),
      },
    }),
  });

  await HS('/crm/v4/associations/deal/contact/batch/create', {
    method: 'POST',
    body: JSON.stringify({
      inputs: [
        {
          from: { id: deal.id },
          to: { id: contactId },
          type: 'deal_to_contact',
        },
      ],
    }),
  });

  return deal.id;
}

export async function addNoteToContactAndDeal(
  contactId: string,
  dealId: string,
  noteBody: string
) {
  // 1) create note
  const note = await HSjson<{ id: string }>('/crm/v3/objects/notes', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_note_body: noteBody,
        hs_timestamp: new Date().toISOString(),
      },
    }),
  });

  // 2) associate to Contact
  await HS(
    `/crm/v3/objects/notes/${note.id}/associations/contact/${contactId}/note_to_contact`,
    { method: 'PUT' }
  );

  // 3) associate to Deal
  await HS(
    `/crm/v3/objects/notes/${note.id}/associations/deal/${dealId}/note_to_deal`,
    { method: 'PUT' }
  );

  return note.id;
}

/** Create a task and associate to Contact + Deal; returns task id */
export async function createTaskForContactAndDeal(
  contactId: string,
  dealId: string,
  opts: {
    subject: string;
    body?: string;
    ownerId?: string;
    dueAtISO?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    type?: 'EMAIL' | 'CALL' | 'TODO';
  }
) {
  const task = await HSjson<{ id: string }>('/crm/v3/objects/tasks', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_task_subject: opts.subject,
        hs_task_body: opts.body ?? '',
        hs_task_status: 'NOT_STARTED',
        hs_task_priority: opts.priority ?? 'HIGH',
        hs_task_type: opts.type ?? 'TODO',
        hs_timestamp: opts.dueAtISO ?? new Date().toISOString(),
        ...(opts.ownerId ? { hubspot_owner_id: opts.ownerId } : {}),
      },
    }),
  });

  // Associate to Contact
  await HS(
    `/crm/v3/objects/tasks/${task.id}/associations/contact/${contactId}/task_to_contact`,
    { method: 'PUT' }
  );

  // Associate to Deal
  await HS(
    `/crm/v3/objects/tasks/${task.id}/associations/deal/${dealId}/task_to_deal`,
    { method: 'PUT' }
  );

  return task.id;
}

/** Optional: merge duplicates safely when you decide to dedupe */
export async function mergeContacts(primaryId: string, secondaryId: string) {
  // Irreversible: secondary is merged into primary
  await HS('/crm/v3/objects/contacts/merge', {
    method: 'POST',
    body: JSON.stringify({
      primaryObjectId: primaryId,
      objectIdToMerge: secondaryId,
    }),
  });
}
