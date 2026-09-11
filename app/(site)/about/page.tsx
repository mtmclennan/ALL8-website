import type { Metadata } from "next";

import FounderSection from "../_components/home/FounderSection";
import ProofCards from "../_components/home/ProofCards";
import FinalCta from "../_components/home/FinalCta";

import AboutHero from "./components/AboutHero";
import ShiftStory from "./components/ShiftStory";
import Principles from "./components/Principles";
import WhoWeWorkWith from "./components/WhoWeWorkWith";
import Facts from "./components/Facts";

import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { siteUrl } from "@/config/site.config";
import { aboutPageData } from "@/data/pages/about";
import { normalizeBrandName } from "@/lib/seo/metadata";

export const metadata: Metadata = buildStaticMetadata("/about");

validateMetadata(metadata.title, metadata.description);

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl()}/about#founder`,
      name: aboutPageData.founder.name,
      jobTitle: "Founder",
      worksFor: { "@id": `${siteUrl()}/#organization` },
    },
    {
      "@type": "AboutPage",
      "@id": `${siteUrl()}/about#page`,
      url: `${siteUrl()}/about`,
      name: normalizeBrandName(aboutPageData.title),
      description: normalizeBrandName(aboutPageData.description),
      mainEntity: { "@id": `${siteUrl()}/#organization` },
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
          name: "About",
          item: `${siteUrl()}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
        type="application/ld+json"
      />
      <AboutHero data={aboutPageData.hero} />
      <ShiftStory data={aboutPageData.shift} />
      <FounderSection data={aboutPageData.founder} />
      <Principles data={aboutPageData.principles} />
      <WhoWeWorkWith data={aboutPageData.who} />
      <Facts data={aboutPageData.facts} />
      <ProofCards data={aboutPageData.proof} />
      <FinalCta data={aboutPageData.finalCta} />
    </>
  );
}
