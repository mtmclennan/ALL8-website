'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonGradientWrapper } from '@/app/(site)/components/SectionWrapper';
import { Button } from '@heroui/button';
import aboutImage from '@/public/assets/all8-webworks-web-design-and-development-logo.png';
import homeData from '@/data/home.json'; // adjust path as needed

interface AboutHeroProps {
  title: string;
  subtitle: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function AboutHero({
  title,
  subtitle,
  body,
  ctaLabel,
  ctaHref,
}: AboutHeroProps) {
  // expect aboutHero = { title, subtitle, body, body2, ctaLabel, ctaHref }

  return (
    <section className="relative isolate overflow-hidden text-white min-h-[80vh] bg-blueprint bg-primary/5">
      {/* Blueprint background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-70 mix-blend-overlay animate-parallax-lines" />
        <div className="absolute inset-x-0 top-0 h-60 opacity-40 scan-v scan-v-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10 2xl:gap-20">
          {/* Left copy */}
          <div className="max-w-2xl md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tight"
            >
              {title}
            </motion.h1>
            <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-xl">
              {subtitle}
            </p>
            {body && (
              <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-xl">
                {body}
              </p>
            )}

            {ctaLabel && (
              <div className="mt-10 flex items-center">
                <ButtonGradientWrapper>
                  <Button
                    as={Link}
                    href={ctaHref}
                    size="lg"
                    color="primary"
                    className="min-w-[180px] bg-chrome-cta hover:bg-chrome-cta-hover focus-visible:ring-2 focus-visible:ring-chrome"
                    radius="md"
                  >
                    {ctaLabel}
                  </Button>
                </ButtonGradientWrapper>
              </div>
            )}
          </div>

          {/* Right: supporting image */}
          <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[560px] md:col-span-5">
            <Image
              src={aboutImage}
              alt="Team collaborating on high-performance website design"
              fill
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 60vw, 100vw"
              className="object-cover rounded-2xl shadow-lg"
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
        </div>
      </div>
    </section>
  );
}
