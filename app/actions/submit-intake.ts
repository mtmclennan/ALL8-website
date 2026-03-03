'use server';

import { IntakeSchema, type IntakeData } from '@/lib/intake/schema';
import {
  submitLeadPipeline,
  type LeadActionState,
} from '@/lib/leads/submitLead';

function zodToFieldErrors(err: any) {
  const { fieldErrors } = err.flatten();
  return fieldErrors as Record<string, string[]>;
}

export async function submitIntake(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = IntakeSchema.safeParse({
    ...raw,
    consent: formData.has('consent'),
    marketingOptIn: formData.has('marketingOptIn'),
  });

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: zodToFieldErrors(parsed.error),
      message: 'Please fix the highlighted fields.',
    };
  }

  const d = parsed.data as IntakeData;

  // Map IntakeData -> LeadPayload
  return submitLeadPipeline({
    leadType: d.projectType === 'tuneup' ? 'tuneup' : 'intake',
    name: d.name,
    email: d.email,
    company: d.company,
    website: d.website || undefined,

    primary: d.projectType, // store what they asked for
    goal: d.goal,
    timeline: d.timeline,
    budget: d.budget,
    notes: d.notes,

    hp: d.hp,
    token: d.token,
    hutk: d.hutk,
    pageUrl: d.pageUrl,
    pageName: d.pageName,
    utm_source: d.utm_source,
    utm_medium: d.utm_medium,
    utm_campaign: d.utm_campaign,
    marketingOptIn: d.marketingOptIn,
  });
}
