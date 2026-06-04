import { SERVICES } from "@/data/services";

export const RELATED_SERVICE_SLUGS = [
  "performance-tune-up",
  "websites-that-convert",
  "website-maintenance-hosting",
  "local-seo-foundation",
  "google-business-profile-optimization",
  "google-ads-setup-integration",
  "business-tool-integrations",
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

const FALLBACK_SERVICE_COPY: Record<
  RelatedServiceSlug,
  Pick<RelatedService, "title" | "description">
> = {
  "performance-tune-up": {
    title: "Performance & Conversion Tune-Up",
    description: "Improve speed, mobile usability, and lead capture fast.",
  },
  "websites-that-convert": {
    title: "Websites That Convert",
    description: "Build a fast, reliable website designed to generate calls.",
  },
  "website-maintenance-hosting": {
    title: "Website Maintenance & Hosting",
    description: "Keep your site secure, backed up, fast, and online.",
  },
  "local-seo-foundation": {
    title: "Local SEO Foundation",
    description: "Set up the SEO basics that help local customers find you.",
  },
  "google-business-profile-optimization": {
    title: "Google Business Profile Optimization",
    description: "Improve Maps visibility, trust signals, and local actions.",
  },
  "google-ads-setup-integration": {
    title: "Google Ads Setup & Tracking",
    description: "Launch campaigns with clean structure and lead tracking.",
  },
  "business-tool-integrations": {
    title: "Business Tool Integrations",
    description: "Connect leads to your CRM, quoting, or booking workflow.",
  },
};

export const RELATED_SERVICE_METADATA: Record<
  RelatedServiceSlug,
  RelatedService
> = RELATED_SERVICE_SLUGS.reduce(
  (metadata, slug) => {
    const service = SERVICES.find((item) => item.slug === slug);
    const fallback = FALLBACK_SERVICE_COPY[slug];

    metadata[slug] = {
      slug,
      title: service?.title ?? fallback.title,
      description:
        service?.short ?? service?.description ?? fallback.description,
      href: `/services/${slug}`,
    };

    return metadata;
  },
  {} as Record<RelatedServiceSlug, RelatedService>,
);

const DEFAULT_SERVICES: RelatedServiceSlug[] = [
  "performance-tune-up",
  "websites-that-convert",
  "local-seo-foundation",
];

const BLOG_SERVICE_MAP: Record<string, RelatedServiceSlug[]> = {
  "more-traffic-won-t-fix-the-wrong-website": [
    "performance-tune-up",
    "websites-that-convert",
    "google-ads-setup-integration",
  ],
  "the-problem-wasn-t-skill-it-was-the-system": [
    "business-tool-integrations",
    "websites-that-convert",
    "performance-tune-up",
  ],
  "how-to-get-your-business-recommended-by-chatgpt-a-real-local-case-study": [
    "local-seo-foundation",
    "google-business-profile-optimization",
    "business-tool-integrations",
  ],
  "why-your-business-isn-t-showing-up-on-google-maps-and-it-s-not-what-you-think":
    [
      "google-business-profile-optimization",
      "local-seo-foundation",
      "websites-that-convert",
    ],
  "if-your-business-only-has-a-facebook-page-you-re-invisible-to-google": [
    "websites-that-convert",
    "local-seo-foundation",
    "google-business-profile-optimization",
  ],
  "building-a-website-is-easy-running-one-is-not": [
    "website-maintenance-hosting",
    "websites-that-convert",
    "business-tool-integrations",
  ],
  "why-contractor-websites-fail-and-how-to-fix-yours": [
    "performance-tune-up",
    "websites-that-convert",
    "local-seo-foundation",
  ],
  "what-makes-a-high-converting-service-page-for-trades-businesses": [
    "websites-that-convert",
    "performance-tune-up",
    "local-seo-foundation",
  ],
  "local-seo-for-contractors-in-2025-the-ultimate-blueprint-for-ranking-in-google-maps":
    [
      "local-seo-foundation",
      "google-business-profile-optimization",
      "websites-that-convert",
    ],
  "the-contractor-s-guide-to-marketing-that-doesn-t-cost-you-clients-or-cash": [
    "google-ads-setup-integration",
    "local-seo-foundation",
    "websites-that-convert",
  ],
  "the-contractor-s-guide-to-a-high-performance-website": [
    "websites-that-convert",
    "performance-tune-up",
    "website-maintenance-hosting",
  ],
  "why-your-website-should-perform-like-a-v8-engine": [
    "performance-tune-up",
    "websites-that-convert",
    "website-maintenance-hosting",
  ],
};

const KEYWORD_SERVICE_MAP: Array<{
  matches: string[];
  services: RelatedServiceSlug[];
}> = [
  {
    matches: ["google maps", "maps", "business profile", "facebook page"],
    services: ["google-business-profile-optimization", "local-seo-foundation"],
  },
  {
    matches: ["local seo", "seo", "chatgpt", "recommended by chatgpt"],
    services: ["local-seo-foundation", "google-business-profile-optimization"],
  },
  {
    matches: ["ads", "traffic", "marketing", "campaign"],
    services: ["google-ads-setup-integration", "websites-that-convert"],
  },
  {
    matches: ["performance", "speed", "v8", "conversion", "high-converting"],
    services: ["performance-tune-up", "websites-that-convert"],
  },
  {
    matches: ["website", "contractor website", "service page"],
    services: ["websites-that-convert", "performance-tune-up"],
  },
  {
    matches: ["maintenance", "hosting", "running one", "secure"],
    services: ["website-maintenance-hosting", "business-tool-integrations"],
  },
  {
    matches: ["system", "workflow", "tools", "integration"],
    services: ["business-tool-integrations", "websites-that-convert"],
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
