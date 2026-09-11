import { hydrateProofContent } from "../proof";

import hireMattJson from "./hire-matt.json";

export type HireMattPageData = {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  hero: {
    pill: string;
    titlePrefix: string;
    titleEm: string;
    subtitle: string;
    diff: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    secondaryDownload?: string;
    linkedinHref: string;
    githubHref: string;
    email: string;
    geo: string;
    image: { src: string; alt: string; width: number; height: number };
    imageCaption: string;
  };
  proofMetrics: {
    eyebrow: string;
    cards: {
      tag: string;
      value: string;
      em?: boolean;
      label: string;
      context?: string;
      detail?: string;
      kind?: "insight";
      color: string;
    }[];
    footLine: string;
    footNote: string;
  };
  capability: {
    eyebrow: string;
    title: string;
    subtitle: string;
    columns: {
      title: string;
      icon: string;
      color: string;
      items: string[];
    }[];
    note: string;
  };
  caseStudy: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lede: string;
    blocks: { heading: string; paragraphs: string[]; chips?: string[] }[];
    pivot: { heading: string; text: string; from: string; to: string };
    afterBlock: { heading: string; paragraphs: string[] };
    ctaLabel: string;
    ctaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    chain: {
      title: string;
      steps: { label: string; color: string }[];
      resultsHeading: string;
      results: string[];
      evidenceHeading: string;
      evidenceNote: string;
    };
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; color: string; description: string }[];
    note: string;
  };
  background: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    sectorsHeading: string;
    sectors: string[];
    equation: {
      real: { heading: string; body: string };
      technical: { heading: string; body: string };
      result: { heading: string; body: string };
    };
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: {
      name: string;
      kind: string;
      href?: string;
      linkLabel?: string;
      brand?: {
        surface: "light" | "dark";
        logo: { src: string; width: number; height: number };
      };
      color: string;
      role: string;
      problem: string;
      built: string;
      proves: string;
      tags: string[];
    }[];
  };
  skills: {
    eyebrow: string;
    title: string;
    columns: { title: string; color: string; items: string[] }[];
  };
  valueForYou: {
    eyebrow: string;
    title: string;
    subtitle: string;
    rows: { q: string; a: string }[];
  };
  fit: {
    eyebrow: string;
    title: string;
    subtitle: string;
    roles: string[];
    thread: { heading: string; lead: string; body: string };
  };
  finalCta: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string; download?: string };
    tertiary: { label: string; href: string };
    github: { label: string; href: string };
    micro: string;
    microLink: { label: string; href: string };
  };
};

export const hireMattPageData = hydrateProofContent(
  hireMattJson,
) as HireMattPageData;
