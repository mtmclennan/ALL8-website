import type { z } from "zod";
import type { LeadPayload } from "./types.ts";
import type { CaptchaAction } from "../intake/verifyCaptcha.ts";

import { LeadReviewSchema, NewsletterSchema } from "../intake/schema.ts";

export type LeadActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /**
   * False when the request was accepted for display only (honeypot) and no
   * lead was captured. Clients must not fire `generate_lead` in that case.
   */
  captured?: boolean;
};

export type LeadPipeline = (
  data: LeadPayload,
  captchaAction: CaptchaAction,
) => Promise<LeadActionState>;

const LEAD_THANKS = "Thanks! We’ll review and follow up shortly.";
const NEWSLETTER_THANKS = "You're on the list.";

/** A filled honeypot means an automated submission; nothing downstream may run. */
export function isHoneypotTripped(raw: Record<string, unknown>) {
  return typeof raw.hp === "string" && raw.hp.trim().length > 0;
}

export function honeypotResponse(message = LEAD_THANKS): LeadActionState {
  // Looks like success to the bot, but is never captured or tracked.
  return { ok: true, captured: false, message };
}

export function toFieldErrors(err: z.ZodError) {
  const fe: Record<string, string[]> = {};

  for (const i of err.issues) {
    const key = (i.path?.[0] as string) || "form";

    fe[key] = fe[key] ? [...fe[key], i.message] : [i.message];
  }

  return fe;
}

/**
 * Lead Leak Review submissions: honeypot first (silent), then the unchanged
 * schema validation, then the pipeline (rate limit, reCAPTCHA, durable capture).
 */
export async function handleLeadReviewSubmission(
  raw: Record<string, unknown>,
  pipeline: LeadPipeline,
): Promise<LeadActionState> {
  if (isHoneypotTripped(raw)) return honeypotResponse();

  const parsed = LeadReviewSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: toFieldErrors(parsed.error),
      message: "Please fix the highlighted fields.",
    };
  }

  const d = parsed.data;

  return pipeline(
    {
      leadType: "lead-review",
      name: d.name,
      email: d.email,
      company: d.business,
      website: d.website || undefined,
      primary: d.challenge || undefined,
      notes: d.phone ? `Phone: ${d.phone}` : "",
      hp: d.hp,
      token: d.token,
      hutk: d.hutk,
      pageUrl: d.pageUrl,
      pageName: d.pageName,
      utm_source: d.utm_source,
      utm_medium: d.utm_medium,
      utm_campaign: d.utm_campaign,
      utm_content: d.utm_content,
      utm_term: d.utm_term,
    },
    d.leadType === "Contact Page Form" ? "contact_form" : "lead_review",
  );
}

export async function handleNewsletterSubmission(
  raw: Record<string, unknown>,
  pipeline: LeadPipeline,
): Promise<LeadActionState> {
  if (isHoneypotTripped(raw)) return honeypotResponse(NEWSLETTER_THANKS);

  const parsed = NewsletterSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: toFieldErrors(parsed.error),
      message: "Enter a valid email address.",
    };
  }

  const d = parsed.data;

  return pipeline(
    {
      leadType: "newsletter",
      name: "Newsletter subscriber",
      email: d.email,
      hp: d.hp,
      token: d.token,
      hutk: d.hutk,
      pageUrl: d.pageUrl,
      pageName: d.pageName,
      utm_source: d.utm_source,
      utm_medium: d.utm_medium,
      utm_campaign: d.utm_campaign,
      utm_content: d.utm_content,
      utm_term: d.utm_term,
    },
    "newsletter_signup",
  );
}
