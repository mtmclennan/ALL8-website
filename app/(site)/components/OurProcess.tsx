'use client';

import {
  LazyMotion,
  domAnimation,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { Section, SectionHeader, Card } from './SectionWrapper';
import { ClipboardList, Brush, Rocket, TrendingUp } from 'lucide-react';

// icon mapping
const ICONS = {
  clipboard: ClipboardList,
  brush: Brush,
  rocket: Rocket,
  trending: TrendingUp,
};

type Step = {
  title: string;
  description: string;
  icon: string;
};

type ProcessSectionProps = {
  title: string;
  subtitle?: string;
  steps: Step[];
};

export default function ProcessSection({
  title,
  subtitle,
  steps,
}: ProcessSectionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <Section tone="highlight" pattern="dots">
      <SectionHeader title={title} subtitle={subtitle} center />

      <LazyMotion features={domAnimation}>
        <div className="relative pb-10">
          <motion.ul
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
              const Icon = ICONS[s.icon as keyof typeof ICONS] || Rocket;
              return (
                <motion.li
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
                  {/* Number badge */}
                  <span
                    aria-hidden
                    className="absolute left-[26px] top-6 z-10 bg-background shadow-[0_0_0_6px_rgba(0,0,0,0.03)] sm:left-[calc(50%-16px)] sm:top-auto sm:bottom-[-30px] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-[radial-gradient(60%_60%_at_50%_40%,#0047bb22,transparent),linear-gradient(180deg,#0047bb15,transparent)] text-sm font-semibold"
                  >
                    {i + 1}
                  </span>

                  <Card variant="elevated" className="group-hover:shadow-lg">
                    <div className="rounded-2xl border min-h-45 sm:min-h-60 border-foreground/10 bg-background/70 p-6 backdrop-blur-sm">
                      <div className="mb-3 ml-14 sm:ml-1 flex items-center gap-3">
                        <h3 className="mr-auto text-xl font-semibold leading-tight">
                          {s.title}
                        </h3>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-[radial-gradient(60%_60%_at_50%_40%,#0047bb22,transparent),linear-gradient(180deg,#0047bb15,transparent)] text-sm font-semibold">
                          <Icon className="h-5 w-5 text-primary" />
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70">
                        {s.description}
                      </p>
                      <div className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_#0047bb)] to-[var(--to,_#D33F49)] transition-all duration-300 group-hover:w-full" />
                    </div>
                  </Card>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </LazyMotion>
    </Section>
  );
}
