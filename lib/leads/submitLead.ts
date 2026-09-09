"use server";

import type { LeadPayload } from "@/lib/leads/types";

import { verifyCaptcha, type CaptchaAction } from "@/lib/intake/verifyCaptcha";
import { checkRateLimit } from "@/lib/intake/rateLimit";
import {
  captureLeadNotification,
  runLeadBackgroundTasks,
  runNewsletterBackgroundTasks,
} from "@/lib/leads/runLeadBackgroundTasks";

export type LeadActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitLeadPipeline(
  data: LeadPayload,
  captchaAction: CaptchaAction,
): Promise<LeadActionState> {
  // honeypot
  if (data.hp && data.hp.trim().length > 0) {
    return { ok: true, message: "Thanks! We’ll review and follow up shortly." };
  }

  try {
    await checkRateLimit();
  } catch (e) {
    return { ok: false, message: String(e) };
  }

  const human = await verifyCaptcha(data.token, captchaAction);

  if (!human)
    return { ok: false, message: "Verification failed. Please try again." };

  if (data.leadType === "newsletter") {
    // fire and forget (don’t await) — separate from the sales pipeline
    void runNewsletterBackgroundTasks(data).catch((error) => {
      console.error("[Newsletter] Background task runner failed:", error);
    });

    return { ok: true, message: "You're on the list." };
  }

  try {
    await captureLeadNotification(data);
  } catch (error) {
    console.error("[Lead] Primary notification failed:", error);

    return {
      ok: false,
      message:
        "We couldn't save your request just now. Please try again or email hello@all8webworks.com.",
    };
  }

  // Secondary enrichment must not delay a confirmed, durably captured lead.
  void runLeadBackgroundTasks(data).catch((error) => {
    console.error("[Lead] Background task runner failed:", error);
  });

  return { ok: true, message: "Thanks! We’ll review and follow up shortly." };
}
