// src/data/services.ts
import type { FC } from "react";

import { lucideIconMap } from "./lucideIconMap";
import rawServices from "./services.json";

// ---------- Types ----------
export type IconName = keyof typeof lucideIconMap;

export type FAQ = { q: string; a: string };

/** The four-stage lead journey, plus 'support' for services that sit outside it (e.g. maintenance). */
export type ServiceCategory =
  | "found"
  | "contacted"
  | "follow"
  | "win"
  | "support";

export type ServiceHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  secondary?: { label: string; href: string };
};

export type ServiceProblem = {
  title: string;
  intro?: string;
  scenarios: string[];
};

export type ServiceFix = {
  title: string;
  body: string[];
};

export type ServiceStep = { title: string; description: string };

export type ServiceHowItWorks = {
  title?: string;
  steps: ServiceStep[];
};

export type ServiceIncluded = {
  title?: string;
  standard: string[];
  addOns?: string[];
};

export type ServiceWhyItMatters = {
  title?: string;
  points: string[];
};

export type ServiceWorksWith = {
  title?: string;
  intro?: string;
  tools: string[];
};

export type ServicePricingTier = {
  label: string;
  price: string;
  description?: string;
};

export type ServicePricing = {
  label: string;
  note?: string;
  tiers?: ServicePricingTier[];
  /** ISO 4217 currency code for structured data. Defaults to "USD" if omitted. */
  currency?: string;
  /** Present only for subscription-billed services (setup fee + recurring monthly). */
  billing?: {
    setupFee: number;
    monthly: number;
  };
};

export type SEO = {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
  siteName?: string;
};

// ---------- Service ----------
export type Service = {
  slug: string;
  title: string;
  shortTitle?: string;
  category: ServiceCategory;
  secondaryCategory?: ServiceCategory;
  short: string;
  icon: IconName;
  featured: boolean;
  priority?: number;

  hero: ServiceHero;
  problem: ServiceProblem;
  fix: ServiceFix;
  howItWorks: ServiceHowItWorks;
  included: ServiceIncluded;
  whyItMatters: ServiceWhyItMatters;
  worksWith?: ServiceWorksWith;
  pricing: ServicePricing;
  faqs: FAQ[];
  crossLinks: string[];
  seo: SEO;
};

// ---------- Runtime-typed variant ----------
export type ServiceWithIcon = Service & {
  Icon: FC<React.SVGProps<SVGSVGElement>>;
};

// ---------- JSON Input Shape (looser) ----------
type ServiceInput = Omit<Service, "icon"> & { icon: string };

// ---------- Normalize JSON → strict Service[] ----------
const raw = rawServices as ServiceInput[];

export const SERVICES: Service[] = raw.map((s) => ({
  ...s,
  icon: s.icon as IconName,
}));

// ---------- Helpers ----------
export function getServicesWithIcons(): ServiceWithIcon[] {
  return SERVICES.map((service) => ({
    ...service,
    Icon:
      lucideIconMap[service.icon as keyof typeof lucideIconMap] ??
      lucideIconMap.Rocket,
  }));
}

export function getServiceBySlug(slug: string): ServiceWithIcon | undefined {
  const s = SERVICES.find((s) => s.slug === slug);

  if (!s) return undefined;

  return {
    ...s,
    Icon:
      lucideIconMap[s.icon as keyof typeof lucideIconMap] ??
      lucideIconMap.Rocket,
  };
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return SERVICES.filter((s) => s.category === category);
}
