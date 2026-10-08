"use server";

import {
  handleLeadReviewSubmission,
  type LeadActionState,
} from "@/lib/leads/leadSubmission";
import { submitLeadPipeline } from "@/lib/leads/submitLead";

// Validation and the honeypot live in lib/leads/leadSubmission.ts so they can
// be tested without the live integrations behind submitLeadPipeline.
export async function submitLeadReview(
  _prev: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  return handleLeadReviewSubmission(
    Object.fromEntries(formData.entries()),
    submitLeadPipeline,
  );
}
