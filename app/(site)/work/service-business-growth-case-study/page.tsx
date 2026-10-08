import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import Button from "@/app/(site)/_components/ui/Button";
import { siteUrl } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { proofDisplay, proofMetrics } from "@/data/proof";
import { workCaseStudies } from "@/data/work";
import { getPlan } from "@/data/plans";

const canonical = `${siteUrl()}/work/service-business-growth-case-study`;
const caseStudy = workCaseStudies.find(
  (item) => item.slug === "service-business-growth-case-study",
);

export const metadata: Metadata = buildPageMetadata({
  title: "Service-Business Growth System Case Study | ALL8 Webworks",
  description:
    "See how ALL8 improved local search visibility and lead-source measurement for a service business, then found the next response and follow-up constraint.",
  path: "/work/service-business-growth-case-study",
  type: "article",
  openGraphTitle: "From Search Growth to a Better Lead-Handling System",
  openGraphDescription:
    "Measured acquisition gains revealed the next constraint in an established service business.",
});

const atAGlance = [
  { term: "Business", value: "Established excavation and service business" },
  { term: "Location", value: "Southern Ontario" },
  {
    term: "Work",
    value: "Website, local SEO, Google Business Profile and lead tracking",
  },
  {
    term: "Status",
    value: "Acquisition results measured; call handling in validation",
  },
];

const changes = [
  "The outdated website was rebuilt as a modern website",
  "Each priority service got its own page, so the business could be found for the work it actually wanted",
  "The Google Business Profile and local search presence were improved",
  "Calls and form submissions became measurable — including which search, page or source produced them",
];

const measured = [
  {
    value: proofDisplay.searchRange,
    label: "Google Search clicks per rolling 28 days",
    detail: `${proofDisplay.searchPeriod} (${proofDisplay.searchFactor}). Latest window: ${proofDisplay.searchLatestWindow}.`,
  },
  {
    value: proofDisplay.profileIncreaseSigned,
    label: "Google Business Profile website clicks",
    detail: "Year over year.",
  },
];

const observed = [
  proofMetrics.visibility.targetedServicePage,
  proofMetrics.visibility.highIntentLocal,
  proofMetrics.visibility.aiResult,
];

type WorkflowStatus = "In validation" | "Planned";

const workflow: Array<{
  name: string;
  goal: string;
  status: WorkflowStatus;
  technical: string;
}> = [
  {
    name: "Log each incoming call automatically",
    goal: "Every call is recorded without anyone having to write it down.",
    status: "In validation",
    technical:
      "Validate reliable Ooma call events before automating downstream actions.",
  },
  {
    name: "Send call details to the right workflow",
    goal: "Call details reach the place where follow-up actually happens.",
    status: "In validation",
    technical:
      "Validate Zapier field mapping, deduplication and failure handling across the workflow.",
  },
  {
    name: "Match calls to customer records",
    goal: "Each call is attached to the right customer or job.",
    status: "In validation",
    technical:
      "Validate how Estivor associates call activity with the correct customer or opportunity record.",
  },
  {
    name: "Prompt a callback when a call is missed",
    goal: "A missed call creates a callback task so it is not forgotten.",
    status: "Planned",
    technical:
      "Design callback tasks, Needs Attention status and follow-up rules after validation.",
  },
];

const statusStyles: Record<WorkflowStatus, string> = {
  "In validation":
    "border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.12)] text-[#fbbf24]",
  Planned: "border-white/[0.14] bg-white/[0.05] text-white/70",
};

const relevantPlans = [getPlan("managed-website"), getPlan("lead-system")];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "From Search Growth to a Better Lead-Handling System",
    description: metadata.description,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
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
        name: "Work",
        item: `${siteUrl()}/work`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Case Study",
        item: canonical,
      },
    ],
  },
];

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 className="all8-h2 font-extrabold tracking-[-.022em]" id={id}>
      {children}
    </h2>
  );
}

export default function GrowthCaseStudyPage() {
  return (
    <article className="pb-24 pt-[138px] max-[960px]:pb-16 max-[960px]:pt-[112px]">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      {/* 1. Client / business context */}
      <header className="mx-auto max-w-[1000px] px-6 sm:px-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <li>
              <Link className="hover:text-white" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="hover:text-white" href="/work">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">
              Service-business growth system
            </li>
          </ol>
        </nav>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Case study · Service business growth
        </p>
        <h1 className="mt-4 all8-h1 font-black leading-[1.02] tracking-[-.035em] [text-wrap:balance] max-[480px]:text-[32px]!">
          From Search Growth to a Better Lead-Handling System
        </h1>
        <p className="mt-6 max-w-[760px] text-[clamp(18px,1.8vw,20px)] leading-relaxed text-white/70">
          An established excavation and service business in Southern Ontario
          needed more visibility. The work grew search demand, made lead sources
          measurable, and then revealed the next constraint: what happened after
          prospects made contact.
        </p>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {atAGlance.map((item) => (
            <div key={item.term} className="bg-background p-5">
              <dt className="text-[12px] font-bold uppercase tracking-[.1em] text-white/60">
                {item.term}
              </dt>
              <dd className="mt-1.5 text-[15px] font-semibold leading-snug text-white">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mx-auto mt-20 max-w-[1000px] space-y-20 px-6 max-[960px]:mt-14 max-[960px]:space-y-14 sm:px-10">
        {/* 2. Original problem */}
        <section aria-labelledby="problem-heading" className="max-w-[720px]">
          <SectionHeading id="problem-heading">
            The starting problem
          </SectionHeading>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            The business had plenty of capability but not enough incoming work
            to fill the schedule. Customers searching locally for its services
            weren&apos;t finding it, service information was incomplete, and
            there was little visibility into which searches, pages, calls or
            forms produced an opportunity.
          </p>
        </section>

        {/* 3. What ALL8 changed */}
        <section aria-labelledby="changed-heading" className="max-w-[720px]">
          <SectionHeading id="changed-heading">
            What ALL8 changed
          </SectionHeading>
          <ul className="mt-5 space-y-3.5 text-lg leading-relaxed text-white/70">
            {changes.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 flex-shrink-0 text-accent-blue"
                  size={20}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Measured results, kept separate from point-in-time observations */}
        <section aria-labelledby="results-heading">
          <SectionHeading id="results-heading">Measured results</SectionHeading>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {measured.map((result) => (
              <div
                key={result.label}
                className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 sm:p-7"
              >
                <span className="inline-flex rounded-md border border-[rgba(34,197,94,.35)] bg-[rgba(34,197,94,.12)] px-2 py-0.5 text-[11.5px] font-bold text-[#4ade80]">
                  Measured
                </span>
                <p className="mt-4 text-[clamp(36px,4vw,48px)] font-black leading-none tracking-[-.02em] text-accent-blue">
                  {result.value}
                </p>
                <p className="mt-3 font-bold text-white">{result.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {result.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex rounded-md border border-[rgba(61,151,255,.35)] bg-[rgba(61,151,255,.12)] px-2 py-0.5 text-[11.5px] font-bold text-accent-blue">
                Observed
              </span>
              <h3 className="text-[16px] font-bold">
                Supporting visibility captures
              </h3>
            </div>
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-white/70">
              {observed.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-blue"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              These are point-in-time observations, not permanent ranking
              claims. Search rankings move; the measured figures above are the
              results this case study relies on.
            </p>
          </div>
        </section>

        {/* 5. How the system worked */}
        <section aria-labelledby="how-heading" className="max-w-[720px]">
          <SectionHeading id="how-heading">How it worked</SectionHeading>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            The service pages and Business Profile work made the business easier
            to find for the jobs it wanted. The website turned that attention
            into calls and form submissions. Tracking connected each inquiry
            back to the search, page or source that produced it, which is what
            made the results above measurable in the first place.
          </p>
          <figure className="mt-8 rounded-2xl border border-white/[0.08] bg-content3 p-6 sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[.1em] text-white/60">
              What the measurement revealed
            </p>
            <blockquote className="mt-3 text-[clamp(19px,2.1vw,23px)] font-extrabold leading-[1.4] tracking-[-.015em] text-white">
              The useful question changed from “How do we generate more leads?”
              to “How reliably do we handle the leads we already generate?”
            </blockquote>
            <figcaption className="mt-4 text-[15px] leading-relaxed text-white/70">
              Acquisition improved, but the new measurement showed that
              visibility was not the only constraint. Some incoming
              opportunities were not moving through a consistent response and
              follow-up process.
            </figcaption>
          </figure>
        </section>

        {/* 6. Current status and limitations */}
        <section aria-labelledby="status-heading">
          <div className="max-w-[720px]">
            <SectionHeading id="status-heading">
              Current status and limitations
            </SectionHeading>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              The next phase aims to make every call visible and easy to follow
              up. It is not finished. The steps below are being validated or are
              still planned, and none of them is presented as a result.
            </p>
          </div>

          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {workflow.map((step, index) => (
              <li
                key={step.name}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.036] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-white/60">
                    Step {index + 1}
                  </span>
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-[11.5px] font-bold ${statusStyles[step.status]}`}
                  >
                    {step.status}
                  </span>
                </div>
                <h3 className="mt-3 text-[17px] font-bold leading-snug">
                  {step.name}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">
                  {step.goal}
                </p>
              </li>
            ))}
          </ol>

          <details className="group mt-5 rounded-2xl border border-white/[0.08] bg-content3">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-[15px] font-bold sm:px-6 [&::-webkit-details-marker]:hidden">
              Technical detail: tools and validation steps
              <span
                aria-hidden="true"
                className="text-xl leading-none text-accent-blue transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="border-t border-white/[0.08] px-5 pb-6 pt-4 sm:px-6">
              <p className="text-sm leading-relaxed text-white/70">
                The workflow connects the business&apos;s existing phone system,
                an automation layer and its customer-record software. Status
                labels match each step&apos;s current state.
              </p>
              <dl className="mt-4 space-y-4">
                {workflow.map((step) => (
                  <div key={step.name}>
                    <dt className="text-sm font-bold text-white">
                      {step.name}{" "}
                      <span className="font-semibold text-white/60">
                        ({step.status})
                      </span>
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-white/70">
                      {step.technical}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>

          <p className="mt-5 max-w-[720px] text-sm leading-relaxed text-white/60">
            This is one anonymized client. The figures describe what was
            measured for this business over the stated periods; they are not a
            prediction or guarantee for another business.
          </p>
        </section>

        {/* 7. Relevant services and plans */}
        <section aria-labelledby="services-heading">
          <SectionHeading id="services-heading">
            Services and plans behind this work
          </SectionHeading>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[.1em] text-white/60">
                Services used
              </h3>
              <ul className="space-y-3">
                {(caseStudy?.relatedServices ?? []).map((service) => (
                  <li key={service.href}>
                    <Link
                      className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.036] px-5 py-3 font-bold transition-[border-color,background-color] hover:border-[rgba(0,118,255,.35)] hover:bg-white/[0.058]"
                      href={service.href}
                    >
                      <span className="group-hover:text-accent-blue">
                        {service.label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="flex-shrink-0 text-accent-blue transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                        size={16}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[.1em] text-white/60">
                Plans that cover this kind of work
              </h3>
              <ul className="space-y-3">
                {relevantPlans.map((plan) => (
                  <li key={plan.id}>
                    <Link
                      className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.036] px-5 py-3 transition-[border-color,background-color] hover:border-[rgba(0,118,255,.35)] hover:bg-white/[0.058]"
                      href={`/pricing#${plan.id}`}
                    >
                      <span>
                        <span className="block font-bold group-hover:text-accent-blue">
                          {plan.name}
                        </span>
                        <span className="mt-0.5 block text-sm text-white/70">
                          {plan.bestFor}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="flex-shrink-0 text-accent-blue transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                        size={16}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 8. CTA */}
        <section
          aria-labelledby="case-study-cta-heading"
          className="rounded-2xl border border-[rgba(61,151,255,.25)] bg-[rgba(61,151,255,.08)] p-7 sm:p-10"
        >
          <h2
            className="all8-h2 font-extrabold tracking-[-.022em]"
            id="case-study-cta-heading"
          >
            Where are leads slipping through your business?
          </h2>
          <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-white/70">
            ALL8 can review the full journey from search visibility and your
            website through calls, response time, follow-up and conversion. You
            get the findings in writing, including which stage appears to be
            costing the most and what to fix first.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button data-cta="case-study-lead-system-review" href="/contact">
              Get My Free Lead Leak Review
            </Button>
            <Link
              className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-accent-blue hover:underline hover:underline-offset-4"
              href="/pricing"
            >
              View pricing
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                size={15}
              />
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
