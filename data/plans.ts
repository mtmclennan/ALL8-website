export type Plan = {
  id: string;
  name: string;
  kind: "entry" | "ongoing" | "optional";
  setup: string;
  monthly?: string;
  term: string;
  bestFor: string;
  inclusions: readonly string[];
  note?: string;
};

export const PLANS: readonly Plan[] = [
  {
    id: "free-review",
    name: "Free Lead Leak Review",
    kind: "entry",
    setup: "Free",
    term: "No commitment",
    bestFor:
      "Finding the weakest point in your lead path before choosing work.",
    inclusions: [
      "Review of website, search visibility and Google Business Profile where relevant",
      "Review of contact, response and follow-up paths",
      "Written findings and what to fix first; a call is optional",
    ],
  },
  {
    id: "tune-up",
    name: "Lead System Tune-Up",
    kind: "entry",
    setup: "$1,250",
    term: "One-time engagement",
    bestFor: "Fixing the most urgent lead-system gaps in a focused scope.",
    inclusions: [
      "Prioritized work on the highest-impact problems found",
      "May address forms, Google Business Profile, missed calls, alerts, follow-up or tracking",
      "Before-and-after recommendations",
    ],
    note: "The work is prioritized to your business; the examples are not all included automatically.",
  },
  {
    id: "managed-website",
    name: "Managed Website",
    kind: "ongoing",
    setup: "$1,995",
    monthly: "$299/month",
    term: "12-month minimum",
    bestFor: "A site that turns visits into inquiries and stays maintained.",
    inclusions: [
      "Custom website design and development",
      "Hosting, SSL, security, backups, uptime and form monitoring",
      "Technical SEO foundation and schema; GA4 and Search Console",
      "Minor content updates (~1 hour/month), monthly performance check and priority support",
    ],
  },
  {
    id: "lead-system",
    name: "Lead System",
    kind: "ongoing",
    setup: "$2,495",
    monthly: "$995/month",
    term: "6-month minimum",
    bestFor: "Connecting visibility, lead capture, response and follow-up.",
    inclusions: [
      "Everything in Managed Website",
      "Google Business Profile optimization and local SEO",
      "Source-level lead tracking, CRM/pipeline and missed-call text-back",
      "Lead alerts, new-lead and open-estimate follow-up, review requests",
      "Monthly lead and pipeline reporting; one-page Lead Handling Agreement",
    ],
    note: "Software costs are included subject to current pricing assumptions.",
  },
  {
    id: "growth-system",
    name: "Growth System",
    kind: "ongoing",
    setup: "Quoted",
    monthly: "From $1,500/month",
    term: "6-month minimum",
    bestFor:
      "A connected lead system with ongoing growth work scoped to your goals.",
    inclusions: [
      "Everything in Lead System",
      "Scoped ongoing work, such as SEO strategy, new pages or conversion improvements",
      "Potential content strategy, advanced automation and lead-flow improvements",
      "Monthly growth review",
    ],
    note: "The work beyond Lead System is scoped to your goals, not a fixed list of deliverables.",
  },
  {
    id: "google-ads",
    name: "Google Ads Management",
    kind: "optional",
    setup: "$500",
    monthly: "$600/month + ad spend",
    term: "3-month minimum",
    bestFor: "Adding paid search coverage where the economics support it.",
    inclusions: [
      "Campaign setup, ad copy, keyword and negative-keyword management",
      "Conversion tracking and landing-page alignment",
      "Ongoing optimization and monthly reporting",
    ],
    note: "Google ad spend is separate and paid directly to Google.",
  },
];

export function getPlan(id: string): Plan {
  const plan = PLANS.find((item) => item.id === id);

  if (!plan) throw new Error(`Unknown plan: ${id}`);

  return plan;
}
