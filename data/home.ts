import type { Stage } from "@/lib/utils/stage";

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
    eyebrow: string;
    title: string;
    subtitle: string;
    columns: { label: string; stage: Stage; items: string[] }[];
    note: string;
  };
  system: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stages: {
      stage: Stage;
      step: string;
      title: string;
      description: string;
      tags: string[];
    }[];
    footNote: string;
    ctaLabel: string;
  };
  outcomes: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: {
      stage: Stage;
      title: string;
      description: string;
      items: string[];
    }[];
    footNote: { prefix: string; linkLabel: string };
  };
  caseStudy: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lede: string;
    steps: { tag: string; text: string }[];
    ctaLabel: string;
    visual: {
      title: string;
      metrics: { value: string; label: string; stage: Stage }[];
      rows: { label: string; percent: number; stage: Stage; status: string }[];
      flag: string;
    };
  };
  flow: {
    eyebrow: string;
    title: string;
    subtitle: string;
    rows: { a: string; b: string }[];
    note: string;
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { stage: Stage; title: string; description: string }[];
  };
  why: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: {
      title: string;
      description: string;
      icon: string;
      color: string;
    }[];
  };
  proofCards: {
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
    ctaLede: string;
    ctaLabel: string;
  };
  founder: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    name: string;
    role: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  faqs: { q: string; a: string }[];
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

export const homeData = homeJson as HomeData;
