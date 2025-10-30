'use client';

import React from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { getServicesWithIcons, ServiceWithIcon } from '@/data/services';
// Shared primitives
import {
  Section,
  SectionHeader,
  Card,
  IconBadge,
  ButtonGradientWrapper,
} from './SectionWrapper'; // adjust path
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';

const BRAND_PRIMARY = '#0047bb'; // Royal Blue
const BRAND_ACCENT = '#D33F49'; // Assure Red

const services: ServiceWithIcon[] = getServicesWithIcons();

export type ServicesOverviewProps = {
  variant?: 'auto' | 'grid' | 'scroll';
  className?: string;
  title?: string;
  subtitle?: string;
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
  title = 'Services Tailored for Growth',
  subtitle = 'From launch to long-term growth, our services are designed to scale with your business.',
  className = '',
}: ServicesOverviewProps) {
  const isScroll = variant === 'scroll';
  const isGrid = variant === 'grid';

  return (
    <Section tone="alt" pattern="grid" className={className}>
      <div className="mb-6 flex justify-center">
        <SectionHeader center title={title} subtitle={subtitle} />
      </div>

      <LazyMotion features={domAnimation}>
        {variant === 'auto' && (
          <>
            {/* Mobile: horizontal scroll cards */}
            <m.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-20%' }}
              className="mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:hidden"
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

      <div className="flex justify-center mt-6">
        <ButtonGradientWrapper>
          <Button
            as={Link}
            href="/services"
            variant="solid"
            color="primary"
            size="lg"
            radius="md"
            aria-label="View all services offered by ALL8 Webworks"
            className="text-lg text-amber-50 bg-background"
          >
            View All Services
          </Button>
        </ButtonGradientWrapper>
      </div>
    </Section>
  );
}

interface ServiceProps {
  service: ServiceWithIcon;
}

function ServiceCard({ service }: ServiceProps) {
  const { slug, title, description, Icon } = service;

  return (
    <Link href={`/services/${slug}`} className="">
      <Card
        variant="bordered"
        className="min-w-[280px] max-w-[360px] sm:min-w-0 sm:max-w-none group"
      >
        <div className="p-4 min-h-[280px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <IconBadge>
              <Icon className="h-6 w-6 text-brand-blue" />
            </IconBadge>
            <h3 className="font-semibold leading-tight text-2xl">{title}</h3>
          </div>

          <p className="mt-3 text-sm text-foreground/70">{description}</p>

          <Chip
            radius="sm"
            variant="faded"
            color="secondary"
            className="text-brand-blue/60"
            startContent={
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
            }
          >
            <p className="">Learn More</p>
          </Chip>

          <div
            className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_transparent)] to-[var(--to,_transparent)] transition-all duration-300 group-hover:w-full"
            style={{
              ['--from' as any]: `${BRAND_PRIMARY}`,
              ['--to' as any]: `${BRAND_ACCENT}`,
            }}
          />
        </div>
      </Card>
    </Link>
  );
}
