import React from 'react';

export function ProcessSteps() {
  return (
    <section className="bg-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">How we work</h2>
        <ol className="mt-8 grid list-decimal gap-6 pl-6 md:grid-cols-3 md:pl-8">
          <Step title="Discovery">
            45‑minute call to map goals, audience, and the one job each page
            must do.
          </Step>
          <Step title="Blueprint">
            Sitemap, wireframes, conversion paths, tracking plan. No mystery,
            just a clear build plan.
          </Step>
          <Step title="Build & launch">
            Accessibility and performance checks, SEO basics set, and a clean
            handoff with docs.
          </Step>
        </ol>
      </div>
    </section>
  );
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-[#BFBFBF]/20 bg-white/5 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-300">{children}</p>
    </li>
  );
}
