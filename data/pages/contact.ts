import contactJson from "./contact.json";

export type ContactPageData = {
  path: string;
  title: string;
  description: string;
  ogImage: string;
  hero: {
    pill: string;
    titlePrefix: string;
    titleEm: string;
    subtitle: string;
  };
  channels: {
    primary: {
      tag: string;
      title: string;
      body: string;
      smsBody: string;
      note: string;
      ctaLabel: string;
    };
    secondary: { tag: string; title: string; body: string; ctaLabel: string }[];
    quiet: {
      icon: "mail" | "phone" | "clock";
      label: string;
      value?: string;
      note: string;
    }[];
  };
  form: { eyebrow: string; title: string; subtitle: string };
  next: {
    eyebrow: string;
    title: string;
    steps: { title: string; body: string }[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    smsBody: string;
    micro: string;
  };
};

export const contactPageData = contactJson as ContactPageData;
