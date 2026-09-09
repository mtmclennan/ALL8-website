import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { siteUrl } from "@/config/site.config";

const canonical = `${siteUrl()}/work/service-business-growth-case-study`;

export const metadata: Metadata = {
  title: "Service-Business Growth System Case Study | ALL8 Webworks",
  description:
    "An anonymized case study showing how search growth, local visibility, analytics and lead-flow analysis exposed the next operational constraint.",
  alternates: { canonical },
  openGraph: {
    type: "article",
    url: canonical,
    title: "From Search Growth to a Better Lead-Handling System",
    description:
      "Measured acquisition gains revealed the next constraint in an established service business.",
  },
};

const results = [
  {
    value: "40 → 100",
    label: "Google Search clicks per rolling 28 days",
    detail: "March to September 2026 — 2.5× growth",
  },
  {
    value: "+76%",
    label: "Google Business Profile website clicks",
    detail: "Year over year",
  },
  {
    value: "Page one",
    label: "Targeted service-page visibility",
    detail: "Point-in-time capture, not a guaranteed position",
  },
];

const workflow = [
  {
    name: "Ooma call events",
    status: "In validation",
    description:
      "Validate reliable call-event inputs before automating downstream actions.",
  },
  {
    name: "Zapier event routing",
    status: "In validation",
    description:
      "Validate field mapping, deduplication and failure handling across the workflow.",
  },
  {
    name: "Estivor contact and activity matching",
    status: "In validation",
    description:
      "Validate how call activity associates with the correct customer or opportunity record.",
  },
  {
    name: "Missed-call recovery and escalation",
    status: "Planned",
    description:
      "Design callback tasks, Needs Attention states and follow-up rules after validation.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "From Search Growth to a Better Lead-Handling System",
    description: metadata.description,
    url: canonical,
    author: { "@type": "Person", name: "Matt McLennan" },
    publisher: { "@id": `${siteUrl()}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Study",
        item: canonical,
      },
    ],
  },
];

export default function GrowthCaseStudyPage() {
  return (
    <article className="pb-24 pt-[138px]">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <header className="mx-auto max-w-[920px] px-6 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Anonymized Client Case Study · Identifying Details Withheld
        </p>
        <h1 className="mt-4 text-[clamp(40px,6vw,72px)] font-black leading-[.98] tracking-[-.04em]">
          From Search Growth to a Better Lead-Handling System
        </h1>
        <p className="mt-7 max-w-[760px] text-xl leading-relaxed text-white/70">
          An established service business needed more visibility. The work grew
          search demand, made lead sources measurable, and then revealed the
          next constraint: what happened after prospects made contact.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-[1160px] px-6 sm:px-10">
        <section aria-labelledby="results-heading">
          <h2 className="text-3xl font-extrabold" id="results-heading">
            Captured results
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {results.map((result) => (
              <div
                key={result.value}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6"
              >
                <p className="text-4xl font-black text-accent-blue">
                  {result.value}
                </p>
                <p className="mt-3 font-bold text-white">{result.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {result.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/50">
            Supporting evidence also captured strong local visibility for
            high-intent searches and appearances in Google&apos;s AI-generated
            results. Those are point-in-time observations, not permanent ranking
            claims.
          </p>
        </section>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_.9fr]">
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-extrabold">The starting problem</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                The business had limited marketing infrastructure, incomplete
                service information, and little visibility into which searches,
                pages, calls or forms produced an opportunity. The first job was
                to make the right services discoverable and the resulting demand
                measurable.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold">What was implemented</h2>
              <ul className="mt-5 space-y-3 text-lg leading-relaxed text-white/70">
                {[
                  "A modern website and dedicated pages for priority services",
                  "Local SEO and Google Business Profile improvements",
                  "Analytics, conversion tracking and lead-source attribution",
                  "Call and form measurement to follow demand beyond the click",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      className="mt-1 flex-shrink-0 text-stage-win"
                      size={20}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold">
                The analytical finding
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Acquisition improved, but the new measurement showed that more
                visibility was not the only constraint. Some incoming
                opportunities were not moving through a consistent response and
                follow-up process. The useful question changed from “How do we
                generate more leads?” to “How reliably do we handle the leads we
                already generate?”
              </p>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.1] bg-content3 p-7 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              Workflow status
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">System response</h2>
            <p className="mt-3 leading-relaxed text-white/60">
              The next system connects call events, routing and opportunity
              records. The labels below deliberately separate validated work
              from planned capability.
            </p>
            <ol className="mt-7 space-y-5">
              {workflow.map((step) => (
                <li
                  key={step.name}
                  className="border-l border-white/[0.12] pl-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{step.name}</h3>
                    <span className="rounded-full border border-white/[0.12] bg-white/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.09em] text-white/60">
                      {step.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <section className="mt-20 rounded-2xl border border-[rgba(61,151,255,.25)] bg-[rgba(61,151,255,.08)] p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold">What gets measured next</h2>
          <p className="mt-4 max-w-[820px] text-lg leading-relaxed text-white/70">
            The next measurement framework focuses on response time, contact
            attempts, recovered conversations, qualified opportunities and won
            work. No downstream revenue result is claimed here yet; the workflow
            must be validated before those outcomes can be assessed.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 font-bold text-white"
              data-cta="case-study-hire-matt"
              data-cta-event="hire_case_study_click"
              href="/hire-matt"
            >
              See Matt&apos;s full portfolio <ArrowRight size={17} />
            </Link>
            <Link
              className="inline-flex items-center gap-2 px-3 py-3 font-bold text-white/70 hover:text-white"
              href="/services/call-tracking-lead-attribution"
            >
              Explore call tracking and attribution <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
