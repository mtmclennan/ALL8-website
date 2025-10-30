import * as React from 'react';
import { Card } from '@/app/(site)/components/SectionWrapper';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="glass" className="p-6 backdrop-blur">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </Card>
  );
}

export function StatGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4">
      <Stat label="Built for Growth" value="Scalable by Design" />
      <Stat label="SEO Ready" value="Optimized from Day One" />
      <Stat label="Conversion Focused" value="Turn Clicks into Calls" />
      <Stat label="Modern Stack" value="Next.js + HeroUI + Tailwind" />
    </div>
  );
}
