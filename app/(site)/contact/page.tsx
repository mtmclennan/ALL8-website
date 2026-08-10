import type { Metadata } from "next";

import FinalCta from "../_components/home/FinalCta";

import ContactHero from "./components/ContactHero";
import ChannelsSection from "./components/ChannelsSection";
import FormSection from "./components/FormSection";
import NextSteps from "./components/NextSteps";

import { buildStaticMetadata } from "@/lib/utils/buildStaticMetadata";
import { validateMetadata } from "@/lib/utils/seoValidation";
import { contactPageData } from "@/data/pages/contact";
import { siteConfig } from "@/config/site";
import { toSmsHref } from "@/lib/utils/phone";

export const metadata: Metadata = buildStaticMetadata("/contact");

validateMetadata(metadata.title, metadata.description);

export default function ContactPage() {
  const smsHref = toSmsHref(siteConfig.phone, contactPageData.finalCta.smsBody);

  return (
    <>
      <ContactHero data={contactPageData.hero} />
      <ChannelsSection data={contactPageData.channels} />
      <FormSection data={contactPageData.form} />
      <NextSteps data={contactPageData.next} />
      <FinalCta
        data={{
          eyebrow: contactPageData.finalCta.eyebrow,
          title: contactPageData.finalCta.title,
          titleAccent: contactPageData.finalCta.titleAccent,
          subtitle: contactPageData.finalCta.subtitle,
          ctaLabel: `Text ${siteConfig.phone}`,
          micro: contactPageData.finalCta.micro,
          primary: { href: smsHref, icon: "sms" },
          secondary: { label: "Use the form instead", href: "#form" },
        }}
      />
    </>
  );
}
