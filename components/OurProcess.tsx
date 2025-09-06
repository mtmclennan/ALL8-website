'use client';

import React from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { ClipboardList, Brush, Rocket, TrendingUp } from 'lucide-react';

// ⬇️ Import the shared section primitives
import { Section, SectionHeader, Card } from './SectionWrapper'; // adjust path as needed

const BRAND_PRIMARY = '#0047bb'; // Royal Blue
const BRAND_ACCENT = '#D33F49'; // Assure Red

const steps = [
  {
    title: 'Discovery & Strategy',
    description:
      'We learn your goals, audience, and competition to build a plan that ties your site to revenue.',
    Icon: ClipboardList,
  },
  {
    title: 'Design & Build',
    description:
      'Custom, high‑performance design developed with modern tech — fast, accessible, and secure.',
    Icon: Brush,
  },
  {
    title: 'Launch & Optimize',
    description:
      "We launch with SEO, analytics, and tracking in place so you're Google‑ and ads‑ready from day one.",
    Icon: Rocket,
  },
  {
    title: 'Ongoing Growth',
    description:
      'Hosting, updates, SEO tuning, and ad management so your site keeps performing while you work.',
    Icon: TrendingUp,
  },
] as const;

export default function ProcessSection() {
  const prefersReduced = useReducedMotion();

  return (
    <Section tone="base" pattern="blueprint">
      <SectionHeader
        title="Our Process: Simple, Clear, Proven"
        subtitle="Here’s how we take your project from idea to launch — and growth."
        center
      />

      <LazyMotion features={domAnimation}>
        {/* Timeline container (vertical on mobile, horizontal on lg+) */}
        <div className="relative">
          {/* connecting line */}
          <m.div
            aria-hidden
            className="absolute left-[30px] top-0 h-full w-px bg-foreground/10 sm:left-1/2 sm:top-auto sm:bottom-0 sm:h-px sm:w-full"
            initial={
              prefersReduced ? { opacity: 0 } : { scaleY: 0, opacity: 0 }
            }
            whileInView={
              prefersReduced ? { opacity: 1 } : { scaleY: 1, opacity: 1 }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />

          {/* Steps */}
          <m.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.15, delayChildren: 0.05 },
              },
            }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-4"
          >
            {steps.map((s, i) => {
              const Icon = s.Icon;
              return (
                <m.li
                  key={s.title}
                  variants={{
                    hidden: prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 24 },
                    show: prefersReduced
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, transition: { duration: 0.55 } },
                  }}
                  whileHover={
                    prefersReduced ? {} : { rotateX: -3, rotateY: 3, z: 0 }
                  }
                  className="group relative"
                >
                  {/* connector dot */}
                  <span
                    aria-hidden
                    className="absolute left-[26px] top-6 z-10 h-2.5 w-2.5 rounded-full border border-foreground/20 bg-background sm:left-1/2 sm:top-auto sm:bottom-[-12px]"
                    style={{ boxShadow: `0 0 0 6px rgba(0,0,0,0.03)` }}
                  />

                  {/* card using shared primitive (bordered style) */}
                  <Card variant="bordered" className="group-hover:shadow-lg">
                    <div className="rounded-2xl bg-background/70 backdrop-blur-sm border border-foreground/10 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        {/* numbered badge */}
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-sm font-semibold"
                          style={{
                            background:
                              `radial-gradient(60% 60% at 50% 40%, ${BRAND_PRIMARY}22, transparent),` +
                              `linear-gradient(180deg, ${BRAND_PRIMARY}15, transparent)`,
                          }}
                        >
                          {i + 1}
                        </span>
                        <Icon className="h-5 w-5" />
                        <h3 className="ml-1 text-base font-semibold leading-tight">
                          {s.title}
                        </h3>
                      </div>
                      <p className="text-sm text-foreground/70">
                        {s.description}
                      </p>
                      {/* Underline accent on hover */}
                      <div
                        className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_transparent)] to-[var(--to,_transparent)] transition-all duration-300 group-hover:w-full"
                        style={{
                          ['--from' as any]: `${BRAND_PRIMARY}`,
                          ['--to' as any]: `${BRAND_ACCENT}`,
                        }}
                      />
                    </div>
                  </Card>
                </m.li>
              );
            })}
          </m.ul>
        </div>
      </LazyMotion>
    </Section>
  );
}
