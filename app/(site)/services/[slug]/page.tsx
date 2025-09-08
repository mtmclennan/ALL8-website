import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug, SERVICES } from '@/data/services';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { getIconByName } from '@/lib/icons';
import FAQClient from './FAQClient';

type Params = { slug: string };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Service | ALL8 Webworks' };
  return {
    title: service.seo?.title ?? `${service.title} | ALL8 Webworks`,
    description: service.seo?.description ?? service.short,
    openGraph: {
      title: service.seo?.title ?? service.title,
      description: service.seo?.description ?? service.short,
      type: 'article',
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return notFound();
  const Icon = getIconByName(service.icon);

  return (
    <main className="relative">
      {/* BG */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(0,118,255,0.08),transparent_70%)]" />

      <section className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-silver/40 bg-white/70 px-3 py-1">
            <Icon className="size-4" />
            <span className="text-sm text-gray-700">{service.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-gray-700">{service.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.priceFrom && (
              <Chip color="primary" variant="flat">
                From {service.priceFrom}
              </Chip>
            )}
          </div>
          <div className="mt-6">
            <Button color="primary" radius="lg">
              <a href={`/contact?service=${encodeURIComponent(service.title)}`}>
                {service.ctaLabel ?? 'Get started'}
              </a>
            </Button>
          </div>
        </header>

        {/* Benefits & Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-silver/40 bg-white/70 p-6">
            <h2 className="text-2xl font-semibold">Benefits</h2>
            <ul className="mt-4 space-y-3">
              {service.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-silver/40 bg-white/70 p-6">
            <h2 className="text-2xl font-semibold">What’s Included</h2>
            <ul className="mt-4 space-y-3">
              {service.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 inline-block size-1.5 rounded-full bg-charcoal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mt-12 rounded-2xl border border-silver/40 bg-white/70 p-6">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <FAQClient items={service.faqs} />
          </div>
        )}

        {/* Final CTA */}
        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-silver/40 bg-white/70 p-6">
          <div>
            <h3 className="text-xl font-semibold">Ready to move forward?</h3>
            <p className="text-gray-700">
              Tell us about your project and we’ll send a fast, clear proposal.
            </p>
          </div>
          <Button color="primary" radius="lg">
            <a href={`/contact?service=${encodeURIComponent(service.title)}`}>
              Request proposal
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
