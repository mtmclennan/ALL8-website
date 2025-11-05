'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Gauge, Rocket, TrendingUp } from 'lucide-react';
import { ButtonGradientWrapper } from '@/app/(site)/components/SectionWrapper';

interface ServicesHeroProps {
  hero: {
    title: string;
    subtitle: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image?: string;
    alt?: string;
  };
}

export default function ServicesPageHero({ hero }: ServicesHeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-white min-h-[95vh] bg-blueprint bg-primary/5">
      {/* Blueprint background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-70 mix-blend-overlay animate-parallax-lines" />
        <div className="absolute inset-x-0 top-0 h-60 opacity-50 scan-v scan-v-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto sm:max-w-10/12 2xl:max-w-[1600px] px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:ml-8 items-center gap-6 lg:grid-cols-12">
          {/* Left copy */}
          <div className="md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-4xl text-center md:text-left font-bold tracking-tight md:text-7xl/20 2xl:text-8xl/25"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="mt-4 text-base text-foreground/80 md:text-lg max-w-xl"
            >
              {hero.subtitle}
            </motion.p>

            {hero.body && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="mt-4 text-base text-foreground/80 md:text-lg max-w-xl"
              >
                {hero.body}
              </motion.p>
            )}

            {/* Feature chips */}
            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-2 font-medium text-white">
                <Gauge size={24} className="text-brand-red" />
                <span>Performance-First</span>
              </div>
              <Divider
                orientation="vertical"
                className=" hidden sm:inline-block h-5"
              />
              <div className="flex items-center gap-2 font-medium text-white">
                <Rocket size={24} className="text-brand-blue" />
                <span>SEO + Ads Optimized</span>
              </div>
              <Divider
                orientation="vertical"
                className="hidden sm:inline-block h-5"
              />
              <div className="flex items-center gap-2 font-medium text-white">
                <TrendingUp size={24} className="text-green-600" />
                <span>Built to Convert</span>
              </div>
            </div>

            {/* CTA buttons */}
            {hero.ctaLabel && hero.ctaHref && (
              <div className="mt-12 flex items-center flex-col sm:flex-row gap-3">
                <ButtonGradientWrapper>
                  <Button
                    href={hero.ctaHref}
                    as={Link}
                    color="primary"
                    size="lg"
                    radius="md"
                    className="min-w-[180px] bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active focus-visible:ring-2 focus-visible:ring-chrome"
                  >
                    {hero.ctaLabel}
                  </Button>
                </ButtonGradientWrapper>

                <ButtonGradientWrapper>
                  <Button
                    href="/contact"
                    as={Link}
                    variant="solid"
                    size="lg"
                    radius="md"
                    className="bg-background text-white"
                  >
                    Get a Free Quote
                  </Button>
                </ButtonGradientWrapper>
              </div>
            )}
          </div>

          {/* Right image */}
          {hero.image && (
            <div className="relative h-[380px] w-full md:h-[520px] lg:h-[540px] 2xl:h-[780px] md:col-span-5">
              <Image
                src={hero.image}
                alt={hero.alt || 'ALL8 Webworks services illustration'}
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              <div
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-20"
                style={{
                  background:
                    'radial-gradient(40% 40% at 60% 50%, rgba(0,118,255,0.5), transparent 60%)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
