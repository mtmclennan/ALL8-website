import * as React from 'react';

export function SocialProof() {
  return (
    <section className="bg-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">
          You’re in good company
        </h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          We’ve built and optimized sites for service businesses across Canada—
          from excavating and trucking to senior safety and local trades. Add
          your logo here.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/1] rounded-xl border border-[#BFBFBF]/20 bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
