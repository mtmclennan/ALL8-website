'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  LazyMotion,
  domAnimation,
  motion,
  useReducedMotion,
} from 'framer-motion';

import {
  Section,
  SectionHeader,
  Card,
  ButtonGradientWrapper,
} from '../SectionWrapper';

import {
  Wrench,
  Wind,
  Zap,
  Shovel,
  Leaf,
  HardHat,
  Home,
  Hammer,
  Paintbrush,
  Fence,
  DoorOpen,
  ArrowRight,
} from 'lucide-react';

export type TradeItem = {
  label: string;
  href?: string;
  icon?: string; // "wrench" | "wind" | "zap" ... (case-insensitive)
};

export type BuiltForContractorsData = {
  title: string;
  subtitle?: string;
  body?: string;
  tradesTitle?: string;
  trades: TradeItem[];
  note?: string;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: Wrench,
  wind: Wind,
  zap: Zap,
  shovel: Shovel,
  leaf: Leaf,
  hardhat: HardHat,
  home: Home,
  hammer: Hammer,
  paintbrush: Paintbrush,
  fence: Fence,
  dooropen: DoorOpen,
};

type Props = {
  data: BuiltForContractorsData;

  /** Section styling */
  tone?: React.ComponentProps<typeof Section>['tone'];
  pattern?: React.ComponentProps<typeof Section>['pattern'];

  /** Layout */
  columns?: 2 | 3; // desktop columns on lg+
  className?: string;

  /** Motion/visual options */
  hoverLift?: boolean; // default true
  hoverTilt?: boolean; // default true (like Process)
  showUnderline?: boolean; // default true
  showArrow?: boolean; // default true

  /** Card styles */
  wrapperCardVariant?: React.ComponentProps<typeof Card>['variant']; // default elevated
  tradeCardVariant?: React.ComponentProps<typeof Card>['variant']; // default elevated
};

export default function BuiltForContractors({
  data,
  tone = 'highlight',
  pattern = 'dots',
  columns = 2,
  className,

  hoverLift = true,
  hoverTilt = true,
  showArrow = true,

  wrapperCardVariant = 'elevated',
  tradeCardVariant = 'elevated',
}: Props) {
  const prefersReduced = useReducedMotion();

  const gridColsLg = columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <Section tone={tone} pattern={pattern} className={clsx(className)}>
      <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch">
        {/* Left */}
        <div className="lg:col-span-5">
          <Card variant="elevated" className="h-full">
            <div className="rounded-2xl border border-foreground/10 bg-background/70 p-8 backdrop-blur-sm sm:p-10 lg:p-12">
              <SectionHeader
                title={data.title}
                subtitle={data.subtitle}
                className="sm:text-5xl "
              />

              {data.body && (
                <p className="mt-4 text-base text-foreground/70">{data.body}</p>
              )}

              {/* Accent divider (subtle visual anchor) */}
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-[var(--from,_#0047bb)] to-[var(--to,_#D33F49)]" />

              {/* CTA Row */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonGradientWrapper>
                  <Link
                    href="/performance-tune-up"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-background text-foreground font-medium ring-1 ring-divider hover:bg-content1 transition"
                  >
                    Get a Free Performance Review
                  </Link>
                </ButtonGradientWrapper>

                <Link
                  href="/services"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition"
                >
                  View Services →
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="lg:col-span-7">
          <Card
            variant={wrapperCardVariant}
            className="group-hover:shadow-lg h-full"
          >
            <div className="h-full rounded-2xl border border-foreground/10 bg-background/70 p-6 backdrop-blur-sm sm:p-8">
              {data.tradesTitle && (
                <h3 className="text-lg font-semibold tracking-tight ">
                  {data.tradesTitle}
                </h3>
              )}

              <LazyMotion features={domAnimation}>
                <motion.ul
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                  className={clsx(
                    'mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2',
                    gridColsLg,
                  )}
                >
                  {data.trades.map((t) => {
                    const iconKey = (t.icon ?? '').toLowerCase().trim();
                    const Icon = ICONS[iconKey] ?? Wrench;
                    const href = t.href?.trim() || '/services';

                    const motionHover: Record<string, any> = {};
                    if (!prefersReduced) {
                      if (hoverLift) motionHover.y = -4;
                      if (hoverTilt) {
                        motionHover.rotateX = -2;
                        motionHover.rotateY = 2;
                        motionHover.z = 0;
                      }
                    }

                    return (
                      <motion.li
                        key={t.label}
                        variants={{
                          hidden: prefersReduced
                            ? { opacity: 0 }
                            : { opacity: 0, y: 18 },
                          show: prefersReduced
                            ? { opacity: 1 }
                            : {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.45 },
                              },
                        }}
                        whileHover={prefersReduced ? {} : motionHover}
                        className="group/trade relative"
                      >
                        <Link
                          href={href}
                          className={clsx(
                            'block h-full rounded-2xl',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047BB]',
                          )}
                        >
                          <Card
                            variant={tradeCardVariant}
                            className="h-full transition-all duration-300"
                          >
                            <div
                              className={clsx(
                                'rounded-2xl border border-foreground/10 bg-background/70',
                                'p-5 backdrop-blur-sm',
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {/* Icon badge - matches Process */}
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-[radial-gradient(60%_60%_at_50%_40%,#0047bb22,transparent),linear-gradient(180deg,#0047bb15,transparent)]">
                                  <Icon className="h-5 w-5 text-primary" />
                                </span>

                                <div className="flex flex-1 items-center justify-between gap-3">
                                  <h4 className="truncate text-base font-semibold leading-tight">
                                    {t.label}
                                  </h4>

                                  {showArrow && (
                                    <ArrowRight className="h-4 w-4 opacity-50 transition group-hover/trade:opacity-100" />
                                  )}
                                </div>
                              </div>

                              {/* Hover underline - optional
                              {showUnderline && (
                                <div className="mt-2 h-px w-0 bg-gradient-to-r from-[var(--from,_#0047bb)] to-[var(--to,_#D33F49)] transition-all duration-300 group-hover/trade:w-full" />
                              )} */}
                            </div>
                          </Card>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </LazyMotion>

              {data.note && (
                <p className="mt-6 text-sm text-foreground/60">{data.note}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
