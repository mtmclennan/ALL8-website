import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PlanPrice from "@/app/(site)/pricing/components/PlanPrice";
import { getPlan } from "@/data/plans";

type Recommendation = { id: string; detail: string };
type PlanPath = { intro: string; plans: Recommendation[]; note?: string };

const PLAN_BY_SERVICE: Record<string, PlanPath> = {
  "lead-generation-websites": {
    intro:
      "The website is the lead-capture foundation. These plans include an ALL8-built Managed Website.",
    plans: [
      {
        id: "managed-website",
        detail:
          "Website, hosting, technical SEO foundation, monitoring and minor updates.",
      },
      {
        id: "lead-system",
        detail:
          "Adds local visibility, lead tracking and follow-up around the website.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System, with additional growth work scoped to your goals.",
      },
    ],
  },
  "local-seo-google-business-profile": {
    intro:
      "Google Business Profile optimization and local SEO are part of the connected lead system.",
    plans: [
      {
        id: "lead-system",
        detail: "Includes Business Profile optimization and local SEO.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System; further SEO work is scoped to your goals.",
      },
    ],
    note: "A focused Tune-Up may address a specific visibility issue when the review identifies it as the priority.",
  },
  "google-ads-lead-generation": {
    intro:
      "Paid search is an optional, separately priced service; it is not automatically included in the ongoing systems.",
    plans: [
      {
        id: "google-ads",
        detail:
          "Campaign setup, conversion tracking, ongoing optimization and reporting.",
      },
    ],
    note: "Google ad spend is separate and paid directly to Google.",
  },
  "missed-call-recovery": {
    intro: "Missed-call text-back and lead alerts are part of Lead System.",
    plans: [
      {
        id: "lead-system",
        detail: "Includes missed-call text-back, instant alerts and follow-up.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System; more advanced lead-flow work can be scoped.",
      },
    ],
    note: "A Tune-Up may address a focused missed-call gap when that is the highest priority.",
  },
  "lead-follow-up-automation": {
    intro: "New-lead and open-estimate follow-up are included in Lead System.",
    plans: [
      {
        id: "lead-system",
        detail:
          "Includes lead alerts and automated new-lead and open-estimate follow-up.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System; advanced automation is scoped to your goals.",
      },
    ],
  },
  "crm-sales-pipeline": {
    intro: "A practical CRM pipeline is part of the connected Lead System.",
    plans: [
      {
        id: "lead-system",
        detail:
          "Includes CRM and pipeline setup with source-level lead tracking.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System, with further pipeline improvements as scoped.",
      },
    ],
    note: "A simple pipeline may be a Tune-Up priority when the review calls for it.",
  },
  "call-tracking-lead-attribution": {
    intro:
      "The right tracking depends on whether you need a connected lead pipeline or campaign-specific measurement.",
    plans: [
      {
        id: "lead-system",
        detail: "Includes source-level lead tracking and pipeline reporting.",
      },
      {
        id: "growth-system",
        detail:
          "Includes Lead System; further attribution work is scoped to your goals.",
      },
      {
        id: "google-ads",
        detail: "Includes conversion tracking for managed ad campaigns.",
      },
    ],
    note: "Dedicated call-tracking integrations are scoped where needed; these plan inclusions do not promise every possible tracking tool.",
  },
  "website-care-optimization": {
    intro:
      "Care for an ALL8-built site is included in its website subscription.",
    plans: [
      {
        id: "managed-website",
        detail:
          "Includes hosting, security, backups, monitoring and minor updates.",
      },
      { id: "lead-system", detail: "Includes everything in Managed Website." },
      { id: "growth-system", detail: "Includes everything in Lead System." },
    ],
    note: "Care for an outside-built site is reviewed and scoped separately; these plan inclusions refer to ALL8-built sites.",
  },
  "custom-lead-systems": {
    intro:
      "The plan determines how the website, CRM, response and follow-up are connected.",
    plans: [
      {
        id: "lead-system",
        detail:
          "Connects the core website, visibility, pipeline and follow-up path.",
      },
      {
        id: "growth-system",
        detail: "Includes Lead System plus growth work scoped to your goals.",
      },
    ],
  },
};

export default function ServicePricing({ slug }: { slug: string }) {
  const match = PLAN_BY_SERVICE[slug];

  if (!match) return null;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="pricing">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <h2 className="all8-h2 font-extrabold">
          Plans that include this capability
        </h2>
        <p className="mt-4 max-w-[780px] font-body leading-relaxed text-white/70">
          {match.intro} The relevant plan determines how this capability is
          delivered.
        </p>
        <div
          className={`mt-7 grid gap-4 ${match.plans.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {match.plans.map(({ id, detail }) => {
            const plan = getPlan(id);

            return (
              <Link
                key={id}
                className="group flex min-h-40 flex-col rounded-2xl border border-white/[0.12] bg-white/[0.035] p-6 transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-accent-blue/70 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue motion-reduce:transform-none"
                href={`/pricing#${id}`}
              >
                <h3 className="all8-h3 font-bold text-white group-hover:text-accent-blue">
                  {plan.name}
                </h3>
                <PlanPrice className="mt-3" plan={plan} size="sm" />
                <p className="mt-4 flex-1 border-t border-white/[0.09] pt-4 font-body text-sm leading-relaxed text-white/70">
                  {detail}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-blue">
                  View plan details
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                    size={16}
                  />
                </span>
              </Link>
            );
          })}
        </div>
        {match.note && (
          <p className="mt-5 max-w-[840px] font-body text-sm leading-relaxed text-white/65">
            {match.note}
          </p>
        )}
        <Link
          className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-accent-blue hover:underline hover:underline-offset-4"
          href="/pricing"
        >
          Compare all plans
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
            size={16}
          />
        </Link>
      </div>
    </section>
  );
}
