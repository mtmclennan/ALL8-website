import React from 'react';

export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Blueprint grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 24px)',
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Built like a performance engine.
            </h1>
            <p className="mt-4 text-slate-300">
              ALL8 Webworks designs and builds websites that idle smooth, rev
              fast, and deliver torque where it matters: more calls, more leads,
              more booked jobs. We specialize in contractors and service
              businesses who need real-world results.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge>Performance-first</Badge>
              <Badge>SEO & Analytics-ready</Badge>
              <Badge>Canada-based</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#BFBFBF]/30 bg-white/5 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}
