'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Gauge, Rocket, TrendingUp } from 'lucide-react';
import { ButtonGradientWrapper } from './SectionWrapper';
import styles from './HeroBlueprint.module.css'; // new scoped styles
import heroImage from '@/public/assets/website-seo-performance-laptop-analytics-leads-calls.webp';

export default function HeroBlueprint() {
  return (
    <section
      className={`${styles.bgBlueprint} relative isolate overflow-hidden text-white bg-primary/5`}
    >
      {/* Decorative layer only for motion-capable users */}
      <div
        aria-hidden
        className={`${styles.heroFx} pointer-events-none absolute inset-0 z-0`}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-5xl text-center md:text-left font-bold tracking-tight md:text-7xl/20 2xl:text-8xl/25">
              Websites With Muscle: More Leads, Less Lag
            </h1>

            <p className="mt-4 text-base text-foreground/80 md:text-lg">
              High-performance sites engineered to turn local visitors into{' '}
              <span className="font-semibold text-white">
                calls, quotes, and booked jobs
              </span>{' '}
              for contractors, trades, and service businesses across Canada.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Feature
                icon={<Gauge className="text-brand-red" />}
                text="Performance-First"
              />
              <Divider orientation="vertical" className="h-5 hidden sm:block" />
              <Feature
                icon={<Rocket className="text-brand-blue" />}
                text="SEO + Ads Optimized"
              />
              <Divider orientation="vertical" className="h-5 hidden sm:block" />
              <Feature
                icon={<TrendingUp className="text-green-600" />}
                text="Built to Convert"
              />
            </div>

            <div className="mt-12 flex items-center flex-col sm:flex-row gap-3">
              <ButtonGradientWrapper>
                <Button
                  as={Link}
                  href="/contact"
                  color="primary"
                  size="lg"
                  radius="md"
                  className="min-w-[180px] bg-chrome-cta hover:bg-chrome-cta-hover focus-visible:ring-2 focus-visible:ring-chrome"
                >
                  Get a Free Quote
                </Button>
              </ButtonGradientWrapper>
              <ButtonGradientWrapper>
                <Button
                  as={Link}
                  href="/services"
                  variant="solid"
                  size="lg"
                  radius="md"
                  className="bg-background text-white"
                >
                  Ignite My Business
                </Button>
              </ButtonGradientWrapper>
            </div>
          </div>

          <div className="relative h-[380px] w-full md:h-[520px] lg:h-[540px] 2xl:h-[780px] md:col-span-5">
            <Image
              src={heroImage}
              alt="High-performance website dashboard on a laptop"
              width={400}
              height={300}
              priority
              fetchPriority="high"
              placeholder="blur"
              quality={75}
              sizes="(min-width:1280px) 540px,
         (min-width:1024px) 45vw,
         (min-width:768px) 70vw,
         100vw"
              className="object-contain drop-shadow-2xl"
            />
            <div aria-hidden className={styles.heroGlow} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 font-medium text-white">
      {icon}
      <span>{text}</span>
    </div>
  );
}
