import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Button from "@/app/(site)/_components/ui/Button";
import CoverFallback from "@/app/(site)/blog/_components/CoverFallback";
import FinalCta from "@/app/(site)/_components/home/FinalCta";
import { site, siteUrl } from "@/config/site.config";
import { workCaseStudies } from "@/data/work";
import { buildPageMetadata } from "@/lib/seo/metadata";

const canonical = `${siteUrl()}/work`;

export const metadata: Metadata = buildPageMetadata({
  title: "Service Business Results & Case Studies | ALL8 Webworks",
  description:
    "See documented ALL8 work for service businesses, from website and local search gains to lead tracking, response and follow-up improvements.",
  path: "/work",
  openGraphTitle: "Real Work. Measurable Results.",
  openGraphDescription:
    "Documented service-business work across search visibility, websites, lead handling and measurement.",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${canonical}#page`,
      url: canonical,
      name: "Work & Case Studies",
      description: metadata.description,
      isPartOf: { "@id": `${siteUrl()}/#website` },
      about: {
        "@type": "Thing",
        name: "Service business lead-generation systems",
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: workCaseStudies.length,
        itemListElement: workCaseStudies.map((caseStudy, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${canonical}/${caseStudy.slug}`,
          name: caseStudy.title,
        })),
      },
      publisher: { "@id": `${siteUrl()}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        { "@type": "ListItem", position: 2, name: "Work", item: canonical },
      ],
    },
  ],
};

export default function WorkPage() {
  return (
    <div className="pt-[132px] max-[960px]:pt-[112px]">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <header className="mx-auto max-w-[920px] px-6 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Work by {site.name}
        </p>
        <h1 className="mt-4 all8-h1 font-black leading-[.98] tracking-[-.04em]">
          Work &amp; Case Studies
        </h1>
        <p className="mt-7 max-w-[760px] text-xl leading-relaxed text-white/70">
          ALL8 improves the path from being found to winning the work. These
          case studies show what changed, what was measured, and which
          constraint surfaced next.
        </p>
      </header>

      <section
        aria-labelledby="featured-work-heading"
        className="mx-auto mt-16 max-w-[1160px] px-6 sm:px-10"
      >
        <h2
          className="all8-h2 mb-7 font-extrabold tracking-[-.025em]"
          id="featured-work-heading"
        >
          Featured case study
        </h2>

        <div className="space-y-8">
          {workCaseStudies.map((caseStudy) => (
            <article
              key={caseStudy.slug}
              className="overflow-hidden rounded-2xl border border-white/[0.1] bg-content3"
            >
              <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                <div className="relative min-h-[160px] border-b border-white/[0.08] lg:min-h-full lg:border-b-0 lg:border-r">
                  <CoverFallback
                    className="p-7 sm:p-10"
                    label={caseStudy.panelLabel}
                  />
                </div>

                <div className="p-7 sm:p-10">
                  <h3 className="text-[clamp(27px,3vw,40px)] font-black leading-[1.08] tracking-[-.028em]">
                    <Link
                      className="hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                      href={`/work/${caseStudy.slug}`}
                    >
                      {caseStudy.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-lg leading-relaxed text-white/70">
                    {caseStudy.summary}
                  </p>

                  <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                    {caseStudy.results.map((result) => (
                      <div
                        key={result.label}
                        className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4"
                      >
                        <dt className="text-sm font-bold text-white">
                          <span
                            className={
                              result.evidence === "measured"
                                ? "mb-2 inline-flex rounded-md border border-[rgba(34,197,94,.35)] bg-[rgba(34,197,94,.12)] px-2 py-0.5 text-[11px] font-bold text-[#4ade80]"
                                : "mb-2 inline-flex rounded-md border border-[rgba(61,151,255,.35)] bg-[rgba(61,151,255,.12)] px-2 py-0.5 text-[11px] font-bold text-accent-blue"
                            }
                          >
                            {result.evidence === "measured"
                              ? "Measured"
                              : "Observed"}
                          </span>
                          <span className="block">{result.label}</span>
                        </dt>
                        <dd className="mt-2 text-2xl font-black text-accent-blue">
                          {result.value}
                        </dd>
                        <dd className="mt-2 text-xs leading-relaxed text-white/50">
                          {result.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 border-t border-white/[0.08] pt-6">
                    <p className="text-xs font-bold uppercase tracking-[.12em] text-white/50">
                      Work connected in this case
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {caseStudy.relatedServices.map((service) => (
                        <li key={service.href}>
                          <Link
                            className="text-sm font-semibold text-white/70 hover:text-white"
                            href={service.href}
                          >
                            {service.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="mt-8"
                    href={`/work/${caseStudy.slug}`}
                    variant="ghost"
                  >
                    Read the full case study{" "}
                    <ArrowRight aria-hidden="true" size={17} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FinalCta
        data={{
          eyebrow: "Free Lead Leak Review",
          title: "Find Out Where You're",
          titleAccent: "Losing the Work.",
          subtitle:
            "Send your business and website details. Matt will review the lead path and send specific findings on what to fix first. A short call afterward is optional.",
          ctaLabel: "Get My Free Lead Leak Review",
          micro:
            "No long-term commitment  ·  Clear recommendations  ·  Fixed scope before work begins",
          secondary: { label: "View Pricing", href: "/pricing" },
        }}
      />
    </div>
  );
}
