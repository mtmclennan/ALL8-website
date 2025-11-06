// 'use server';

// import { z } from 'zod';
// import { headers } from 'next/headers';
// import sendEmail from '@/lib/email';
// import {
//   isDuplicateEntry,
//   appendLeadRow,
// } from '@/lib/integrations/google/googleSheets';
// import { limitContact } from '@/lib/rate-limit';
// import { submitToHubSpotForm } from '@/lib/integrations/hubspot/forms';
// import {
//   upsertContact, // uses safe email-first upsert you added
//   createDealForContact,
//   addNoteToContactAndDeal,
//   createTaskForContactAndDeal,
// } from '../../lib/integrations/hubspot/crm';

// const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

// const IntakeSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   company: z.string().optional(),
//   // Allow blank OR valid URL:
//   website: z
//     .union([
//       z.string().regex(domainRegex, 'Invalid domain or URL'),
//       z.literal(''),
//     ])
//     .optional(),
//   projectType: z.enum([
//     'website',
//     'gmb',
//     'ads',
//     'intergrations',
//     'maintenance',
//     'seo',
//   ]),
//   goal: z.enum(['leads', 'sell', 'seo', 'other']),
//   timeline: z.enum(['asap', '1-2m', '3m+', 'exploring']),
//   budget: z.enum(['planning', '2-3k', '3-5k', '5k+']),
//   notes: z.string().min(10),
//   consent: z.boolean().refine(Boolean, 'Please confirm the project minimum'),
//   // Honeypot (must be empty):
//   hp: z.string().max(0).optional(),
//   // Optional reCAPTCHA (v3) token:
//   token: z.string().optional(),
//   hutk: z.string().optional(),
//   pageUrl: z.string().url().optional(),
//   pageName: z.string().optional(),
//   utm_source: z.string().optional(),
//   utm_medium: z.string().optional(),
//   utm_campaign: z.string().optional(),
//   marketingOptIn: z.boolean().optional(),
// });

// export type IntakeActionState = {
//   ok: boolean;
//   message?: string;
//   fieldErrors?: Record<string, string[]>;
// };

// async function verifyCaptcha(token?: string) {
//   if (!process.env.RECAPTCHA_SECRET || !token) return true;
//   const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({
//       secret: process.env.RECAPTCHA_SECRET!,
//       response: token,
//     }),
//     cache: 'no-store',
//   });
//   const data = (await res.json()) as { success: boolean; score?: number };
//   return data.success && (data.score ?? 0.9) >= 0.3;
// }

// export async function submitIntake(
//   _prev: IntakeActionState,
//   formData: FormData
// ): Promise<IntakeActionState> {
//   // Raw entries
//   const raw = Object.fromEntries(formData.entries());

//   // ✅ Normalize BEFORE validating (blank → undefined where appropriate)
//   const websiteRaw = String(raw.website ?? '').trim();
//   const data = {
//     name: String(raw.name ?? '').trim(),
//     email: String(raw.email ?? '').trim(),
//     company: String(raw.company ?? '').trim() || undefined,
//     website: websiteRaw === '' ? '' : websiteRaw, // schema allows '' or valid URL
//     projectType: String(raw.projectType ?? ''),
//     goal: String(raw.goal ?? ''),
//     timeline: String(raw.timeline ?? ''),
//     budget: String(raw.budget ?? ''),
//     notes: String(raw.notes ?? '').trim(),
//     consent: formData.has('consent'),
//     marketingOptIn: formData.has('marketingOptIn'),

//     // hidden tracking
//     hutk: String(raw.hutk ?? ''),
//     pageUrl: String(raw.pageUrl ?? ''),
//     pageName: String(raw.pageName ?? ''),
//     utm_source: String(raw.utm_source ?? ''),
//     utm_medium: String(raw.utm_medium ?? ''),
//     utm_campaign: String(raw.utm_campaign ?? ''),

//     // honeypot & captcha
//     hp: String(raw.hp ?? ''),
//     token: typeof raw.token === 'string' ? raw.token : undefined,
//   };

//   function errMsg(e: unknown) {
//     if (e instanceof Error) return e.message;
//     try {
//       return JSON.stringify(e);
//     } catch {
//       return String(e);
//     }
//   }

//   async function step<T>(
//     label: string,
//     fn: () => Promise<T>,
//     errors: string[]
//   ) {
//     try {
//       return await fn();
//     } catch (e) {
//       console.error(`[Lead] ${label} failed:`, e);
//       errors.push(`${label}: ${errMsg(e)}`);
//       return undefined as unknown as T;
//     }
//   }

//   // Validate
//   const parsed = IntakeSchema.safeParse(data);
//   if (!parsed.success) {
//     const { fieldErrors } = parsed.error.flatten();
//     return {
//       ok: false,
//       fieldErrors,
//       message: 'Please fix the highlighted fields.',
//     };
//   }

//   // Honeypot → quietly succeed
//   if (parsed.data.hp) {
//     return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
//   }

//   // Rate-limit EARLY (avoid external calls)
//   const h = await headers();
//   const ip =
//     (h.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim() || 'unknown';
//   {
//     const { ok, resetSeconds } = await limitContact(`contact:${ip}`).catch(
//       (e) => {
//         console.error('[rate-limit] soft-fail:', e);
//         return { ok: true, resetSeconds: 0 }; // fail-open if RL breaks
//       }
//     );
//     if (!ok) {
//       return {
//         ok: false,
//         message: `Too many requests. Please wait ~${Math.max(resetSeconds, 5)}s and try again.`,
//       };
//     }
//   }

//   // reCAPTCHA (optional) EARLY
//   const human = await verifyCaptcha(parsed.data.token);
//   if (!human) {
//     return { ok: false, message: 'Verification failed. Please try again.' };
//   }

//   const errors: string[] = [];

//   // HubSpot Form API (soft)
//   await step(
//     'HubSpot form submit',
//     () => submitToHubSpotForm(parsed.data),
//     errors
//   );

//   // Send emails (do not block user if email trips — still log)
//   await step(
//     'Email (business + client)',
//     () => sendEmail(parsed.data as any),
//     errors
//   );

//   // Google Sheets (soft; de-dupe)
//   await step(
//     'Sheets append',
//     async () => {
//       const dup = await isDuplicateEntry(
//         parsed.data.email,
//         parsed.data.projectType
//       );
//       if (!dup) {
//         await appendLeadRow({
//           name: parsed.data.name,
//           email: parsed.data.email,
//           phone: '', // add a phone field later if you collect it
//           projectType: parsed.data.projectType,
//           message: parsed.data.notes,
//         });
//       }
//     },
//     errors
//   );

//   // --- HubSpot CRM (non-blocking) ---
//   // Build note text once
//   const noteText = `Website Intake

// Project: ${parsed.data.projectType}
// Goal: ${parsed.data.goal}
// Timeline: ${parsed.data.timeline}
// Budget: ${parsed.data.budget}
// Website: ${parsed.data.website || '-'}

// Notes:
// ${parsed.data.notes}`;

//   // Upsert contact (soft)
//   const contactId = await step(
//     'HubSpot upsert contact',
//     () =>
//       upsertContact(parsed.data.email, {
//         firstname: parsed.data.name,
//         company: parsed.data.company ?? undefined,
//         website: parsed.data.website || undefined,
//         lifecyclestage: 'lead',
//         all8_project_type: parsed.data.projectType,
//         all8_primary_goal: parsed.data.goal,
//         all8_timeline: parsed.data.timeline,
//         all8_budget_range: parsed.data.budget,
//         // DO NOT pass `email` here; helper manages it
//       }),
//     errors
//   );

//   // Create deal / note / task only if we have a contact
//   if (contactId) {
//     const dealId = await step(
//       'HubSpot create deal',
//       () =>
//         createDealForContact(
//           contactId,
//           `ALL8 – ${parsed.data.name}`,
//           parsed.data.budget,
//           { pipelineId: 'default', stageId: 'appointmentscheduled' }
//         ),
//       errors
//     );

//     if (dealId) {
//       await Promise.allSettled([
//         step(
//           'HubSpot note (contact+deal)',
//           () => addNoteToContactAndDeal(contactId, dealId, noteText),
//           errors
//         ),
//         step(
//           'HubSpot task (contact+deal)',
//           () =>
//             createTaskForContactAndDeal(contactId, dealId, {
//               subject: 'Follow up: new website inquiry',
//               body: `Reach out to ${parsed.data.name} (${parsed.data.email}).`,
//               dueAtISO: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
//               priority: 'HIGH',
//             }),
//           errors
//         ),
//       ]);
//     } else {
//       errors.push('HubSpot deal not created; skipped note/task.');
//     }
//   } else {
//     errors.push('HubSpot contact not created; skipped deal/note/task.');
//   }

//   // Friendly user message (no internals in prod)
//   const msgOk = 'Thanks! We’ll review and follow up shortly.';
//   const msgPartial =
//     process.env.NODE_ENV === 'development'
//       ? `${msgOk} (Some steps failed: ${errors.join(' • ')})`
//       : msgOk;

//   return { ok: true, message: errors.length ? msgPartial : msgOk };
// }
'use server';
import { IntakeSchema, IntakeData } from '@/lib/intake/schema';
import { verifyCaptcha } from '@/lib/intake/verifyCaptcha';
import { checkRateLimit } from '@/lib/intake/rateLimit';
import { runBackgroundTasks } from '@/lib/intake/backgroundTasks';

export type IntakeActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitIntake(
  _prev: IntakeActionState,
  formData: FormData
): Promise<IntakeActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = IntakeSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    consent: formData.has('consent'),
    marketingOptIn: formData.has('marketingOptIn'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors,
      message: 'Please fix the highlighted fields.',
    };
  }

  const data = parsed.data as IntakeData;

  if (data.hp)
    return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };

  try {
    await checkRateLimit();
  } catch (e) {
    return { ok: false, message: String(e) };
  }

  const human = await verifyCaptcha(data.token);
  if (!human)
    return { ok: false, message: 'Verification failed. Please try again.' };

  // fire and forget
  runBackgroundTasks(data);

  return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
}
