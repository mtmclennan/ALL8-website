'use client';

import { Section, SectionHeader } from '@/app/(site)/components/SectionWrapper';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ShineIcon } from '@/app/(site)/components/ShineIcon';

type BenefitsBlockProps = {
  title?: string;
  subtitle?: string;
  benefits?: string[];
};

export default function BenefitsBlock({
  title = 'Why This Matters',
  subtitle = 'The real-world gains our clients experience:',
  benefits = [],
}: BenefitsBlockProps) {
  if (!benefits?.length) return null;

  return (
    <Section tone="base" pattern="none">
      <div className="mx-auto max-w-5xl px-6">
        {/* ✅ Use SectionHeader for consistency */}
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
            {benefits.map((b, i) => (
              <m.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex flex-col items-center rounded-2xl border border-silver/40 bg-background/60 p-6 text-center shadow-sm"
              >
                <ShineIcon Icon={CheckCircle} size={28} tone="dark" />
                <p className="mt-3 text-sm text-foreground/80 leading-snug">
                  {b}
                </p>
              </m.div>
            ))}
          </m.div>
        </LazyMotion>
      </div>
    </Section>
  );
}
