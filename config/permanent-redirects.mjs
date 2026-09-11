export const BLOG_SLUG_MIGRATIONS = Object.freeze({
  "local-seo-for-contractors-in-2025-the-ultimate-blueprint-for-ranking-in-google-maps":
    "local-seo-for-contractors-google-maps",
  "the-contractor-s-guide-to-a-high-performance-website":
    "high-performance-contractor-website",
});

export const PERMANENT_REDIRECTS = Object.freeze([
  {
    source: "/tuneUpPage",
    destination: "/services/lead-generation-websites",
    permanent: true,
  },
  {
    source: "/tune-up",
    destination: "/services/lead-generation-websites",
    permanent: true,
  },
  {
    source: "/services/performance-tune-up",
    destination: "/services/lead-generation-websites",
    permanent: true,
  },
  {
    source: "/services/websites-that-convert",
    destination: "/services/lead-generation-websites",
    permanent: true,
  },
  {
    source: "/services/website-maintenance-hosting",
    destination: "/services/website-care-optimization",
    permanent: true,
  },
  {
    source: "/services/local-seo-foundation",
    destination: "/services/local-seo-google-business-profile",
    permanent: true,
  },
  {
    source: "/services/google-business-profile-optimization",
    destination: "/services/local-seo-google-business-profile",
    permanent: true,
  },
  {
    source: "/services/google-ads-setup-integration",
    destination: "/services/google-ads-lead-generation",
    permanent: true,
  },
  {
    source: "/services/business-tool-integrations",
    destination: "/services/custom-lead-systems",
    permanent: true,
  },
  {
    source: "/legal/privacy-policy",
    destination: "/privacy",
    permanent: true,
  },
  ...Object.entries(BLOG_SLUG_MIGRATIONS).map(([source, destination]) => ({
    source: `/blog/${source}`,
    destination: `/blog/${destination}`,
    statusCode: 301,
  })),
]);

const REDIRECT_DESTINATIONS = new Map(
  PERMANENT_REDIRECTS.map(({ source, destination }) => [source, destination]),
);

export function canonicalInternalPath(pathname) {
  return REDIRECT_DESTINATIONS.get(pathname) ?? pathname;
}

export function canonicalBlogSlug(slug) {
  return BLOG_SLUG_MIGRATIONS[slug] ?? slug;
}

export function sourceBlogSlug(slug) {
  return (
    Object.entries(BLOG_SLUG_MIGRATIONS).find(
      ([, canonicalSlug]) => canonicalSlug === slug,
    )?.[0] ?? slug
  );
}
