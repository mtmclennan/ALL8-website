'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { ButtonGradientWrapper } from '@/app/(site)/components/SectionWrapper';

type ServiceHeroProps = {
  hero: {
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    image?: string;
  };
};

export default function ServiceHero({ hero }: ServiceHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary/5">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Copy */}
        <div className="md:col-span-7 sm:ml-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {hero.titlePrefix}{' '}
            <motion.span
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.0, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6, stiffness: 260 }}
              className="inline-block text-chrome font-extrabold"
            >
              {hero.highlight}
            </motion.span>
            {'   '}
            {hero.titleSuffix}
          </h1>
          <p className="mt-6 text-lg text-foreground/80 max-w-xl">
            {hero.subtitle}
          </p>

          <div className="mt-8">
            <ButtonGradientWrapper>
              <Button
                as={Link}
                href={hero.ctaHref}
                size="lg"
                color="primary"
                className="min-w-[180px] bg-chrome-cta hover:bg-chrome-cta-hover focus-visible:ring-2 focus-visible:ring-chrome"
                radius="md"
              >
                {hero.ctaLabel}
              </Button>
            </ButtonGradientWrapper>
          </div>
        </div>

        {/* Image */}
        {hero.image && (
          <div className="md:col-span-5 relative h-[320px] sm:h-[420px] md:h-[500px]">
            <Image
              src={hero.image}
              alt={hero.titleSuffix}
              fill
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 60vw, 100vw"
              className="object-cover rounded-2xl shadow-lg"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
