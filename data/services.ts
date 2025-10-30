// src/data/services.ts
import { lucideIconMap } from './lucideIconMap';
import type { FC } from 'react';
import rawServices from './services.json';

// ---------- Types ----------
export type IconName = keyof typeof lucideIconMap;

export type FAQ = { q: string; a: string };

export type CTA = {
  titlePrefix: string;
  highlight: string;
  titleSuffix: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  note?: string;
};

export type ProcessStep = {
  title: string;
  description: string;
  icon: IconName;
};

export type Process = {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
};

export type ImageBlock = {
  image: string;
  alt: string;
};

// ---------- SEO ----------
export type SEO = {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  siteName?: string;
};

// ---------- Hero ----------
export type Hero = {
  image: string;
  alt: string;
  titlePrefix: string;
  highlight: string;
  titleSuffix: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

// ---------- Overview ----------
export type OverviewBadge = {
  label: string;
  icon: IconName;
};

export type Overview = {
  title: string;
  description: string;
  oneLiner?: string;
  badges: OverviewBadge[];
};

// ---------- Problem / Solution ----------
export type ProblemPoint = {
  icon: IconName;
  title: string;
  description: string;
};

export type Problem = {
  title?: string;
  subtitle?: string;
  points: ProblemPoint[];
};

export type SolutionPoint = {
  icon: IconName;
  title: string;
  description: string;
};

export type Solution = {
  title?: string;
  subtitle?: string;
  points: SolutionPoint[];
};

// ---------- Comparison ----------
export type ComparisonPoint = {
  label: string;
  ours: string;
  theirs: string;
};

export type Comparison = {
  title?: string;
  subtitle?: string;
  points: ComparisonPoint[];
};

// ---------- Service ----------
export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  benefits: string[];
  features: string[];
  priceFrom?: string;
  ctaLabel?: string;
  icon: IconName;
  faqs?: FAQ[];
  seo?: SEO;
  priority?: number;
  card?: ImageBlock;
  hero?: Hero;
  overview?: Overview;
  problem?: Problem;
  solution?: Solution;
  comparison?: Comparison;
  process?: Process;
  cta?: CTA;
};

// ---------- Runtime-typed variant ----------
export type ServiceWithIcon = Service & {
  Icon: FC<React.SVGProps<SVGSVGElement>>;
};

// ---------- JSON Input Shape (looser) ----------
type ServiceInput = Omit<
  Service,
  'icon' | 'process' | 'overview' | 'problem' | 'solution' | 'comparison'
> & {
  icon: string;
  seo?: Omit<SEO, 'imageAlt'> & { imageAlt?: string };
  process?: {
    title: string;
    subtitle?: string;
    steps: { title: string; description: string; icon: string }[];
  };
  overview?: {
    title: string;
    description: string;
    oneLiner?: string;
    badges: { label: string; icon: string }[];
  };
  problem?: {
    title?: string;
    subtitle?: string;
    points: { icon: string; title: string; description: string }[];
  };
  solution?: {
    title?: string;
    subtitle?: string;
    points: { icon: string; title: string; description: string }[];
  };
  comparison?: {
    title?: string;
    subtitle?: string;
    points: { label: string; ours: string; theirs: string }[];
  };
};

// ---------- Normalize JSON → strict Service[] ----------
const raw = rawServices as ServiceInput[];

export const SERVICES: Service[] = raw.map((s) => ({
  ...s,
  icon: s.icon as IconName,
  process: s.process
    ? {
        ...s.process,
        steps: s.process.steps.map((step) => ({
          ...step,
          icon: step.icon as IconName,
        })),
      }
    : undefined,
  overview: s.overview
    ? {
        ...s.overview,
        badges: s.overview.badges.map((b) => ({
          ...b,
          icon: b.icon as IconName,
        })),
      }
    : undefined,
  problem: s.problem
    ? {
        ...s.problem,
        points: s.problem.points.map((p) => ({
          ...p,
          icon: p.icon as IconName,
        })),
      }
    : undefined,
  solution: s.solution
    ? {
        ...s.solution,
        points: s.solution.points.map((p) => ({
          ...p,
          icon: p.icon as IconName,
        })),
      }
    : undefined,
  comparison: s.comparison
    ? {
        ...s.comparison,
        points: s.comparison.points.map((p) => ({ ...p })),
      }
    : undefined,
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
