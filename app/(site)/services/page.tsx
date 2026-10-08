import type { Metadata } from "next";

import ProofCards from "../_components/home/ProofCards";
import ProcessSteps from "../_components/home/ProcessSteps";
import FinalCta from "../_components/home/FinalCta";

import CurrentServices from "./components/CurrentServices";
import ServicesHero from "./components/ServicesHero";

import { servicesPageData } from "@/data/pages/servicesPage";
import { site, siteUrl } from "@/config/site.config";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";
import { normalizeBrandName } from "@/lib/seo/metadata";

export const metadata: Metadata = buildStaticMetadata("/services");

validateMetadata(metadata.title, metadata.description);

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl()}/services#page`,
      url: `${siteUrl()}/services`,
      name: normalizeBrandName(servicesPageData.title),
      description: normalizeBrandName(servicesPageData.description),
      mainEntity: {
        "@type": "ItemList",
        name: `${site.name} Capabilities`,
        itemListElement: servicesPageData.outcomes.blocks.map(
          (block, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: block.label,
              description: block.description,
            },
          }),
        ),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl()}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${siteUrl()}/services`,
        },
      ],
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <ServicesHero data={servicesPageData.hero} />
      <CurrentServices />
      <ProofCards data={servicesPageData.proof} />
      <ProcessSteps data={servicesPageData.process} />
      <FinalCta data={servicesPageData.finalCta} />
    </>
  );
}
