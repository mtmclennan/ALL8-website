import { canonicalBlogSlug } from "../config/permanent-redirects.mjs";

export const RELATED_SERVICE_SLUGS = [
  "lead-generation-websites",
  "local-seo-google-business-profile",
  "google-ads-lead-generation",
  "missed-call-recovery",
  "lead-follow-up-automation",
  "crm-sales-pipeline",
  "call-tracking-lead-attribution",
  "website-care-optimization",
  "custom-lead-systems",
] as const;

export type RelatedServiceSlug = (typeof RELATED_SERVICE_SLUGS)[number];

export type RelatedServiceContext = {
  slug?: string;
  title?: string;
  tags?: string[];
  categoryTitles?: string[];
  categorySlugs?: string[];
};

const DEFAULT_SERVICES: RelatedServiceSlug[] = [
  "lead-generation-websites",
  "local-seo-google-business-profile",
  "lead-follow-up-automation",
];

const BLOG_SERVICE_MAP: Record<string, RelatedServiceSlug[]> = {
  "more-traffic-won-t-fix-the-wrong-website": [
    "lead-generation-websites",
    "google-ads-lead-generation",
    "call-tracking-lead-attribution",
  ],
  "the-problem-wasn-t-skill-it-was-the-system": [
    "custom-lead-systems",
    "crm-sales-pipeline",
    "lead-follow-up-automation",
  ],
  "how-to-get-your-business-recommended-by-chatgpt-a-real-local-case-study": [
    "local-seo-google-business-profile",
    "lead-generation-websites",
    "custom-lead-systems",
  ],
  "why-your-business-isn-t-showing-up-on-google-maps-and-it-s-not-what-you-think":
    [
      "local-seo-google-business-profile",
      "lead-generation-websites",
      "google-ads-lead-generation",
    ],
  "if-your-business-only-has-a-facebook-page-you-re-invisible-to-google": [
    "lead-generation-websites",
    "local-seo-google-business-profile",
    "call-tracking-lead-attribution",
  ],
  "building-a-website-is-easy-running-one-is-not": [
    "website-care-optimization",
    "lead-generation-websites",
    "custom-lead-systems",
  ],
  "why-contractor-websites-fail-and-how-to-fix-yours": [
    "lead-generation-websites",
    "local-seo-google-business-profile",
    "missed-call-recovery",
  ],
  "what-makes-a-high-converting-service-page-for-trades-businesses": [
    "lead-generation-websites",
    "local-seo-google-business-profile",
    "lead-follow-up-automation",
  ],
  "local-seo-for-contractors-google-maps": [
    "local-seo-google-business-profile",
    "lead-generation-websites",
    "google-ads-lead-generation",
  ],
  "the-contractor-s-guide-to-marketing-that-doesn-t-cost-you-clients-or-cash": [
    "google-ads-lead-generation",
    "local-seo-google-business-profile",
    "lead-generation-websites",
  ],
  "high-performance-contractor-website": [
    "lead-generation-websites",
    "website-care-optimization",
    "call-tracking-lead-attribution",
  ],
  "why-your-website-should-perform-like-a-v8-engine": [
    "lead-generation-websites",
    "website-care-optimization",
    "missed-call-recovery",
  ],
};

const KEYWORD_SERVICE_MAP: Array<{
  matches: string[];
  services: RelatedServiceSlug[];
  priority?: number;
}> = [
  {
    matches: ["google maps", "maps", "business profile", "facebook page"],
    services: ["local-seo-google-business-profile", "lead-generation-websites"],
  },
  {
    matches: ["local seo", "seo", "chatgpt", "recommended by chatgpt"],
    services: ["local-seo-google-business-profile", "lead-generation-websites"],
  },
  {
    matches: ["ads", "traffic", "marketing", "campaign"],
    services: ["google-ads-lead-generation", "lead-generation-websites"],
  },
  {
    matches: ["performance", "speed", "v8", "conversion", "high-converting"],
    services: ["lead-generation-websites", "website-care-optimization"],
  },
  {
    matches: ["website", "contractor website", "service page"],
    services: ["lead-generation-websites", "local-seo-google-business-profile"],
  },
  {
    matches: ["maintenance", "hosting", "running one", "secure"],
    services: ["website-care-optimization", "custom-lead-systems"],
  },
  {
    matches: ["system", "workflow", "tools", "integration"],
    services: ["custom-lead-systems", "crm-sales-pipeline"],
  },
  {
    priority: 1,
    matches: [
      "missed call",
      "missed-call",
      "text-back",
      "text back",
      "call routing",
      "voicemail",
      "answering service",
    ],
    services: ["missed-call-recovery", "lead-follow-up-automation"],
  },
  {
    priority: 1,
    matches: [
      "follow-up",
      "follow up",
      "quote follow",
      "estimate",
      "no-response",
      "lead handling",
      "sequence",
      "reminder",
    ],
    services: ["lead-follow-up-automation", "missed-call-recovery"],
  },
  {
    priority: 1,
    matches: [
      "crm",
      "sales pipeline",
      "pipeline",
      "lead tracking",
      "lead management",
    ],
    services: ["crm-sales-pipeline", "lead-follow-up-automation"],
  },
  {
    priority: 1,
    matches: [
      "call tracking",
      "attribution",
      "utm",
      "lead source",
      "conversion tracking",
      "phone tracking",
    ],
    services: ["call-tracking-lead-attribution", "google-ads-lead-generation"],
  },
];

function normalizeWords(value: string) {
  return ` ${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function addServices(
  selected: RelatedServiceSlug[],
  services: RelatedServiceSlug[],
  limit: number,
) {
  for (const service of services) {
    if (selected.length >= limit) return;
    if (!selected.includes(service)) selected.push(service);
  }
}

export function selectRelatedServiceSlugs(
  context: RelatedServiceContext | null,
  limit = 3,
): RelatedServiceSlug[] {
  if (limit <= 0) return [];

  const max = Math.min(limit, 3);
  const selected: RelatedServiceSlug[] = [];
  const exactSlugServices = context?.slug
    ? BLOG_SERVICE_MAP[canonicalBlogSlug(context.slug)]
    : null;

  if (exactSlugServices) addServices(selected, exactSlugServices, max);
  if (selected.length >= max) return selected;

  const searchableFields = [
    context?.slug,
    context?.title,
    ...(context?.categoryTitles ?? []),
    ...(context?.categorySlugs ?? []),
    ...(context?.tags ?? []),
  ]
    .filter((field): field is string => Boolean(field))
    .map(normalizeWords);

  const matchingRules = KEYWORD_SERVICE_MAP.filter((rule) =>
    rule.matches.some((match) =>
      searchableFields.some((field) => field.includes(normalizeWords(match))),
    ),
  ).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  // Give each matched intent its primary service before adding secondary links.
  for (const rule of matchingRules) {
    addServices(selected, rule.services.slice(0, 1), max);
  }
  for (const rule of matchingRules) {
    addServices(selected, rule.services.slice(1), max);
  }

  addServices(selected, DEFAULT_SERVICES, max);

  return selected;
}
