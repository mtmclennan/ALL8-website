'use client';

import {
  motion,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Badge } from '@heroui/badge';
import type { ReactNode } from 'react';
import { CheckCircle2, Clock, Wrench, Zap } from 'lucide-react';

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
        <div className="grid items-start gap-10 lg:grid-cols-12">
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
                initial={shouldAnimate ? { scale: 0.95, opacity: 0.75 } : false}
                animate={
                  shouldAnimate ? { scale: 1.02, opacity: 1 } : undefined
                }
                whileHover={shouldAnimate ? { scale: 1.08 } : undefined}
                transition={{
                  type: 'spring',
                  duration: 0.6,
                  stiffness: 300,
                  delay: 0.12,
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
              transition={{ duration: 0.35, delay: 0.18 }}
              className="mt-4 max-w-xl text-base md:text-lg text-foreground/70"
            >
              {hero.subtitle}
            </motion.p>

            {hero.note && (
              <motion.p
                initial={shouldAnimate ? { opacity: 0 } : false}
                animate={shouldAnimate ? { opacity: 1 } : undefined}
                transition={{ duration: 0.35, delay: 0.22 }}
                className="mt-3 text-sm text-foreground/60"
              >
                {hero.note}
              </motion.p>
            )}

            {/* Icon bullets, but flat (no card) */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="mt-7 space-y-6"
            >
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-brand-blue mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">
                    Focused speed + conversion review
                  </div>
                  <div className="text-xs text-foreground/60">
                    We look for the biggest leaks first.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-brand-blue mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">
                    Clear explanation of what’s hurting inquiries
                  </div>
                  <div className="text-xs text-foreground/60">
                    You’ll know what matters and why.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="h-6 w-6 text-brand-blue mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">
                    Prioritized fix list (no fluff)
                  </div>
                  <div className="text-xs text-foreground/60">
                    Quick wins first. Bigger fixes clearly scoped.
                  </div>
                </div>
              </div>

              {/* flat chips */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/15 px-3 py-1 text-foreground/70">
                  No long contracts
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-foreground/70">
                  Flat-scope pricing
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-foreground/70">
                  Tune-Ups from $950 CAD
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Form card (keep this, it's the conversion box) */}
          <div className="lg:col-span-6" id="tuneup-form">
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:sticky lg:top-24"
            >
              <Card className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md shadow-md">
                <CardBody className="p-4">{form}</CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
