import aboutJson from "./about.json";

export type AboutPageData = {
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
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    geo: string;
  };
  shift: {
    eyebrow: string;
    title: string;
    cards: { tag: string; title: string; body: string }[];
    story: string[];
    pullQuote: string;
    storyAfter: string[];
  };
  founder: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    name: string;
    role: string;
    image: { src: string; alt: string; width: number; height: number };
  };
  principles: {
    eyebrow: string;
    title: string;
    items: { n: string; title: string; body: string }[];
  };
  who: {
    eyebrow: string;
    title: string;
    subtitle: string;
    chips: string[];
    note: string;
  };
  facts: {
    eyebrow: string;
    title: string;
    items: { k: string; v: string }[];
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
    footNoteLink: { label: string; href: string };
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

export const aboutPageData = aboutJson as AboutPageData;
