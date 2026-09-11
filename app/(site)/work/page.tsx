import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      name: "Results & Case Studies",
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
    <main className="pb-24 pt-[132px] max-[960px]:pb-16">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <header className="mx-auto max-w-[920px] px-6 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Work by {site.name}
        </p>
        <h1 className="mt-4 text-[clamp(40px,6vw,72px)] font-black leading-[.98] tracking-[-.04em]">
          Results &amp; Case Studies
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
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Featured case study
          </p>
          <h2
            className="mt-3 text-[clamp(28px,3.2vw,42px)] font-extrabold tracking-[-.025em]"
            id="featured-work-heading"
          >
            What has ALL8 actually done?
          </h2>
        </div>

        <div className="space-y-8">
          {workCaseStudies.map((caseStudy) => (
            <article
              key={caseStudy.slug}
              className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-content3"
            >
              <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                <div className="relative min-h-[280px] border-b border-white/[0.08] lg:min-h-full lg:border-b-0 lg:border-r">
                  <Image
                    fill
                    priority
                    alt={caseStudy.image.alt}
                    className="object-cover"
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    src={caseStudy.image.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
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
                          {result.label}
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

                  <Link
                    className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-blue px-6 py-3 font-bold text-white hover:bg-[#2388f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                    href={`/work/${caseStudy.slug}`}
                  >
                    Read the full case study <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
