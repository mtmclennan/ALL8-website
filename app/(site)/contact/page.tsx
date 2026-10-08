import type { Metadata } from "next";

import ContactHero from "./components/ContactHero";
import ChannelsSection from "./components/ChannelsSection";
import FormSection from "./components/FormSection";
import NextSteps from "./components/NextSteps";

import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { contactPageData } from "@/data/pages/contact";

export const metadata: Metadata = buildStaticMetadata("/contact");

validateMetadata(metadata.title, metadata.description);

export default function ContactPage() {
  return (
    <>
      <ContactHero data={contactPageData.hero} />
      <FormSection />
      <ChannelsSection data={contactPageData.channels} />
      <NextSteps data={contactPageData.next} />
    </>
  );
}
