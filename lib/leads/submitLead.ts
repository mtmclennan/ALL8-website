'use server';

import { verifyCaptcha } from '@/lib/intake/verifyCaptcha';
import { checkRateLimit } from '@/lib/intake/rateLimit';
import {
  runLeadBackgroundTasks,
  runNewsletterBackgroundTasks,
} from '@/lib/leads/runLeadBackgroundTasks';
import type { LeadPayload } from '@/lib/leads/types';

export type LeadActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitLeadPipeline(
  data: LeadPayload,
): Promise<LeadActionState> {
  // honeypot
  if (data.hp && data.hp.trim().length > 0) {
    return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
  }

  try {
    await checkRateLimit();
  } catch (e) {
    return { ok: false, message: String(e) };
  }

  const human = await verifyCaptcha(data.token);
  if (!human)
    return { ok: false, message: 'Verification failed. Please try again.' };

  if (data.leadType === 'newsletter') {
    // fire and forget (don’t await) — separate from the sales pipeline
    void runNewsletterBackgroundTasks(data);

    return { ok: true, message: "You're on the list." };
  }

  // fire and forget (don’t await)
  void runLeadBackgroundTasks(data);

  return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
}
