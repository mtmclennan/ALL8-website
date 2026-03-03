'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { LazyMotion, domAnimation, motion } from 'framer-motion';
import { BadgeCheck, ArrowUpRight } from 'lucide-react';

import { getServicesWithIcons, ServiceWithIcon } from '@/data/services';
import {
  Section,
  ButtonGradientWrapper,
} from '@/app/(site)/_components/SectionWrapper';
import { Button } from '@heroui/button';

type ServiceShowcaseProps = {
  title?: string;
  subtitle?: string;
  kicker?: string;

  /** Optional CTAs under the grid */
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };

  className?: string;
};

const allServices: ServiceWithIcon[] = getServicesWithIcons();
const services = allServices.filter((s) => s.featured);

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesShowcase({
  title = 'Choose a Starting Point',
  subtitle = 'Start with a performance tune-up, ongoing maintenance, or a full rebuild when you’re ready.',
  kicker,
  primaryCta = {
    href: '/services/performance-tune-up',
    label: 'Performance Tune-Up (From $950)',
  },
  secondaryCta = { href: '/services', label: 'View all services' },
  className = '',
}: ServiceShowcaseProps) {
  return (
    <Section
      tone="highlight"
      pattern="grid"
      className={className}
      containerClassName="max-w-max"
    >
      {/* Header (matches your ServiceOverview style) */}
      <div id="services-list" className="mx-auto mb-12 max-w-4xl text-center">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg text-foreground/70">{subtitle}</p>
        {kicker && (
          <p className="mt-4 text-base font-medium text-primary">{kicker}</p>
        )}
      </div>

      <LazyMotion features={domAnimation}>
        <>
          {/** scroll shows 4 */}
          {/** grid shows 3 */}
          {(() => {
            const scrollServices = services.slice(0, 4);
            const gridServices = services.slice(0, 3);

            return (
              <>
                {/* Mobile: horizontal scroll (includes 4th card) */}
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-15%' }}
                  className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:hidden"
                >
                  {scrollServices.map((s) => (
                    <motion.li
                      key={s.slug}
                      variants={cardVariants}
                      className="snap-start min-w-[280px] max-w-[320px]"
                    >
                      <ServiceShowcaseCard service={s} />
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Desktop: grid (only 3 cards, no cramped 4-across) */}
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-15%' }}
                  className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  {gridServices.map((s) => (
                    <motion.li key={s.slug} variants={cardVariants}>
                      <ServiceShowcaseCard service={s} />
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            );
          })()}
        </>
      </LazyMotion>

      {/* Bottom CTA row (optional but recommended for funnel) */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3">
        {primaryCta && (
          <ButtonGradientWrapper>
            <Button
              as={Link}
              href={primaryCta.href}
              variant="solid"
              color="primary"
              size="lg"
              radius="md"
              className="text-lg"
              aria-label={primaryCta.label}
            >
              {primaryCta.label}
            </Button>
          </ButtonGradientWrapper>
        )}

        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-4"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </Section>
  );
}

function ServiceShowcaseCard({ service }: { service: ServiceWithIcon }) {
  const { slug, title, short, description, card, Icon } = service;
  const blurb = short ?? description;

  return (
    <Link
      href={`/services/${slug}`}
      aria-label={`Learn more about ${title}`}
      className={clsx(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10',
        'bg-background/70 shadow-md transition',
        'hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
    >
      {/* Image */}
      {card?.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={card.image}
            alt={card.alt || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* subtle overlay for text contrast */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-6 min-h-60">
        <div>
          <div className="flex items-start gap-3">
            <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
            <h3 className="text-2xl font-bold leading-tight">{title}</h3>
          </div>

          <p className="mt-3 text-base text-foreground/70">{blurb}</p>
        </div>

        {/* Footer CTA (badge style, like your ServiceOverview) */}
        <div className="mt-6 flex items-center justify-between">
          <span
            className={clsx(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
              'border-silver/40 bg-background/70 text-foreground/80',
            )}
          >
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Learn more
          </span>

          <ArrowUpRight
            className="h-5 w-5 text-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
