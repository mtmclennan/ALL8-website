'use client';

import React from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  Rocket,
  Wrench,
  Search,
  Target,
  Server,
  LayoutGrid,
} from 'lucide-react';

// Shared primitives
import { Section, SectionHeader, Card, IconBadge } from './SectionWrapper'; // adjust path

const BRAND_PRIMARY = '#0047bb'; // Royal Blue
const BRAND_ACCENT = '#D33F49'; // Assure Red

// Single source of truth for services
const services = [
  {
    slug: 'custom-website-design',
    title: 'Custom Website Design',
    description:
      'High-performance, conversion-focused designs tailored to your brand.',
    Icon: Rocket,
  },
  {
    slug: 'full-stack-development',
    title: 'Full-Stack Development',
    description:
      'Modern stacks (Next.js, Node, TS) with clean, scalable architecture.',
    Icon: Wrench,
  },
  {
    slug: 'seo-google-business',
    title: 'SEO & Google Business Optimization',
    description:
      'On‑page SEO, schema, and GBP tuning to lift local visibility and leads.',
    Icon: Search,
  },
  {
    slug: 'google-ads',
    title: 'Google Ads Setup & Management',
    description:
      'Full funnel setup, tracking, and ongoing optimization for ROI.',
    Icon: Target,
  },
  {
    slug: 'hosting-maintenance',
    title: 'Hosting & Maintenance',
    description:
      'Fast, secure hosting with updates, monitoring, and backups included.',
    Icon: Server,
  },
  {
    slug: 'cms-client-dashboards',
    title: 'CMS & Client Dashboards',
    description:
      'Simple content tools and analytics dashboards your team will love.',
    Icon: LayoutGrid,
  },
] as const;

export type ServicesOverviewProps = {
  /**
   * "auto" = mobile horizontal scroll + desktop grid (recommended)
   * "grid" = grid at all breakpoints
   * "scroll" = horizontal scroll at all breakpoints
   */
  variant?: 'auto' | 'grid' | 'scroll';
  className?: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesOverviewRefactored({
  variant = 'auto',
  className = '',
}: ServicesOverviewProps) {
  const isScroll = variant === 'scroll';
  const isGrid = variant === 'grid';

  return (
    <Section tone="alt" pattern="none" className={className}>
      <div className="flex items-end justify-between gap-4 mb-6">
        <SectionHeader
          title="What We Can Do For You"
          subtitle="Results-first services to build, launch, and grow your online presence."
        />
        <Link
          href="/services"
          className="hidden shrink-0 rounded-xl border border-foreground/10 px-4 py-2 text-sm font-medium hover:bg-foreground/5 md:inline-block"
        >
          View all services
        </Link>
      </div>

      <LazyMotion features={domAnimation}>
        {/* AUTO: mobile scroll, desktop grid */}
        {variant === 'auto' && (
          <>
            {/* Mobile: horizontal scroll cards */}
            <m.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-20%' }}
              className="-mx-4 mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:hidden"
            >
              {services.map((s) => (
                <m.li
                  key={s.slug}
                  variants={cardVariants}
                  className="snap-start"
                >
                  <ServiceCard service={s} />
                </m.li>
              ))}
            </m.ul>

            {/* Desktop: responsive grid */}
            <m.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-20%' }}
              className="hidden grid-cols-1 gap-5 sm:grid md:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((s) => (
                <m.li key={s.slug} variants={cardVariants}>
                  <ServiceCard service={s} />
                </m.li>
              ))}
            </m.ul>
          </>
        )}

        {/* FORCE GRID */}
        {isGrid && (
          <m.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-20%' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <m.li key={s.slug} variants={cardVariants}>
                <ServiceCard service={s} />
              </m.li>
            ))}
          </m.ul>
        )}

        {/* FORCE SCROLL */}
        {isScroll && (
          <m.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-20%' }}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          >
            {services.map((s) => (
              <m.li key={s.slug} variants={cardVariants} className="snap-start">
                <ServiceCard service={s} />
              </m.li>
            ))}
          </m.ul>
        )}
      </LazyMotion>
    </Section>
  );
}

function ServiceCard({
  service,
}: {
  service: {
    slug: string;
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
  };
}) {
  const { slug, title, description, Icon } = service;

  return (
    <Card
      variant="elevated"
      className="min-w-[280px] max-w-[360px] sm:min-w-0 sm:max-w-none group"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <IconBadge>
            <Icon className="h-5 w-5" />
          </IconBadge>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
        </div>

        <p className="mt-3 text-sm text-foreground/70">{description}</p>

        <div className="mt-3">
          <Link
            href={`/services/${slug}`}
            aria-label={`Learn more about ${title}`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground/[0.04] px-3 py-2 text-sm font-medium transition hover:bg-foreground/[0.08]"
          >
            Learn more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>

        {/* Accent line on hover */}
        <div
          className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_transparent)] to-[var(--to,_transparent)] transition-all duration-300 group-hover:w-full"
          style={{
            ['--from' as any]: `${BRAND_PRIMARY}`,
            ['--to' as any]: `${BRAND_ACCENT}`,
          }}
        />
      </div>
    </Card>
  );
}
