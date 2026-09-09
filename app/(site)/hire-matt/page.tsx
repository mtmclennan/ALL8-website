import type { Metadata } from "next";

import refinement from "../_components/VisualRefinement.module.css";

import Hero from "./components/Hero";
import ProofMetrics from "./components/ProofMetrics";
import BellhouseCaseStudy from "./components/BellhouseCaseStudy";
import Background from "./components/Background";
import SelectedProjects from "./components/SelectedProjects";
import SkillsGrid from "./components/SkillsGrid";
import ValueForYou from "./components/ValueForYou";
import WhereIFit from "./components/WhereIFit";
import HireCta from "./components/HireCta";

import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { siteUrl } from "@/config/site.config";
import { hireMattPageData } from "@/data/pages/hire-matt";

export const metadata: Metadata = buildStaticMetadata("/hire-matt");

validateMetadata(metadata.title, metadata.description);

const hireMattJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${siteUrl()}/hire-matt`,
  mainEntity: {
    "@type": "Person",
    name: "Matt McLennan",
    jobTitle: "Web Developer and Growth Engineer",
    description: hireMattPageData.description,
    email: hireMattPageData.hero.email,
    address: {
      "@type": "PostalAddress",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    worksFor: {
      "@id": `${siteUrl()}/#organization`,
    },
    sameAs: [
      hireMattPageData.hero.linkedinHref,
      hireMattPageData.hero.githubHref,
    ],
    knowsAbout: [
      "web development",
      "React",
      "Next.js",
      "TypeScript",
      "technical SEO",
      "local SEO",
      "Google Business Profile",
      "GA4",
      "Google Search Console",
      "conversion tracking",
      "attribution",
      "CRM",
      "marketing automation",
      "call tracking",
      "AI workflows",
      "revenue operations",
    ],
    seeks: {
      "@type": "Demand",
      name: "Full-time roles in web development, growth engineering, marketing technology, digital operations and AI workflow development",
    },
  },
};

export default function HireMattPage() {
  const data = hireMattPageData;

  return (
    <div className={refinement.surface}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hireMattJsonLd) }}
        type="application/ld+json"
      />
      <Hero data={data.hero} />
      <WhereIFit data={data.fit} />
      <ProofMetrics data={data.proofMetrics} />
      <BellhouseCaseStudy data={data.caseStudy} />
      <SelectedProjects data={data.projects} />
      <SkillsGrid data={data.skills} />
      <Background data={data.background} />
      <ValueForYou data={data.valueForYou} />
      <HireCta data={data.finalCta} />
    </div>
  );
}
