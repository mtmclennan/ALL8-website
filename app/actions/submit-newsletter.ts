"use server";

import { z } from "zod";

import { NewsletterSchema } from "@/lib/intake/schema";
import {
  submitLeadPipeline,
  type LeadActionState,
} from "@/lib/leads/submitLead";

function toFieldErrors(err: z.ZodError) {
  const fe: Record<string, string[]> = {};

  for (const i of err.issues) {
    const key = (i.path?.[0] as string) || "form";

    fe[key] = fe[key] ? [...fe[key], i.message] : [i.message];
  }

  return fe;
}

export async function submitNewsletter(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = NewsletterSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: toFieldErrors(parsed.error),
      message: "Enter a valid email address.",
    };
  }

  const d = parsed.data;

  return submitLeadPipeline({
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
  });
}
