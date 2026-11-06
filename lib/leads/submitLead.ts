"use server";

import type { LeadPayload } from "@/lib/leads/types";
import type { LeadActionState } from "@/lib/leads/leadSubmission";

import { verifyCaptcha, type CaptchaAction } from "@/lib/intake/verifyCaptcha";
import { checkRateLimit } from "@/lib/intake/rateLimit";
import {
  captureLeadNotification,
  runLeadBackgroundTasks,
  runNewsletterBackgroundTasks,
} from "@/lib/leads/runLeadBackgroundTasks";

export type { LeadActionState };

export async function submitLeadPipeline(
  data: LeadPayload,
  captchaAction: CaptchaAction,
): Promise<LeadActionState> {
  // honeypot
  if (data.hp && data.hp.trim().length > 0) {
    console.warn("[LeadSubmission]", {
      event: "submission_rejected",
      reason: "honeypot",
    });

    return {
      ok: true,
      captured: false,
      message: "Thanks! We’ll review and follow up shortly.",
    };
  }

  try {
    await checkRateLimit();
  } catch {
    console.warn("[LeadSubmission]", {
      event: "submission_rejected",
      reason: "rate_limit",
    });

    return {
      ok: false,
      captured: false,
      message:
        "Unable to accept your request right now. Please wait and try again.",
    };
  }

  let human: boolean;

  try {
    human = await verifyCaptcha(data.token, captchaAction);
  } catch {
    console.error("[LeadSubmission]", {
      event: "submission_rejected",
      reason: "verification_error",
    });

    return {
      ok: false,
      captured: false,
      message: "Verification unavailable. Please try again.",
    };
  }

  if (!human) {
    console.warn("[LeadSubmission]", {
      event: "submission_rejected",
      reason: "captcha",
    });

    return {
      ok: false,
      captured: false,
      message: "Verification failed. Please try again.",
    };
  }

  if (data.leadType === "newsletter") {
    try {
      await runNewsletterBackgroundTasks(data);
    } catch {
      console.error("[LeadSubmission]", {
        event: "submission_rejected",
        reason: "newsletter_capture_failed",
      });

      return {
        ok: false,
        captured: false,
        message: "We couldn't save your subscription. Please try again.",
      };
    }

    return { ok: true, captured: true, message: "You're on the list." };
  }

  try {
    await captureLeadNotification(data);
  } catch {
    console.error("[LeadSubmission]", {
      event: "submission_rejected",
      reason: "owner_notification_failed",
    });

    return {
      ok: false,
      captured: false,
      message:
        "We couldn't save your request just now. Please try again or email hello@all8webworks.com.",
    };
  }

  // Secondary enrichment must not delay a confirmed, durably captured lead.
  void runLeadBackgroundTasks(data).catch(() => {
    console.error("[LeadSubmission]", {
      event: "enrichment_failed",
      reason: "background_runner_failed",
    });
  });

  return {
    ok: true,
    captured: true,
    message: "Thanks! We’ll review and follow up shortly.",
  };
}
