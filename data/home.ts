import type { Stage } from "@/lib/utils/stage";

import { hydrateProofContent } from "./proof";
import homeJson from "./home.json";

export type HomeData = {
  hero: {
    pill: string;
    titlePrefix: string;
    titleEm: string;
    subtitle: string;
    subtitleStrong: string;
    badges: { label: string; stage: Stage }[];
    ctaLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
    micro: string;
    geo: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  proofStrip: {
    items: { value: string; label: string; em?: boolean }[];
    note: string;
  };
  leak: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    columns: { label: string; stage: Stage; items: string[] }[];
    note: string;
    link?: { prefix: string; label: string; href: string };
  };
  caseStudy: {
    eyebrow?: string;
    title: string;
    titleAccent: string;
    lede: string;
    steps: { tag: string; text: string }[];
    ctaLabel: string;
    secondaryLink: { label: string; href: string };
    visual: {
      title: string;
      metrics: { value: string; label: string; stage: Stage }[];
      rows: { label: string; stage: Stage; status: string }[];
      flag: string;
    };
  };
  why: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    cards: {
      title: string;
      description: string;
      icon: string;
      color: string;
    }[];
  };
  founder: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    name: string;
    role: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  faqs: { q: string; a: string }[];
  finalCta: {
    eyebrow?: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    checklist: string[];
    ctaLabel: string;
    micro: string;
  };
};

export const homeData = hydrateProofContent(homeJson) as HomeData;
