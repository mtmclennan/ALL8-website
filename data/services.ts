export type Service = {
  slug: string;
  title: string;
  short: string; // one-liner used on cards
  description: string; // detailed intro at top of detail page
  benefits: string[]; // bullet list
  features: string[]; // bullet list
  priceFrom?: string; // optional starting price
  ctaLabel?: string;
  icon: string; // lucide icon name
  faqs?: { q: string; a: string }[];
  seo?: {
    title?: string;
    description?: string;
  };
};

export type FAQ = { q: string; a: string }; // <-- strings, not React nodes
// ...
faq: [
  { q: 'How fast is delivery?', a: 'Most sites launch in 2–4 weeks.' },
  {
    q: 'Do you handle SEO?',
    a: 'Yes—technical setup, schema, and on-page basics.',
  },
];

export const SERVICES: Service[] = [
  {
    slug: 'websites-that-convert',
    title: 'Websites That Convert',
    short: 'High-performance marketing sites built for speed, UX, and leads.',
    description:
      'We build fast, accessible, and SEO-ready websites using Next.js + HeroUI. Every page is crafted to guide visitors towards clear actions—calls, quote requests, and bookings.',
    benefits: [
      'Lighthouse 95+ targets for Core Web Vitals',
      'Clear visual hierarchy and focused CTAs',
      'WCAG 2.1 AA accessibility as standard',
      'SEO foundations: metadata, schema, sitemaps',
    ],
    features: [
      'Next.js App Router + ISR/SSG',
      'HeroUI components + Tailwind design system',
      'Analytics-ready (GA4/Privacy-friendly alternatives)',
      'Contact flows with validation + autoresponders',
    ],
    priceFrom: '$3,000 CAD',
    ctaLabel: 'Get a Quote',
    icon: 'Rocket',
    faqs: [
      {
        q: 'How long does a standard site take?',
        a: 'Most brochure sites launch in 2–4 weeks depending on content readiness and revisions.',
      },
      {
        q: 'Do you handle copy and images?',
        a: 'Yes—baseline copy editing and licensed stock are included. We can also integrate your existing assets.',
      },
    ],
    seo: {
      title: 'Websites That Convert | ALL8 Webworks',
      description:
        'High-performance, conversion-focused websites built with Next.js, HeroUI and Tailwind.',
    },
  },
  {
    slug: 'local-seo-lead-systems',
    title: 'Local SEO & Lead Systems',
    short: 'Be found locally. Turn searches into phone calls and booked jobs.',
    description:
      'We set up your local search presence end‑to‑end: GBP optimization, on‑page SEO, citations, and review flows that compound over time.',
    benefits: [
      'More calls from “near me” searches',
      'Trust signals: reviews, badges, and clear service areas',
      'Measurement built-in: call tracking + form attribution',
    ],
    features: [
      'Google Business Profile optimization',
      'Citations + NAP consistency',
      'Review request automations',
      'Ad-ready landing structure',
    ],
    priceFrom: '$1,200 CAD',
    ctaLabel: 'Improve My Local SEO',
    icon: 'MapPin',
    faqs: [
      {
        q: 'Do I need a blog?',
        a: 'Not at first. For local service pages, quality location/service pages often outperform thin blogs.',
      },
    ],
    seo: {
      title: 'Local SEO & Lead Systems | ALL8 Webworks',
      description:
        'Local SEO setup that turns searches into jobs—GBP, citations, reviews, and measurement.',
    },
  },
  {
    slug: 'ads-ready-landing-pages',
    title: 'Ads‑Ready Landing Pages',
    short:
      'Purpose-built for Google Ads with tight message‑match and fast load times.',
    description:
      'Spin up targeted landers aligned to ad groups and keywords. We design for clarity, speed, and conversion tracking from day one.',
    benefits: [
      'Higher Quality Scores and lower CPCs',
      'Clear, focused page flow with one primary CTA',
      'A/B‑testable sections and headlines',
    ],
    features: [
      'Server‑rendered for speed + SEO',
      'Form validation with zod + autoresponders',
      'Event tracking (conversions, scroll, clicks)',
    ],
    priceFrom: '$1,500 CAD',
    ctaLabel: 'Build My Lander',
    icon: 'Target',
    seo: {
      title: 'Ads‑Ready Landing Pages | ALL8 Webworks',
      description:
        'Fast, focused Google Ads landing pages with tracking and validation built‑in.',
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
