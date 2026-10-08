import type { Metadata } from "next";

import Link from "next/link";

import PlanCard from "./components/PlanCard";

import FAQBlock from "@/app/(site)/_components/FAQBlock";
import Button from "@/app/(site)/_components/ui/Button";
import { PLANS } from "@/data/plans";
import { siteUrl } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Plans & Pricing | ALL8 Webworks",
  description:
    "Compare ALL8's Free Lead Leak Review, Tune-Up, Managed Website, Lead System, Growth System and Google Ads Management. Clear setup fees, monthly prices and minimum terms for service businesses.",
  path: "/pricing",
});

const faq = [
  {
    q: "What currency are the prices in?",
    a: "U.S. clients pay the listed numeric prices in USD. Canadian clients pay the same numeric prices in CAD, plus applicable HST. There is no exchange-rate conversion between the two price lists.",
  },
  {
    q: "Do I have to book a call to get the free review?",
    a: "No. Send your business and website details. Matt reviews the lead path and sends written findings and what to fix first. A follow-up call is optional.",
  },
  {
    q: "Does a Tune-Up include every item listed?",
    a: "No. A Tune-Up is focused work on the highest-priority problems for your business. The exact work is selected from what the review finds and agreed before it starts.",
  },
  {
    q: "How does the Tune-Up credit work?",
    a: "If you sign a monthly plan within 30 days of completing a Lead System Tune-Up, the full $1,250 Tune-Up fee is credited toward that plan's setup fee. It is not cash back and does not reduce monthly fees.",
  },
  {
    q: "Is Google Ads Management included in the ongoing systems?",
    a: "Google Ads Management is an optional, separately priced service. Its management fee is separate from ad spend, which you pay directly to Google.",
  },
  {
    q: "What if I need work beyond my plan?",
    a: "Additional work is $110/hour in the applicable currency. Scope and cost are discussed before that work starts.",
  },
];

const base = siteUrl();
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${base}/pricing#page`,
      url: `${base}/pricing`,
      name: "Plans & Pricing | ALL8 Webworks",
      description: metadata.description,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: `${base}/pricing`,
        },
      ],
    },
  ],
};

export default function PricingPage() {
  const entry = PLANS.filter((plan) => plan.kind === "entry");
  const ongoing = PLANS.filter((plan) => plan.kind === "ongoing");
  const ads = PLANS.find((plan) => plan.kind === "optional");

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <section className="bg-background pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Plans & Pricing
          </p>
          <h1 className="all8-h1 mt-4 max-w-[800px] font-black leading-[1.04] tracking-[-.03em]">
            Find the leak. Choose the right level of help.
          </h1>
          <p className="mt-6 max-w-[760px] text-lg leading-relaxed text-white/70">
            Start with written findings, fix one priority in a Tune-Up, or
            connect your website, lead handling and growth in an ongoing plan.
            Setup fees and monthly fees are shown separately.
          </p>
          <p className="mt-6 max-w-[760px] rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-white/80">
            <strong className="text-white">Currency:</strong> U.S. clients pay
            these numeric prices in USD. Canadian clients pay the same numeric
            prices in CAD, plus applicable HST. No exchange-rate conversion is
            applied.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="entry-heading"
        className="bg-content3 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <h2 className="all8-h2 font-extrabold" id="entry-heading">
            Start here
          </h2>
          <p className="mt-3 max-w-[720px] text-white/70">
            The free review identifies the gap. A Tune-Up addresses the
            highest-priority work in a focused engagement.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {entry.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-accent-blue/30 bg-accent-blue/[0.08] p-6">
            <h3 className="all8-h3 font-bold">
              Your Tune-Up can credit a setup fee
            </h3>
            <p className="mt-2 max-w-[850px] text-sm leading-relaxed text-white/75">
              Sign a monthly plan within 30 days of completing a Lead System
              Tune-Up and the full $1,250 Tune-Up fee is credited toward that
              plan&apos;s setup fee. It is not cash back or a discount on
              monthly fees.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="plans-heading" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <h2 className="all8-h2 font-extrabold" id="plans-heading">
            Ongoing systems
          </h2>
          <p className="mt-3 max-w-[760px] text-white/70">
            Each level builds on the one before it. The stated terms are minimum
            commitments; the scope of Growth System work is agreed around your
            goals.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {ongoing.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="compare-heading"
        className="bg-content3 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <h2 className="all8-h2 font-extrabold" id="compare-heading">
            What changes at each level
          </h2>
          <p className="mt-3 max-w-[760px] text-white/70">
            Managed Website maintains the lead-capture foundation. Lead System
            adds visibility and lead handling. Growth System adds scoped ongoing
            improvement.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Managed Website",
                lead: "Capture",
                detail:
                  "Custom site, technical SEO foundation, analytics, hosting, monitoring and minor updates.",
                next: "The website foundation.",
              },
              {
                title: "Lead System",
                lead: "Connect",
                detail:
                  "Everything in Managed Website, plus local visibility, source tracking, CRM, missed-call response, follow-up and lead reporting.",
                next: "Adds a connected path from inquiry to won work.",
              },
              {
                title: "Growth System",
                lead: "Improve",
                detail:
                  "Everything in Lead System, plus ongoing growth work selected for your goals and a monthly growth review.",
                next: "Adds a scoped improvement program; deliverables vary.",
              },
            ].map((row) => (
              <div
                key={row.title}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.036] p-6"
              >
                <p className="text-xs font-bold uppercase tracking-[.12em] text-accent-blue">
                  {row.lead}
                </p>
                <h3 className="all8-h3 mt-2 font-bold">{row.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {row.detail}
                </p>
                <p className="mt-5 border-t border-white/[0.09] pt-4 text-sm font-semibold text-white/85">
                  {row.next}
                </p>
              </div>
            ))}
          </div>
          <Link
            className="mt-7 inline-flex min-h-11 items-center rounded-lg font-bold text-accent-blue underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
            href="/services"
          >
            Explore the capabilities behind these plans
          </Link>
        </div>
      </section>

      {ads && (
        <section aria-labelledby="ads-heading" className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
                Optional service
              </p>
              <h2 className="all8-h2 mt-3 font-extrabold" id="ads-heading">
                Paid search, priced separately
              </h2>
              <p className="mt-3 text-white/70">
                Google Ads Management is a separate option when paid search fits
                your market and lead economics. The management fee does not
                include Google ad spend.
              </p>
            </div>
            <div className="mt-8 max-w-[760px]">
              <PlanCard plan={ads} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-content3 px-6 py-10 text-center sm:px-10">
        <p className="text-sm leading-relaxed text-white/75">
          Additional work is $110/hour in the applicable currency. Scope and
          cost are agreed before it begins.
        </p>
      </section>
      <FAQBlock
        faqs={faq}
        subtitle="The practical details before you choose a path."
        title="Pricing questions"
      />
      <section className="px-6 py-20 text-center sm:px-10 sm:py-24">
        <h2 className="all8-h2 font-extrabold">Find out what to fix first.</h2>
        <p className="mx-auto mt-4 max-w-[660px] leading-relaxed text-white/70">
          Send your business and website details. Matt will return written
          findings and a priority recommendation. A call afterward is optional.
        </p>
        <div className="mt-8">
          <Button href="/contact" size="lg">
            Get My Free Lead Leak Review
          </Button>
        </div>
      </section>
    </>
  );
}
