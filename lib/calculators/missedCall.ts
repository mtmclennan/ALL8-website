import { z } from "zod";

export const MISSED_CALL_LIMITS = {
  missedCallsPerWeek: 10_000,
  averageJobValue: 100_000_000,
} as const;

export const MissedCallInputsSchema = z.object({
  missedCallsPerWeek: z
    .number()
    .finite()
    .min(0, "Missed calls cannot be negative.")
    .max(
      MISSED_CALL_LIMITS.missedCallsPerWeek,
      `Use ${MISSED_CALL_LIMITS.missedCallsPerWeek.toLocaleString()} or fewer missed calls per week.`,
    ),
  leadRate: z
    .number()
    .finite()
    .min(0, "Lead rate cannot be negative.")
    .max(100, "Lead rate cannot exceed 100%."),
  averageJobValue: z
    .number()
    .finite()
    .min(0, "Average job value cannot be negative.")
    .max(
      MISSED_CALL_LIMITS.averageJobValue,
      "Use an average job value of $100,000,000 or less.",
    ),
  closeRate: z
    .number()
    .finite()
    .min(0, "Close rate cannot be negative.")
    .max(100, "Close rate cannot exceed 100%."),
  recoveryRate: z
    .number()
    .finite()
    .min(0, "Recovery rate cannot be negative.")
    .max(100, "Recovery rate cannot exceed 100%."),
});

export type MissedCallInputs = z.infer<typeof MissedCallInputsSchema>;

export type MissedCallResults = {
  potentialLeadsPerWeek: number;
  potentialJobsPerWeek: number;
  weeklyOpportunity: number;
  annualOpportunity: number;
  annualUnrecoveredOpportunity: number;
  monthlyUnrecoveredOpportunity: number;
  annualPotentialLeads: number;
  annualPotentialJobs: number;
};

export type OpportunityBand =
  | "under_25k"
  | "25k_50k"
  | "50k_100k"
  | "100k_250k"
  | "250k_plus";

/**
 * Estimates sales opportunity represented by missed calls. Percentage inputs
 * arrive as 0–100 values and are converted to decimals before calculation.
 */
export function calculateMissedCallOpportunity(
  rawInputs: MissedCallInputs,
): MissedCallResults {
  const inputs = MissedCallInputsSchema.parse(rawInputs);
  const leadRate = inputs.leadRate / 100;
  const closeRate = inputs.closeRate / 100;
  const recoveryRate = inputs.recoveryRate / 100;

  const potentialLeadsPerWeek = inputs.missedCallsPerWeek * leadRate;
  const potentialJobsPerWeek = potentialLeadsPerWeek * closeRate;
  const weeklyOpportunity = potentialJobsPerWeek * inputs.averageJobValue;
  const annualOpportunity = weeklyOpportunity * 52;
  const annualUnrecoveredOpportunity = annualOpportunity * (1 - recoveryRate);
  const monthlyUnrecoveredOpportunity = annualUnrecoveredOpportunity / 12;
  const annualPotentialLeads = potentialLeadsPerWeek * 52;
  const annualPotentialJobs = potentialJobsPerWeek * 52 * (1 - recoveryRate);

  return {
    potentialLeadsPerWeek,
    potentialJobsPerWeek,
    weeklyOpportunity,
    annualOpportunity,
    annualUnrecoveredOpportunity,
    monthlyUnrecoveredOpportunity,
    annualPotentialLeads,
    annualPotentialJobs,
  };
}

export function getOpportunityBand(
  annualUnrecoveredOpportunity: number,
): OpportunityBand {
  if (annualUnrecoveredOpportunity < 25_000) return "under_25k";
  if (annualUnrecoveredOpportunity < 50_000) return "25k_50k";
  if (annualUnrecoveredOpportunity < 100_000) return "50k_100k";
  if (annualUnrecoveredOpportunity < 250_000) return "100k_250k";

  return "250k_plus";
}
