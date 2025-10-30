'use client';

import { Section, SectionHeader } from '@/app/(site)/components/SectionWrapper';

import { m, LazyMotion, domAnimation } from 'framer-motion';

type ComparisonPoint = {
  label: string;
  ours: string;
  theirs: string;
};

type Comparison = {
  title?: string;
  subtitle?: string;
  points?: ComparisonPoint[];
};

type ComparisonBlockProps = {
  comparison?: Comparison;
};

export default function ComparisonBlock({ comparison }: ComparisonBlockProps) {
  if (!comparison?.points?.length) return null;

  const { title = 'How We Compare', subtitle, points } = comparison;

  return (
    <Section tone="highlight" pattern="grid">
      <div className="mx-auto max-w-5xl px-6">
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
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
            className="overflow-hidden rounded-2xl border border-silver/40 bg-background/60 shadow-sm"
          >
            <div className="grid grid-cols-3 border-b border-silver/30 bg-content2/60 text-sm font-semibold text-foreground/90">
              <div className="px-4 py-3 text-left">Feature</div>
              <div className="px-4 py-3 text-center text-primary font-orbitron tracking-wide">
                ALL8
              </div>
              <div className="px-4 py-3 text-center text-foreground/70">
                WordPress Templates
              </div>
            </div>

            <div className="divide-y divide-silver/30">
              {points.map((p, i) => (
                <m.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="grid grid-cols-3 items-center px-4 py-4 text-sm"
                >
                  <div className="font-medium text-foreground/90">
                    {p.label}
                  </div>
                  <div className="text-center font-semibold text-primary/90">
                    {p.ours}
                  </div>
                  <div className="text-center text-foreground/70">
                    {p.theirs}
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </Section>
  );
}
