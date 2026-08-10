import type { Metadata } from "next";

import HomePage from "./Home";

import { siteUrl } from "@/config/site.config";
import { homeData } from "@/data/home";

export const metadata: Metadata = {
  title: "Turn More Searches, Clicks & Calls Into Customers | ALL8 WEBWORKS",
  description:
    "ALL8 WEBWORKS finds where your service business is losing work — search, website, follow-up or tracking — and fixes the part costing you the most. Lead systems for service businesses across the U.S. and Canada.",
  alternates: { canonical: siteUrl() },
  openGraph: {
    type: "website",
    url: siteUrl(),
    title: "Turn More Searches, Clicks & Calls Into Customers",
    description:
      "We find where opportunities are being lost between a customer searching and you winning the job — then fix the part costing you the most.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl()}/#faq`,
  mainEntity: homeData.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
