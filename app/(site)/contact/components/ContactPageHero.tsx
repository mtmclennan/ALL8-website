'use client';
import {
  m,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';
import { Button } from '@heroui/button';
import { ButtonGradientWrapper } from '../../components/SectionWrapper';

type ContactHeroProps = {
  hero: {
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    subtitle: string;
    note?: string;
    ctaLabel: string;
    ctaHref: string;
  };
  forceMotion?: boolean;
};

export default function ContactPageHero({
  hero,
  forceMotion = false,
}: ContactHeroProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = forceMotion || !prefersReduced;
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16 text-center">
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion={forceMotion ? 'never' : 'user'}>
          <m.h1
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.45 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            {hero.titlePrefix}{' '}
            <m.span
              initial={shouldAnimate ? { scale: 0.85, opacity: 0.6 } : false}
              whileHover={shouldAnimate ? { scale: 1.3 } : undefined}
              animate={shouldAnimate ? { scale: 1.03, opacity: 1 } : undefined}
              transition={{
                type: 'spring',
                duration: 0.7,
                stiffness: 300,
                delay: 0.2,
              }}
              className="inline-block text-chrome font-extrabold"
            >
              {hero.highlight}
            </m.span>{' '}
            {hero.titleSuffix}
          </m.h1>

          <m.p
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={shouldAnimate ? { opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-foreground/70 md:text-lg"
          >
            {hero.subtitle}
          </m.p>

          {hero.note && (
            <m.p
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="mt-2 text-sm text-foreground/60"
            >
              {hero.note}
            </m.p>
          )}

          <div className="mt-8 flex justify-center">
            <ButtonGradientWrapper>
              <Button
                as="a"
                href={hero.ctaHref}
                color="primary"
                size="lg"
                radius="full"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-lg font-medium text-white bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-chrome"
              >
                {hero.ctaLabel}
              </Button>
            </ButtonGradientWrapper>
          </div>
        </MotionConfig>
      </LazyMotion>
    </section>
  );
}
