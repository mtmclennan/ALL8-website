'use client';

import React from 'react';
import clsx from 'clsx';
import { Section } from '../SectionWrapper';
import { Gauge } from 'lucide-react';

export type WhyAll8StripItem = {
  label: string;
};

export type WhyAll8StripData = {
  kicker?: string;
  title: string;
  items: WhyAll8StripItem[];
};

export default function WhyAll8Strip({
  data,
  className,
}: {
  data: WhyAll8StripData;
  className?: string;
}) {
  return (
    <Section tone="base" className={clsx('py-16 sm:py-20 lg:py-24', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-center sm:text-left">
          <span className="inline-flex h-14 w-14 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border border-foreground/10 bg-[radial-gradient(60%_60%_at_50%_40%,#0047bb22,transparent),linear-gradient(180deg,#0047bb15,transparent)]">
            <Gauge className="h-7 w-7 sm:h-14 sm:w-14 text-primary" />
          </span>

          <div>
            {data.kicker && (
              <p className="text-sm font-medium text-foreground/60">
                {data.kicker}
              </p>
            )}
            <h3 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Pills */}
        <ul className="mt-12 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item) => (
            <li key={item.label}>
              <p className="text-xl sm:text-2xl font-semibold tracking-tight">
                {item.label}
              </p>
              <div className="mt-3 h-px w-16 mx-auto bg-gradient-to-r from-[#0047BB] to-[#D33F49]" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
