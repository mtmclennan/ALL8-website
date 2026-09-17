export type ProofMetrics = {
  searchClicks: {
    before: number;
    after: number;
    factor: string;
    period: string;
    compactPeriod: string;
    latestWindow: string;
  };
  businessProfileWebsiteClicks: {
    yearOverYearPercent: number;
  };
  visibility: {
    targetedServicePage: string;
    highIntentLocal: string;
    aiResult: string;
  };
};

export const proofMetrics = {
  searchClicks: {
    before: 40,
    after: 100,
    factor: "2.5×",
    period: "March to September 2026",
    compactPeriod: "March–September 2026",
    latestWindow: "August 10–September 6, 2026",
  },
  businessProfileWebsiteClicks: {
    yearOverYearPercent: 76,
  },
  visibility: {
    targetedServicePage:
      "Captured page-one visibility for a targeted service page.",
    highIntentLocal:
      "Captured strong local visibility for a high-intent search.",
    aiResult: "The business appeared in a captured Google AI-generated result.",
  },
} as const satisfies ProofMetrics;

export const proofDisplay = {
  searchBefore: String(proofMetrics.searchClicks.before),
  searchAfter: String(proofMetrics.searchClicks.after),
  searchRange: `${proofMetrics.searchClicks.before} → ${proofMetrics.searchClicks.after}`,
  searchFactor: proofMetrics.searchClicks.factor,
  searchPeriod: proofMetrics.searchClicks.period,
  searchPeriodArrow: proofMetrics.searchClicks.period.replace(" to ", " → "),
  searchPeriodCompact: proofMetrics.searchClicks.compactPeriod,
  searchLatestWindow: proofMetrics.searchClicks.latestWindow,
  profileIncrease: `${proofMetrics.businessProfileWebsiteClicks.yearOverYearPercent}%`,
  profileIncreaseSigned: `+${proofMetrics.businessProfileWebsiteClicks.yearOverYearPercent}%`,
  pageOne: "Page One",
} as const;

const PROOF_TOKENS: Readonly<Record<string, string>> = {
  "{{proof.search.before}}": proofDisplay.searchBefore,
  "{{proof.search.after}}": proofDisplay.searchAfter,
  "{{proof.search.range}}": proofDisplay.searchRange,
  "{{proof.search.factor}}": proofDisplay.searchFactor,
  "{{proof.search.period}}": proofDisplay.searchPeriod,
  "{{proof.search.periodArrow}}": proofDisplay.searchPeriodArrow,
  "{{proof.search.periodCompact}}": proofDisplay.searchPeriodCompact,
  "{{proof.search.latestWindow}}": proofDisplay.searchLatestWindow,
  "{{proof.profile.increase}}": proofDisplay.profileIncrease,
  "{{proof.profile.increaseSigned}}": proofDisplay.profileIncreaseSigned,
  "{{proof.visibility.pageOne}}": proofDisplay.pageOne,
};

function hydrateProofString(value: string) {
  return Object.entries(PROOF_TOKENS).reduce(
    (result, [token, replacement]) => result.replaceAll(token, replacement),
    value,
  );
}

export function hydrateProofContent<T>(value: T): T {
  if (typeof value === "string") return hydrateProofString(value) as T;
  if (Array.isArray(value)) return value.map(hydrateProofContent) as T;

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        hydrateProofContent(item),
      ]),
    ) as T;
  }

  return value;
}
