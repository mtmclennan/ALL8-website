'use client';

import { Section, SectionHeader } from '@/app/(site)/components/SectionWrapper';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { ShineIcon } from '@/app/(site)/components/ShineIcon';
import { lucideIconMap } from '@/data/lucideIconMap';
import { AlertTriangle } from 'lucide-react';
import type { IconName } from '@/data/services';

type SolutionPoint = {
  icon: IconName;
  title: string;
  description: string;
};

type Solution = {
  title?: string;
  subtitle?: string;
  points?: SolutionPoint[];
};

type SolutionBlockProps = {
  solution?: Solution;
};

export default function SolutionBlock({ solution }: SolutionBlockProps) {
  if (!solution?.points?.length) return null;

  const { title = 'Our Solution', subtitle, points } = solution;

  return (
    <Section tone="alt" pattern="none">
      <div className="mx-auto max-w-5xl px-6">
        {/* ✅ Use SectionHeader for consistent styling */}
        <SectionHeader title={title} subtitle={subtitle} center />

        <LazyMotion features={domAnimation}>
          <motion.div
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
            {points.map((p, i) => {
              const Icon =
                lucideIconMap[p.icon as keyof typeof lucideIconMap] ??
                AlertTriangle;

              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="flex flex-col items-center rounded-2xl border border-silver/40 bg-background/70 p-6 text-center shadow-sm"
                >
                  <ShineIcon Icon={Icon} size={28} tone="dark" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-snug">
                    {p.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </LazyMotion>
      </div>
    </Section>
  );
}
