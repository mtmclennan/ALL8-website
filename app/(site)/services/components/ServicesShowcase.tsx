'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { getServicesWithIcons, ServiceWithIcon } from '@/data/services';
import { Section, SectionHeader } from '@/app/(site)/components/SectionWrapper';
import { Button } from '@heroui/button';

interface ServiceShowcaseProps {
  title: string;
  subtitle: string;
}

const services: ServiceWithIcon[] = getServicesWithIcons();

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesShowcase({
  title,
  subtitle,
}: ServiceShowcaseProps) {
  return (
    <Section tone="highlight" pattern="grid">
      <div id="services-list" className="mb-12 flex justify-center">
        <SectionHeader center title={title} subtitle={subtitle} />
      </div>

      <LazyMotion features={domAnimation}>
        <m.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15%' }}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <m.li key={s.slug} variants={cardVariants}>
              <ServiceShowcaseCard service={s} />
            </m.li>
          ))}
        </m.ul>
      </LazyMotion>
    </Section>
  );
}

function ServiceShowcaseCard({ service }: { service: ServiceWithIcon }) {
  const { slug, title, short, card, Icon } = service;

  return (
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background/70 shadow-md transition hover:shadow-xl"
    >
      {/* Image */}
      {card?.image && (
        <div className="relative h-48 w-full">
          <Image
            src={card.image}
            alt={card.alt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-6 min-h-60">
        <div>
          <div className="flex items-start gap-3">
            <Icon className="w-7 h-7 text-brand-blue" />
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="mt-2 text-base text-foreground/70">{short}</p>
        </div>

        <Button
          as="span"
          radius="sm"
          size="sm"
          variant="ghost"
          color="primary"
          className="mt-4 self-start"
        >
          Learn More →
        </Button>
      </div>
    </Link>
  );
}
