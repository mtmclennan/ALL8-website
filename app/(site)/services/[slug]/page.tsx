import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ServiceBreadcrumbs from "./components/ServiceBreadcrumbs";
import ServiceHero from "./components/ServiceHero";
import ServiceProblem from "./components/ServiceProblem";
import ServiceFix from "./components/ServiceFix";
import ServiceHowItWorks from "./components/ServiceHowItWorks";
import ServiceIncluded from "./components/ServiceIncluded";
import ServiceWhyItMatters from "./components/ServiceWhyItMatters";
import ServiceWorksWith from "./components/ServiceWorksWith";
import ServiceProof from "./components/ServiceProof";
import ServicePricing from "./components/ServicePricing";
import ServiceCrossLinks from "./components/ServiceCrossLinks";
import ServiceResources from "./components/ServiceResources";
import ServiceFinalCta from "./components/ServiceFinalCta";

import FAQBlock from "@/app/(site)/_components/FAQBlock";
import { getServiceBySlug, SERVICES } from "@/data/services";
import { site, siteUrl } from "@/config/site.config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400; // 24 hours

type Params = { slug: string };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: site.name,
      description:
        "Lead systems for service businesses — websites, SEO, ads, follow-up and tracking that work together.",
    };
  }

  const { seo } = service;
  const title = seo?.title || `${service.title} | ${site.name}`;
  const description = seo?.description || service.short;
  const image =
    seo?.image || new URL(site.defaultOgImage, siteUrl()).toString();

  return buildPageMetadata({
    title,
    description,
    path: `/services/${service.slug}`,
    image,
    type: seo?.type === "article" ? "article" : "website",
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return notFound();

  const base = siteUrl();
  const canonical = `${base}/services/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: service.title,
        description: service.seo?.description || service.short,
        url: canonical,
        provider: {
          "@type": "Organization",
          name: site.name,
          url: base,
        },
        areaServed: ["US", "CA"],
        offers: {
          "@type": "Offer",
          priceCurrency: service.pricing.currency ?? "USD",
          description: service.pricing.note
            ? `${service.pricing.label} — ${service.pricing.note}`
            : service.pricing.label,
          ...(service.pricing.billing
            ? {
                price: service.pricing.billing.monthly,
                priceSpecification: [
                  {
                    "@type": "UnitPriceSpecification",
                    price: service.pricing.billing.monthly,
                    priceCurrency: service.pricing.currency ?? "USD",
                    billingDuration: "P1M",
                    referenceQuantity: {
                      "@type": "QuantitativeValue",
                      value: 1,
                      unitCode: "MON",
                    },
                  },
                  {
                    "@type": "PriceSpecification",
                    name: "Setup fee",
                    price: service.pricing.billing.setupFee,
                    priceCurrency: service.pricing.currency ?? "USD",
                  },
                ],
              }
            : {}),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${base}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: canonical,
          },
        ],
      },
      ...(service.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: service.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <ServiceBreadcrumbs title={service.title} />
      <ServiceHero
        hero={service.hero}
        stage={service.category === "support" ? "win" : service.category}
      />
      <ServiceProblem problem={service.problem} />
      <ServiceFix fix={service.fix} />
      <ServiceHowItWorks howItWorks={service.howItWorks} />
      <ServiceIncluded included={service.included} />
      <ServiceWhyItMatters whyItMatters={service.whyItMatters} />
      <ServiceWorksWith worksWith={service.worksWith} />
      <ServiceProof serviceSlug={service.slug} />
      <ServicePricing pricing={service.pricing} />
      {service.faqs?.length > 0 && (
        <FAQBlock
          faqs={service.faqs}
          subtitle="Straight answers before you reach out."
          title={`Questions About ${service.shortTitle || service.title}`}
          tone="alt"
        />
      )}
      <ServiceResources serviceSlug={service.slug} />
      <ServiceCrossLinks slugs={service.crossLinks} />
      <ServiceFinalCta title={service.shortTitle || service.title} />
    </>
  );
}
