import { proofDisplay } from "./proof";

export type WorkCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  /** Context shown on the branded panel; no imagery that could imply a ranking claim. */
  panelLabel: string;
  results: Array<{
    value: string;
    label: string;
    detail: string;
    /** "measured" = analytics over a stated period; "observed" = point-in-time capture. */
    evidence: "measured" | "observed";
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
    panelLabel: "Excavation & service business · Southern Ontario",
    results: [
      {
        value: proofDisplay.searchRange,
        label: "Google Search clicks",
        detail: `Per rolling 28 days, ${proofDisplay.searchPeriod}`,
        evidence: "measured",
      },
      {
        value: proofDisplay.profileIncreaseSigned,
        label: "Business Profile website clicks",
        detail: "Year over year",
        evidence: "measured",
      },
      {
        value: proofDisplay.pageOne,
        label: "Targeted service-page visibility",
        detail: "Point-in-time capture, not a permanent ranking",
        evidence: "observed",
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
