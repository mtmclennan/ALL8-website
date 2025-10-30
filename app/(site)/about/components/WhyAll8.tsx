'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { ShineIcon } from '../../components/ShineIcon';
import {
  Section,
  SectionHeader,
  ButtonGradientWrapper,
} from '../../components/SectionWrapper';
import { Button } from '@heroui/button';
import Link from 'next/link';

// import the icon map you already use for services/process
import { lucideIconMap } from '@/data/lucideIconMap';

interface Benefit {
  title: string;
  description: string;
  icon: string; // icon name as string, e.g. "Target"
}

interface WhyAll8Props {
  benefits: Benefit[];
  why: {
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    subtitle: string;
  };
  cta: {
    label: string;
    href: string;
  };
}

export default function WhyAll8({ benefits, why, cta }: WhyAll8Props) {
  return (
    <Section tone="highlight" pattern="none" className="py-20 md:py-24">
      <div className="mx-auto px-6 max-w-[1400px]">
        <LazyMotion features={domAnimation}>
          <SectionHeader
            title={
              <>
                {why.titlePrefix}{' '}
                <m.span
                  initial={{ scale: 0.95, opacity: 0.6 }}
                  whileHover={{ scale: 1.15 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    duration: 0.6,
                    stiffness: 280,
                    delay: 0.2,
                  }}
                  className="inline-block text-chrome font-extrabold"
                >
                  {why.highlight}
                </m.span>
                {why.titleSuffix}
              </>
            }
            subtitle={why.subtitle}
            center
          />
        </LazyMotion>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-20">
          {/* Left Column - Benefits */}
          <div className="order-1 lg:col-span-7">
            <LazyMotion features={domAnimation}>
              <m.ul
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
                  const Icon =
                    lucideIconMap[icon as keyof typeof lucideIconMap] ??
                    lucideIconMap['Target']; // fallback
                  return (
                    <m.li
                      key={title}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="relative"
                    >
                      {idx > 0 && (
                        <div
                          className="h-px w-full mb-4 bg-gradient-rule-dark"
                          aria-hidden
                        />
                      )}
                      <div className="flex items-start gap-4">
                        <ShineIcon Icon={Icon} size={28} tone="dark" />
                        <div className="min-w-0">
                          <h3 className="text-2xl font-semibold">{title}</h3>
                          <p className="mt-1 text-gray-300">{description}</p>
                        </div>
                      </div>
                    </m.li>
                  );
                })}
              </m.ul>
            </LazyMotion>
          </div>

          {/* Right Column - CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center mt-12 lg:mt-0">
            <ButtonGradientWrapper>
              <Button
                href={cta.href}
                as={Link}
                size="lg"
                radius="sm"
                variant="solid"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-medium text-white bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-chrome"
              >
                {cta.label}
              </Button>
            </ButtonGradientWrapper>
          </div>
        </div>
      </div>
    </Section>
  );
}
