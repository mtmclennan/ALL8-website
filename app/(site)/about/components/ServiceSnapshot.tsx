import React from 'react';
import Card from './AboutCard';

export function ServicesSnapshot() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">What we do</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card title="High‑performance sites">
            Next.js + Tailwind + HeroUI with Core Web Vitals and tracking set up
            from day one.
          </Card>
          <Card title="Lead funnels">
            Contact flows, quote forms, Calendly-style booking, and email
            handoff that actually gets answered.
          </Card>
          <Card title="Local SEO foundations">
            On‑page SEO, location pages, structured data, and GBP hygiene so you
            can rank and convert.
          </Card>
        </div>
      </div>
    </section>
  );
}
