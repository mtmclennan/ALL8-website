'use client';

import {
  motion,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';

import { Card, CardBody, CardHeader } from '@heroui/card';
import type { ReactNode } from 'react';

type Props = {
  hero: {
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    subtitle: string;
    note?: string;
  };
  form: ReactNode;
  forceMotion?: boolean;
};

export default function TuneUpHeroWithCompactForm({
  hero,
  form,
  forceMotion = false,
}: Props) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = forceMotion || !prefersReduced;

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={forceMotion ? 'never' : 'user'}>
        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* Left: Hero */}
          <div className="lg:col-span-6">
            <motion.h1
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45 }}
              className="text-4xl font-bold tracking-tight md:text-6xl text-foreground"
            >
              {hero.titlePrefix}{' '}
              <motion.span
                initial={shouldAnimate ? { scale: 0.9, opacity: 0.7 } : false}
                animate={
                  shouldAnimate ? { scale: 1.03, opacity: 1 } : undefined
                }
                whileHover={shouldAnimate ? { scale: 1.15 } : undefined}
                transition={{
                  type: 'spring',
                  duration: 0.7,
                  stiffness: 300,
                  delay: 0.15,
                }}
                className="inline-block text-chrome font-extrabold"
              >
                {hero.highlight}
              </motion.span>{' '}
              {hero.titleSuffix}
            </motion.h1>

            <motion.p
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={shouldAnimate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="mt-4 max-w-xl text-base md:text-lg text-foreground/70"
            >
              {hero.subtitle}
            </motion.p>

            {hero.note && (
              <motion.p
                initial={shouldAnimate ? { opacity: 0 } : false}
                animate={shouldAnimate ? { opacity: 1 } : undefined}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="mt-3 text-sm text-foreground/60"
              >
                {hero.note}
              </motion.p>
            )}

            <ul className="mt-6 space-y-2 text-sm text-foreground/75">
              <li>• Focused speed + conversion review</li>
              <li>• Clear explanation of what’s hurting inquiries</li>
              <li>• Prioritized fix list (no fluff)</li>
            </ul>
          </div>

          {/* Right: Form card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:sticky lg:top-24"
            >
              {/* Single card only. No outer wrappers. */}
              <Card className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md shadow-md">
                <CardHeader className="flex flex-col items-start gap-1 pb-0">
                  <div className="text-sm font-semibold text-white">
                    Request your review
                  </div>
                  <div className="text-xs text-neutral-400">
                    5 fields • Review within 1 business day
                  </div>
                </CardHeader>
                <CardBody className="pt-4">{form}</CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
