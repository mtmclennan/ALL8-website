import type { Stage } from "@/lib/utils/stage";

import { hydrateProofContent } from "../proof";

import servicesPageJson from "./servicesPage.json";

export type ServicesPageData = {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  hero: {
    pill: string;
    titlePrefix: string;
    titleEm: string;
    subtitle: string;
    subtitleStrong: string;
    secondaryLabel: string;
    secondaryHref: string;
    micro: string;
    geo: string;
    badges: { label: string; stage: Stage }[];
  };
  journey: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: {
      stage: Stage;
      icon: "search" | "click" | "phone" | "follow" | "check";
      title: string;
      description: string;
    }[];
    note: string;
  };
  bottleneck: {
    eyebrow: string;
    title: string;
    lead: string;
    rows: { if: string; then: string }[];
    kicker: string;
    ctaLabel: string;
  };
  outcomes: {
    eyebrow: string;
    title: string;
    subtitle: string;
    blocks: {
      stage: Stage;
      num: string;
      label: string;
      title: string;
      description: string;
      capabilities: string[];
    }[];
    winBand: { title: string; subtitle: string; ctaLabel: string };
  };
  connected: {
    eyebrow: string;
    title: string;
    subtitle: string;
    rows: { a: string; b: string }[];
    note: string;
  };
  proof: {
    eyebrow: string;
    title: string;
    cards: {
      value: string;
      em?: boolean;
      label: string;
      sub: string;
      icon: string;
    }[];
    footNote: string;
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { stage: Stage; title: string; description: string }[];
  };
  founder: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    name: string;
    role: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  finalCta: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    checklist: string[];
    ctaLabel: string;
    micro: string;
  };
};

export const servicesPageData = hydrateProofContent(
  servicesPageJson,
) as ServicesPageData;
