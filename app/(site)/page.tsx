import type { Metadata } from "next";

import HomePage from "./Home";

import { site, siteUrl } from "@/config/site.config";
import { homeData } from "@/data/home";
import { buildPageMetadata, normalizeBrandName } from "@/lib/seo/metadata";

const ogTitle = "Turn More Searches, Clicks & Calls Into Customers";
const ogDescription =
  "We find where opportunities are being lost between a customer searching and you winning the job — then fix the part costing you the most.";
const ogImage = new URL(site.defaultOgImage, siteUrl()).toString();

export const metadata: Metadata = buildPageMetadata({
  title: "Service Business Websites, Local SEO & Lead Systems",
  description:
    "ALL8 helps U.S. and Canadian service businesses improve websites, local search, lead response, follow-up and tracking so more opportunities become customers.",
  path: "/",
  image: ogImage,
  openGraphTitle: ogTitle,
  openGraphDescription: ogDescription,
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl()}/#faq`,
  mainEntity: homeData.faqs.map((faq) => ({
    "@type": "Question",
    name: normalizeBrandName(faq.q),
    acceptedAnswer: {
      "@type": "Answer",
      text: normalizeBrandName(faq.a),
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        type="application/ld+json"
      />
      <HomePage />
    </>
  );
}
