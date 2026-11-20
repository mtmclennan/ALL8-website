import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PlanCard from "./components/PlanCard";

import FAQBlock from "@/app/(site)/_components/FAQBlock";
import Button from "@/app/(site)/_components/ui/Button";
import { PLANS } from "@/data/plans";
import { siteUrl } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contractor Website & Lead System Pricing | ALL8 Webworks",
  description:
    "Contractor website and lead plans: Managed Website $299/mo, Lead System $995/mo, Growth System from $1,500/mo. Setup fees and minimum terms shown up front.",
  path: "/pricing",
});

const faq = [
  {
    q: "Do I have to book a call to get the free review?",
    a: "No. Send your business and website details. Matt looks at how customers find you, contact you and get followed up, then sends written findings and what to fix first. A follow-up call is optional.",
  },
  {
    q: "Is the free review really no obligation?",
    a: "Yes. The Free Lead Leak Review costs nothing and doesn't commit you to anything. The paid plans are different: Managed Website has a 12-month minimum, Lead System and Growth System have 6-month minimums, and Google Ads Management has a 3-month minimum.",
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
    a: "Additional work is quoted and approved before it begins.",
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
      name: "Contractor Website & Lead System Pricing | ALL8 Webworks",
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
            Website and Lead Plans for Contractors
          </h1>
          <p className="mt-6 max-w-[760px] text-lg leading-relaxed text-white/70">
            Start with a free review, fix one priority with a Tune-Up, or let us
            run your website and lead handling every month. Setup fees, monthly
            fees and minimum terms are listed for every plan.
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
            The free review shows where you&apos;re losing calls and quote
            requests. A Tune-Up fixes the most important problems in one
            focused, one-time engagement.
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

      <section aria-labelledby="compare-heading" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <h2 className="all8-h2 font-extrabold" id="compare-heading">
            What changes at each level
          </h2>
          <p className="mt-3 max-w-[760px] text-white/70">
            Each plan includes everything in the one before it. Pick the level
            that matches where work is slipping away today.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Managed Website",
                detail:
                  "Custom site, technical SEO foundation, analytics, hosting, monitoring and minor updates.",
                next: "Choose it if your website is outdated, slow or isn't bringing in quote requests.",
              },
              {
                title: "Lead System",
                detail:
                  "Everything in Managed Website, plus local visibility, source tracking, CRM, missed-call response, follow-up and lead reporting.",
                next: "Choose it if calls, forms or quotes are going unanswered or unfollowed.",
              },
              {
                title: "Growth System",
                detail:
                  "Everything in Lead System, plus ongoing growth work selected for your goals and a monthly growth review.",
                next: "Choose it if the basics are working and you want to grow into more services, areas or pages.",
              },
            ].map((row) => (
              <div
                key={row.title}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.036] p-6"
              >
                <h3 className="all8-h3 font-bold">{row.title}</h3>
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
            className="group mt-7 inline-flex min-h-11 items-center gap-1.5 font-bold text-accent-blue hover:underline hover:underline-offset-4"
            href="/services"
          >
            Explore the capabilities behind these plans
            <ArrowRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
              size={16}
            />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="plans-heading"
        className="bg-content3 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <h2 className="all8-h2 font-extrabold" id="plans-heading">
            Monthly plans
          </h2>
          <p className="mt-3 max-w-[760px] text-white/70">
            Each level builds on the one before it. The stated terms are minimum
            commitments; the scope of Growth System work is agreed around your
            goals.
          </p>
          <div className="mt-8 grid gap-5 max-lg:max-w-[640px] lg:grid-cols-3">
            {ongoing.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
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
            <div className="mt-8">
              <PlanCard horizontal plan={ads} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-content3 px-6 py-10 text-center sm:px-10">
        <p className="text-sm leading-relaxed text-white/75">
          Additional work is quoted and approved before it begins.
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
