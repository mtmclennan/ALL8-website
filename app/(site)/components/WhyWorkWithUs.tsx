'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, motion } from 'framer-motion';
import {
  Zap,
  Search,
  Target,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { ShineIcon } from './ShineIcon';
import {
  ButtonGradientWrapper,
  Section,
  SectionHeader,
} from './SectionWrapper';
import { Button } from '@heroui/button';

const ICONS = {
  zap: Zap,
  search: Search,
  target: Target,
  shield: ShieldCheck,
} satisfies Record<string, LucideIcon>;

type IconKey = keyof typeof ICONS;

export type Benefit = {
  title: string;
  description: string;
  icon: IconKey;
};

type Props = {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel?: string;
  benefits: Benefit[];
  tone?: 'dark' | 'light';
  reverse?: boolean;
  clamp?: 2 | 3 | 4;
  imageSrc?: string;
  imageAlt?: string;
};

export default function WhyWorkWithUsTwoCol({
  title,
  titleHighlight,
  subtitle,
  ctaHref,
  ctaLabel = 'Get Your Free Consultation',
  benefits,
  tone = 'dark',
  reverse = false,
  clamp = 3,
  imageSrc,
  imageAlt = '',
}: Props) {
  const isDark = tone === 'dark';
  const subText = isDark ? 'text-gray-300' : 'text-gray-600';
  const ring = isDark ? 'ring-white/10' : 'ring-[#BFBFBF]';

  return (
    <Section tone="highlight" pattern="none" className="py-20 md:py-24">
      <div className="mx-auto px-6 max-w-[1400px]">
        <LazyMotion features={domAnimation}>
          <SectionHeader
            title={
              <>
                {title}{' '}
                <motion.span
                  initial={{ scale: 0.95, opacity: 0.6 }}
                  whileHover={{ scale: 1.2 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    duration: 0.7,
                    stiffness: 300,
                    delay: 0.3,
                  }}
                  className="inline-block whitespace-nowrap text-chrome text-fill-transparent font- font-extrabold"
                >
                  {titleHighlight}
                </motion.span>{' '}
              </>
            }
            subtitle="Get a free consultation. We'll audit your site, outline a plan, and give you clear next steps—no pressure."
            center
            className="sm:text-6xl"
          />
        </LazyMotion>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20">
          <div></div>
          <div
            className={`lg:col-span-5 order-2  ${reverse ? 'lg:order-2' : ''}`}
          >
            {imageSrc && (
              <div
                className={`mt-2 relative overflow-hidden rounded-2xl ring-1 ${ring}`}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={1400}
                  height={933}
                  className="w-full h-auto"
                  sizes="(min-width:1536px) 700px,
         (min-width:1280px) 600px,
         (min-width:1024px) 45vw,
         (min-width:768px) 80vw,
         100vw"
                  loading="lazy"
                  fetchPriority="low"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSIjZGRkZGRkIi8+PC9zdmc+"
                />
                <div
                  className="absolute inset-0 bg-blueprint-overlay"
                  aria-hidden
                />
              </div>
            )}

            <div className="mt-16 flex justify-center">
              <ButtonGradientWrapper>
                <Button
                  href={ctaHref}
                  as={Link}
                  size="lg"
                  radius="sm"
                  variant="solid"
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-base font-medium text-white bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-chrome"
                >
                  {ctaLabel}
                </Button>
              </ButtonGradientWrapper>
            </div>
          </div>
          <div
            className={`order-1 lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}
          >
            <LazyMotion features={domAnimation}>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20%' }}
                variants={{
                  hidden: { opacity: 1 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.06,
                    },
                  },
                }}
                className="grid grid-cols-1 gap-x-8 gap-y-6"
              >
                {benefits.map(({ title, description, icon }, idx) => {
                  const Icon = ICONS[icon];
                  return (
                    <motion.li
                      key={title}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="relative"
                    >
                      <div className="">
                        {idx > 0 && (
                          <GradientRule tone={tone} className="mb-4" />
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        <ShineIcon Icon={Icon} size={28} tone={tone} />
                        <div className="min-w-0">
                          <h3 className="text-2xl font-semibold">{title}</h3>
                          <p className={`mt-1 ${subText} line-clamp-3`}>
                            {description}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </LazyMotion>
          </div>
        </div>
      </div>
    </Section>
  );
}

function GradientRule({
  tone,
  className = '',
}: {
  tone: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div
      className={`h-px w-full ${className} bg-gradient-rule-${tone}`}
      aria-hidden
    />
  );
}
