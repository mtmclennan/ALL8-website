import * as React from 'react';
import Card from './AboutCard';

export function WhyAll8() {
  return (
    <section className="bg-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">Why ALL8</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card title="Results, not fluff">
            Clear value props, fast pages, clean funnels. Every page has one job
            and is measured against it.
          </Card>
          <Card title="Local SEO baked in">
            Schema, Google Business Profile, location pages, review strategy—
            the essentials to show up where customers buy.
          </Card>
          <Card title="Ownable & maintainable">
            Modern Next.js stack, clean components, and docs. Launch fast,
            iterate without drama.
          </Card>
        </div>
      </div>
    </section>
  );
}
