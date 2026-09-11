import { proofDisplay } from "./proof";

export type WorkCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  results: Array<{
    value: string;
    label: string;
    detail: string;
  }>;
  relatedServices: Array<{
    label: string;
    href: string;
  }>;
};

export const workCaseStudies: WorkCaseStudy[] = [
  {
    slug: "service-business-growth-case-study",
    title: "From Search Growth to a Better Lead-Handling System",
    summary:
      "An established service business improved local visibility and made lead sources measurable. That progress exposed the next constraint: inconsistent response and follow-up after prospects made contact.",
    image: {
      src: "/assets/website-seo-performance-laptop-analytics-leads-calls.webp",
      alt: "Website analytics dashboard showing search performance and lead activity",
      width: 1600,
      height: 1067,
    },
    results: [
      {
        value: proofDisplay.searchRange,
        label: "Google Search clicks",
        detail: `Per rolling 28 days, ${proofDisplay.searchPeriod}`,
      },
      {
        value: proofDisplay.profileIncreaseSigned,
        label: "Business Profile website clicks",
        detail: "Year over year",
      },
      {
        value: proofDisplay.pageOne,
        label: "Targeted service-page visibility",
        detail: "Point-in-time supporting evidence",
      },
    ],
    relatedServices: [
      {
        label: "Lead Generation Websites",
        href: "/services/lead-generation-websites",
      },
      {
        label: "Local SEO & Google Business Profile",
        href: "/services/local-seo-google-business-profile",
      },
      {
        label: "Call Tracking & Lead Attribution",
        href: "/services/call-tracking-lead-attribution",
      },
    ],
  },
];
