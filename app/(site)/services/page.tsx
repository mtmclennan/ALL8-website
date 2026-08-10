import type { Metadata } from "next";

import IntegrationsFlow from "../_components/home/IntegrationsFlow";
import ProofCards from "../_components/home/ProofCards";
import ProcessSteps from "../_components/home/ProcessSteps";
import FounderSection from "../_components/home/FounderSection";
import FinalCta from "../_components/home/FinalCta";

import OutcomeBlocks from "./components/OutcomeBlocks";
import Bottleneck from "./components/Bottleneck";
import LeadJourney from "./components/LeadJourney";
import ServicesHero from "./components/ServicesHero";

import { servicesPageData } from "@/data/pages/servicesPage";
import { siteUrl } from "@/config/site.config";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";

export const metadata: Metadata = buildStaticMetadata("/services");

validateMetadata(metadata.title, metadata.description);

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl()}/services#page`,
      url: `${siteUrl()}/services`,
      name: servicesPageData.title,
      description: servicesPageData.description,
      mainEntity: {
        "@type": "OfferCatalog",
        name: "ALL8 WEBWORKS Services",
        itemListElement: servicesPageData.outcomes.blocks.map((block) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: block.label,
            description: block.description,
          },
        })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        type="application/ld+json"
      />
      <ServicesHero data={servicesPageData.hero} />
      <LeadJourney data={servicesPageData.journey} />
      <Bottleneck data={servicesPageData.bottleneck} />
      <OutcomeBlocks data={servicesPageData.outcomes} />
      <IntegrationsFlow data={servicesPageData.connected} />
      <ProofCards data={servicesPageData.proof} />
      <ProcessSteps data={servicesPageData.process} />
      <FounderSection data={servicesPageData.founder} />
      <FinalCta data={servicesPageData.finalCta} />
    </>
  );
}
