'use client';

import React from 'react';
import { LazyMotion, domAnimation, motion } from 'framer-motion';
import { Building2, ShieldCheck, LineChart, Gauge, Quote } from 'lucide-react';
import {
  Section,
  SectionHeader,
  Card,
  IconBadge,
} from '../components/SectionWrapper'; // adjust path

const BRAND_PRIMARY = '#0047bb';
const BRAND_ACCENT = '#D33F49';

// Mini case studies / example projects
const cases = [
  {
    title: 'Bellhouse Excavating',
    tag: 'Example Project',
    icon: Building2,
    challenge:
      'Needed credibility and visibility to compete with larger contractors.',
    solution:
      'Custom, fast site with local SEO foundations and clear service CTAs.',
    result:
      'Professional online presence, ad‑ready structure, positioned to win more jobs.',
  },
  {
    title: 'Assure Alert (WordPress)',
    tag: 'Optimization on Existing Stack',
    icon: ShieldCheck,
    challenge: 'Existing WordPress with heavy plugins and slow pages.',
    solution:
      'Caching/CDN, image compression, plugin audit, schema, on‑page SEO.',
    result:
      'Noticeably faster loads and a cleaner admin, with a path to headless later.',
  },
  {
    title: 'EdgeInMind (Content Platform)',
    tag: 'Content & SEO',
    icon: LineChart,
    challenge: 'Publish fast, rank well, and capture leads.',
    solution:
      'Performance‑focused blog framework, SEO structure, and analytics.',
    result: 'Ready‑to‑scale content with clear CTAs and tracking.',
  },
] as const;

export default function SocialProofSection() {
  return (
    <Section tone="dim" pattern="dots">
      <SectionHeader
        title="See the Results We Deliver"
        subtitle="From custom builds to optimized WordPress sites, we focus on speed, SEO, and conversions."
        center
      />

      <LazyMotion features={domAnimation}>
        {/* Cases grid */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <motion.li
                key={c.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card variant="plain" className="group">
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <IconBadge>
                        <Icon className="h-5 w-5" />
                      </IconBadge>
                      <div className="flex flex-col">
                        <h3 className="text-base font-semibold leading-tight">
                          {c.title}
                        </h3>
                        <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/60">
                          {c.tag}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Challenge:</span>{' '}
                        {c.challenge}
                      </li>
                      <li>
                        <span className="font-medium">Solution:</span>{' '}
                        {c.solution}
                      </li>
                      <li>
                        <span className="font-medium">Result:</span> {c.result}
                      </li>
                    </ul>

                    {/* Accent underline on hover */}
                    <div
                      className="mt-4 h-px w-0 bg-gradient-to-r from-[var(--from,_transparent)] to-[var(--to,_transparent)] transition-all duration-300 group-hover:w-full"
                      style={{
                        ['--from' as any]: `${BRAND_PRIMARY}`,
                        ['--to' as any]: `${BRAND_ACCENT}`,
                      }}
                    />
                  </div>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Performance proof & testimonial placeholder */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Performance card */}
          <Card variant="plain" className="lg:col-span-2">
            <div className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <IconBadge>
                  <Gauge className="h-5 w-5" />
                </IconBadge>
                <h3 className="text-base font-semibold leading-tight">
                  Performance Where It Matters
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric
                  label="PageSpeed"
                  value=">95"
                  note="Typical on custom builds"
                />
                <Metric
                  label="Load Time"
                  value="< 2s"
                  note="On modern hosting/CDN"
                />
                <Metric
                  label="Core Web Vitals"
                  value="Pass"
                  note="Green across the board"
                />
                <Metric
                  label="Ads‑Ready"
                  value="Yes"
                  note="Tracking & structure baked in"
                />
              </div>
            </div>
          </Card>

          {/* Quote placeholder (swap when real testimonial available) */}
          <Card variant="plain" className="self-stretch">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-3 flex items-center gap-3">
                <IconBadge>
                  <Quote className="h-5 w-5" />
                </IconBadge>
                <h3 className="text-base font-semibold leading-tight">
                  What Clients Say
                </h3>
              </div>
              <p className="text-sm text-foreground/70 italic">
                “ALL8 rebuilt our site with performance and SEO in mind — it
                loads instantly and is ready for ads. We finally feel set up to
                grow.”
              </p>
              <div className="mt-3 text-xs text-foreground/60">
                — Add your first real quote here
              </div>
            </div>
          </Card>
        </div>

        {/* Tech & trust badges */}
        <div className="mt-10">
          <div className="text-center text-xs font-medium uppercase tracking-wide text-foreground/60 mb-3">
            Trusted tools & certifications
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'Next.js',
              'Node.js',
              'TailwindCSS',
              'WordPress Optimization',
              'Google Business Profile',
              'Google Ads‑Ready',
              'HubSpot Certified',
              '🇨🇦 Canadian‑Owned',
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs text-foreground/70"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </LazyMotion>
    </Section>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-4">
      <div className="text-xs uppercase tracking-wide text-foreground/60">
        {label}
      </div>
      <div className="text-xl font-semibold leading-tight">{value}</div>
      {note && <div className="text-xs text-foreground/60 mt-1">{note}</div>}
    </div>
  );
}
