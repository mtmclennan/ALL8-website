import React from 'react';
import type { Metadata } from 'next';
import { SERVICES } from '@/data/services';
import { ServiceCard } from './components/ServiceCard';

import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/page-meta';

export const metadata: Metadata = buildStaticMetadata('/services');

validateMetadata(metadata.title, metadata.description);

export default function ServicesPage() {
  return (
    <main className="relative">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,118,255,0.10),transparent_70%)]" />

      <section className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <header className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Services
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            One goal per page. Clean layouts, fast loads, and clear calls to
            action. Choose what you need now—scale later.
          </p>
        </header>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-silver/40 bg-white/70 p-6">
          <div>
            <h2 className="text-2xl font-semibold">Not sure where to start?</h2>
            <p className="text-gray-700">
              Book a 20‑minute call. We’ll map your quickest path to more leads.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-white font-medium"
          >
            Book a discovery call
          </a>
        </div>
      </section>
    </main>
  );
}
