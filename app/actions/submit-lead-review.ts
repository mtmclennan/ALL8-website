"use server";

import { z } from "zod";

import { LeadReviewSchema } from "@/lib/intake/schema";
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

export async function submitLeadReview(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = LeadReviewSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: toFieldErrors(parsed.error),
      message: "Please fix the highlighted fields.",
    };
  }

  const d = parsed.data;

  return submitLeadPipeline(
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
