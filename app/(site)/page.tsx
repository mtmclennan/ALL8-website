import type { Metadata } from "next";

import HomePage from "./Home";

import { site, siteUrl } from "@/config/site.config";
import { homeData } from "@/data/home";
import { buildPageMetadata, normalizeBrandName } from "@/lib/seo/metadata";

const ogTitle = "More Calls. More Quote Requests. Fewer Jobs Slipping Through.";
const ogDescription =
  "Websites, Google visibility and follow-up systems built for contractors, so fewer calls, quote requests and estimates slip through.";
const ogImage = new URL(site.defaultOgImage, siteUrl()).toString();

export const metadata: Metadata = buildPageMetadata({
  title: "Contractor Websites & Local SEO | ALL8 Webworks",
  description:
    "ALL8 builds websites, local search visibility and follow-up systems for contractors, so you get more calls, more quote requests and fewer missed jobs.",
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
