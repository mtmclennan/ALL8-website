import type { Metadata } from "next";

import Link from "next/link";
import {
  ArrowRight,
  CornerDownRight,
  ListChecks,
  MessageSquareText,
  PhoneCall,
  Route,
} from "lucide-react";

import MissedCallCalculator from "./MissedCallCalculator";

import FAQBlock, { type FAQ } from "@/app/(site)/_components/FAQBlock";
import { siteUrl } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/metadata";

const path = "/tools/missed-call-revenue-calculator";
const canonical = `${siteUrl()}${path}`;

export const metadata: Metadata = buildPageMetadata({
  title: "Missed Call Revenue Calculator | ALL8 Webworks",
  description:
    "Estimate how much potential sales opportunity unanswered calls may represent using your call volume, job value, close rate and current follow-up rate.",
  path,
  openGraphTitle: "Missed Call Revenue Calculator",
  openGraphDescription:
    "Use your own business numbers to estimate the potential sales opportunity represented by unanswered calls.",
});

const faqs: FAQ[] = [
  {
    q: "How accurate is the missed-call revenue calculator?",
    a: "It is an estimate built from the numbers you provide, not a prediction. Better call-volume, lead-quality, close-rate and recovery inputs produce a more useful estimate, but the result is not guaranteed lost or recoverable revenue.",
  },
  {
    q: "What counts as a genuine sales lead?",
    a: "A genuine sales lead is a caller who may reasonably be looking to buy the service you provide. Exclude spam, suppliers, existing customers, job applicants and unrelated calls.",
  },
  {
    q: "What should I use for average job value?",
    a: "Use the typical revenue from one new customer or job—not your highest possible project. If job sizes vary widely, use a conservative recent average.",
  },
  {
    q: "What is a missed-call recovery rate?",
    a: "It is the percentage of missed calls that currently receive a successful callback, text response or other follow-up. The calculator removes that recovered share from the final unrecovered estimate.",
  },
  {
    q: "Does every missed call mean lost revenue?",
    a: "No. Some calls are not sales leads, some callers would not become customers, and some missed calls are recovered later. That is why the calculator asks for lead, close and recovery rates instead of treating every call as a lost job.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonical}#page`,
      url: canonical,
      name: "Missed Call Revenue Calculator",
      description: metadata.description,
      isPartOf: { "@id": `${siteUrl()}/#website` },
      about: {
        "@type": "Thing",
        name: "Missed-call sales opportunity for service businesses",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${siteUrl()}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Missed Call Revenue Calculator",
          item: canonical,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

const recoveryActions = [
  {
    title: "Call back quickly",
    body: "Make the return call while the request is still active and before the caller moves on.",
    Icon: PhoneCall,
  },
  {
    title: "Acknowledge by text",
    body: "A short, approved text can confirm the call was noticed and set an expectation for a human reply.",
    Icon: MessageSquareText,
  },
  {
    title: "Route the opportunity",
    body: "Send the call or notification to the right person instead of relying on one overloaded inbox or phone.",
    Icon: Route,
  },
  {
    title: "Create a follow-up task",
    body: "Record what needs to happen next so the opportunity does not depend on someone remembering later.",
    Icon: ListChecks,
  },
];

export default function MissedCallRevenueCalculatorPage() {
  return (
    <main className="pb-24 pt-[118px] max-[960px]:pb-16">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <header className="mx-auto max-w-[980px] px-6 text-center sm:px-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap justify-center gap-2 text-sm text-white/60"
        >
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link className="hover:text-white" href="/tools">
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-white/80">
            Missed-call calculator
          </span>
        </nav>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Respond &amp; Follow Up
        </p>
        <h1 className="mt-4 text-[clamp(38px,6vw,66px)] font-black leading-[.98] tracking-[-.04em]">
          Missed Call Revenue Calculator
        </h1>
        <p className="mx-auto mt-5 max-w-[760px] text-xl leading-relaxed text-white/70">
          Estimate how much potential sales opportunity may be tied up in
          unanswered business calls—using your own numbers, not assumed industry
          averages.
        </p>
      </header>

      <MissedCallCalculator />

      <section className="mx-auto mt-24 max-w-[1080px] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              Transparent by design
            </p>
            <h2 className="mt-3 text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-.03em]">
              How the calculation works
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              The estimate narrows missed calls through three assumptions you
              control: which calls are genuine leads, which leads normally
              close, and which missed calls you already recover.
            </p>
          </div>
          <ol className="space-y-3">
            {[
              "Missed calls × genuine lead rate = potential leads",
              "Potential leads × close rate = potential jobs",
              "Potential jobs × average job value × 52 = annual opportunity",
              "Annual opportunity × unrecovered share = annual unrecovered opportunity",
              "Annual unrecovered opportunity ÷ 12 = monthly unrecovered opportunity",
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5"
              >
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[rgba(0,118,255,.13)] text-sm font-black text-accent-blue">
                  {index + 1}
                </span>
                <span className="pt-1 font-semibold leading-relaxed text-white/80">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-8 rounded-2xl border border-white/[0.1] bg-black/20 p-5 text-sm leading-relaxed text-white/65">
          This model estimates opportunity represented—not revenue definitely
          lost. It deliberately accounts for non-sales calls, leads that would
          not close, and calls your business already recovers.
        </p>
      </section>

      <section className="mx-auto mt-24 max-w-[1080px] px-6 sm:px-10">
        <div className="max-w-[760px]">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            After the ring
          </p>
          <h2 className="mt-3 text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-.03em]">
            What happens after a call is missed?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            The useful question is not whether every call could have become a
            sale. It is whether genuine opportunities receive a consistent,
            trackable next step.
          </p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {recoveryActions.map(({ title, body, Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/[0.09] bg-content3 p-6"
            >
              <Icon aria-hidden="true" className="text-accent-blue" size={23} />
              <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
              <p className="mt-3 leading-relaxed text-white/65">{body}</p>
            </article>
          ))}
        </div>
        <Link
          className="mt-7 inline-flex min-h-11 items-center gap-2 py-2 font-bold text-accent-blue hover:text-[#8ec5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
          href="/services/missed-call-recovery"
        >
          Explore ALL8 missed-call recovery and call handling
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className="mx-auto mt-24 max-w-[920px] px-6 sm:px-10">
        <div className="rounded-[22px] border border-white/[0.1] bg-white/[0.035] p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Reduce the leakage
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.025em]">
            A practical missed-call checklist
          </h2>
          <ol className="mt-7 space-y-5">
            {[
              "Review a recent call log and separate genuine new-business calls from everything else.",
              "Set a clear owner and response-time expectation for every missed call.",
              "Use a short, human-approved acknowledgement when an immediate callback is not possible.",
              "Record the lead source, follow-up attempts and outcome in one place.",
              "Measure what was contacted and qualified—not just how many notifications were sent.",
            ].map((item, index) => (
              <li key={item} className="flex gap-4 text-white/75">
                <CornerDownRight
                  aria-hidden="true"
                  className="mt-0.5 flex-none text-accent-blue"
                  size={19}
                />
                <span className="leading-relaxed">
                  <strong className="text-white">{index + 1}.</strong> {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FAQBlock
        faqs={faqs}
        id="faq"
        subtitle="Conservative answers about what the estimate can—and cannot—tell you."
        title="Missed-Call Calculator Questions"
        tone="alt"
      />
    </main>
  );
}
