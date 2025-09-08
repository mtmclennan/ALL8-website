import * as React from 'react';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#BFBFBF]/30 bg-white/5 p-4 backdrop-blur">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function StatGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
      <Stat label="Typical Lighthouse" value="95–100" />
      <Stat label="Avg. lead lift" value="+30–60%" />
      <Stat label="Core Web Vitals" value="> 90% pass" />
      <Stat label="Stack" value="Next.js + HeroUI + Tailwind" />
    </div>
  );
}
