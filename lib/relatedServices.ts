import { SERVICES } from "@/data/services";

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

export type RelatedService = {
  slug: RelatedServiceSlug;
  title: string;
  description: string;
  href: string;
};

export type RelatedServiceContext = {
  slug?: string;
  title?: string;
  tags?: string[];
  categoryTitles?: string[];
  categorySlugs?: string[];
};

export const RELATED_SERVICE_METADATA: Record<
  RelatedServiceSlug,
  RelatedService
> = RELATED_SERVICE_SLUGS.reduce(
  (metadata, slug) => {
    const service = SERVICES.find((item) => item.slug === slug);

    metadata[slug] = {
      slug,
      title: service?.title ?? slug,
      description: service?.short ?? "",
      href: `/services/${slug}`,
    };

    return metadata;
  },
  {} as Record<RelatedServiceSlug, RelatedService>,
);

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
    "lead-generation-websites",
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
  "local-seo-for-contractors-in-2025-the-ultimate-blueprint-for-ranking-in-google-maps":
    [
      "local-seo-google-business-profile",
      "lead-generation-websites",
      "google-ads-lead-generation",
    ],
  "the-contractor-s-guide-to-marketing-that-doesn-t-cost-you-clients-or-cash": [
    "google-ads-lead-generation",
    "local-seo-google-business-profile",
    "lead-generation-websites",
  ],
  "the-contractor-s-guide-to-a-high-performance-website": [
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
];

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

export function selectRelatedServices(
  context: RelatedServiceContext | null,
  limit = 3,
): RelatedService[] {
  if (limit <= 0) return [];

  const max = Math.min(limit, 3);
  const selected: RelatedServiceSlug[] = [];
  const exactSlugServices = context?.slug
    ? BLOG_SERVICE_MAP[context.slug]
    : null;

  if (exactSlugServices) addServices(selected, exactSlugServices, max);

  const searchableText = [
    context?.slug,
    context?.title,
    ...(context?.categoryTitles ?? []),
    ...(context?.categorySlugs ?? []),
    ...(context?.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const rule of KEYWORD_SERVICE_MAP) {
    if (selected.length >= max) break;
    if (rule.matches.some((match) => searchableText.includes(match))) {
      addServices(selected, rule.services, max);
    }
  }

  addServices(selected, DEFAULT_SERVICES, max);

  return selected.map((slug) => RELATED_SERVICE_METADATA[slug]);
}
