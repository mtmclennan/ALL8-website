'use client';

import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  Zap,
  Search,
  Smartphone,
  Target,
  Rocket,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

// Shared primitives
import { Section, SectionHeader, Card, IconBadge } from './SectionWrapper'; // adjust path

const BRAND_PRIMARY = '#0047bb'; // Royal Blue
const BRAND_ACCENT = '#D33F49'; // Assure Red

const benefits = [
  {
    title: 'Speed That Sells',
    description:
      'We fine‑tune your site like a high‑performance engine — clean, optimized code that loads in under 2 seconds, keeping visitors engaged long enough to convert.',
    Icon: Zap,
  },
  {
    title: 'Found on Google from Day One',
    description:
      'SEO is baked into the foundation — from meta tags and schema to Google Business optimization — so you start climbing search rankings immediately.',
    Icon: Search,
  },
  {
    title: 'Mobile‑First Design',
    description:
      'Over 60% of your traffic is mobile. We design for phones first, ensuring your site looks and works flawlessly anywhere.',
    Icon: Smartphone,
  },
  {
    title: 'Built to Convert Visitors into Customers',
    description:
      'Strategic layouts, clear calls‑to‑action, and lead capture forms turn browsers into buyers — whether they’re booking a service or making a purchase.',
    Icon: Target,
  },
  {
    title: 'Ad‑Ready from the Start',
    description:
      'We structure your site for Google Ads and tracking from day one — so campaigns can be launched quickly without costly redesigns.',
    Icon: Rocket,
  },
  {
    title: 'Scalable, Custom Technology',
    description:
      'We use modern, scalable tech (Next.js, Node, TypeScript) so your site adapts as your business expands.',
    Icon: Layers,
  },
  {
    title: 'Hassle‑Free Hosting & Maintenance',
    description:
      'Secure hosting, daily backups, uptime monitoring, and ongoing updates keep your site running smoothly.',
    Icon: ShieldCheck,
  },
] as const;

export default function WhyWorkWithUsSection() {
  return (
    <Section tone="base" pattern="grid">
      <SectionHeader
        title="How Our Websites Help Your Business Grow"
        subtitle="We don’t just build websites — we build revenue machines that work 24/7."
        center
      />

      <LazyMotion features={domAnimation}>
        <m.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20%' }}
          variants={{
            hidden: { opacity: 1 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.06 },
            },
          }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((b) => {
            const Icon = b.Icon;
            return (
              <m.li
                key={b.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group"
              >
                <Card variant="glass" className="hover:border-foreground/20">
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <IconBadge>
                        <Icon className="h-5 w-5" />
                      </IconBadge>
                      <h3 className="text-base font-semibold leading-tight">
                        {b.title}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/70">
                      {b.description}
                    </p>

                    {/* Underline accent on hover */}
                    <div
                      className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_transparent)] to-[var(--to,_transparent)] transition-all duration-300 group-hover:w-full"
                      style={{
                        ['--from' as any]: `${BRAND_PRIMARY}`,
                        ['--to' as any]: `${BRAND_ACCENT}`,
                      }}
                    />
                  </div>
                </Card>
              </m.li>
            );
          })}
        </m.ul>
      </LazyMotion>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`,
          }}
        >
          Get Your Free Consultation
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </Section>
  );
}
