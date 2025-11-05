'use client';

import { motion } from 'framer-motion';
import { Card } from '@/app/(site)/components/SectionWrapper';
import {
  LucideCpu,
  LucideTrendingUp,
  LucideGlobe,
  LucideZap,
} from 'lucide-react';

const stats = [
  {
    label: 'Built for Growth',
    value: 'Scalable by Design',
    icon: LucideTrendingUp,
  },
  {
    label: 'SEO Ready',
    value: 'Optimized from Day One',
    icon: LucideGlobe,
  },
  {
    label: 'Conversion Focused',
    value: 'Turn Clicks into Calls',
    icon: LucideZap,
  },
  {
    label: 'Modern Stack',
    value: 'Next.js + TypeScript + Tailwind CSS',
    icon: LucideCpu,
  },
];

export default function StatGrid() {
  return (
    <section className="relative isolate py-16 md:py-20 bg-[#0b0f1a] text-white overflow-hidden rounded-2xl">
      {/* Blueprint grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0  bg-repeat opacity-5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/20 to-transparent"
      />

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              variant="glass"
              className="relative group p-6 text-center bg-white/5 border border-white/10 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(0,118,255,0.25)] transition-all duration-300 backdrop-blur-xl min-h-45"
            >
              <div className="flex justify-center mb-4">
                <Icon className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors duration-300" />
              </div>
              <p className="text-sm text-slate-300 tracking-wide uppercase">
                {label}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>

              {/* glow accent */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,118,255,0.5),transparent)]" />
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
