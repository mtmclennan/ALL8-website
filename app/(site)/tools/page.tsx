import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import { siteUrl } from "@/config/site.config";
import { ALL8_TOOLS } from "@/data/tools";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { STAGE_LABEL } from "@/lib/utils/stage";

const canonical = `${siteUrl()}/tools`;

export const metadata: Metadata = buildPageMetadata({
  title: "Practical Tools for Service Businesses | ALL8 Webworks",
  description:
    "Use practical ALL8 tools to understand where service-business leads may be slipping away and which part of the customer journey deserves attention.",
  path: "/tools",
  openGraphTitle: "Practical Tools for Service Businesses",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${canonical}#page`,
      url: canonical,
      name: "Practical Tools for Service Businesses",
      description: metadata.description,
      isPartOf: { "@id": `${siteUrl()}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: ALL8_TOOLS.length,
        itemListElement: ALL8_TOOLS.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          url: `${siteUrl()}${tool.href}`,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        { "@type": "ListItem", position: 2, name: "Tools", item: canonical },
      ],
    },
  ],
};

export default function ToolsPage() {
  return (
    <main className="pb-24 pt-[132px] max-[960px]:pb-16">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <header className="mx-auto max-w-[860px] px-6 sm:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-white/80">
            Tools
          </span>
        </nav>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Practical resources
        </p>
        <h1 className="mt-4 text-[clamp(40px,6vw,68px)] font-black leading-[.98] tracking-[-.04em]">
          Tools for Service Businesses
        </h1>
        <p className="mt-6 max-w-[720px] text-xl leading-relaxed text-white/70">
          Use your own numbers to understand where opportunities may be slipping
          through the customer journey. No email gate and no invented industry
          benchmarks.
        </p>
      </header>

      <section
        aria-labelledby="available-tools-title"
        className="mx-auto mt-14 max-w-[1000px] px-6 sm:px-10"
      >
        <h2 className="sr-only" id="available-tools-title">
          Available tools
        </h2>
        <div className="grid gap-5">
          {ALL8_TOOLS.map((tool) => (
            <article
              key={tool.href}
              className="rounded-[22px] border border-white/[0.1] bg-content3 p-7 sm:p-9"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-[rgba(0,118,255,.25)] bg-[rgba(0,118,255,.1)] text-accent-blue">
                  <Calculator aria-hidden="true" size={23} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-accent-blue">
                    {STAGE_LABEL[tool.stage]}
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-[-.025em]">
                    <Link
                      className="hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                      href={tool.href}
                    >
                      {tool.title}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-[720px] text-lg leading-relaxed text-white/70">
                    {tool.description}
                  </p>
                  <Link
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-blue px-6 py-3 font-bold text-white hover:bg-[#2388f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                    href={tool.href}
                  >
                    Use the missed-call calculator <ArrowRight size={17} />
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
