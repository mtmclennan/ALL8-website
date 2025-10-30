'use client';

import { Section } from '@/app/(site)/components/SectionWrapper';
import { SectionHeader } from '@/app/(site)/components/SectionWrapper';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { Problem } from '@/data/services';
import { ShineIcon } from '@/app/(site)/components/ShineIcon';
import { lucideIconMap } from '@/data/lucideIconMap';

type ProblemBlockProps = {
  title?: string;
  subtitle?: string;
  problems?: Problem;
};

export default function ProblemBlock({
  title = 'Why Most Websites Don’t Work',
  subtitle = 'Common issues that quietly kill leads and waste ad spend:',
  problems,
}: ProblemBlockProps) {
  if (!problems?.points?.length) return null;

  return (
    <Section tone="alert" pattern="none">
      <div className="mx-auto max-w-5xl px-6">
        {/* Replaced the manual heading with your SectionHeader */}
        <SectionHeader title={title} subtitle={subtitle} center />

        <LazyMotion features={domAnimation}>
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {problems.points.map((p, i) => {
              const Icon =
                lucideIconMap[p.icon as keyof typeof lucideIconMap] ??
                AlertTriangle;

              return (
                <m.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="flex flex-col items-center rounded-2xl border border-silver/40 bg-background/60 p-6 text-center shadow-sm"
                >
                  <ShineIcon Icon={Icon} size={28} tone="dark" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-snug">
                    {p.description}
                  </p>
                </m.div>
              );
            })}
          </m.div>
        </LazyMotion>
      </div>
    </Section>
  );
}
