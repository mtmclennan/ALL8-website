import React from 'react';

/**
 * Section System for ALL8
 * - Cohesive look via shared spacing/width/typography
 * - Visual variety via tone + pattern props
 * - Reusable Card and IconBadge primitives
 */

export type SectionProps = React.PropsWithChildren<{
  tone?: 'base' | 'alt' | 'dim' | 'highlight';
  pattern?: 'none' | 'grid' | 'dots' | 'waves' | 'blueprint';
  className?: string;
}>;

const basePad = 'py-16 sm:py-20';
const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

export function Section({
  tone = 'base',
  pattern = 'none',
  className = '',
  children,
}: SectionProps) {
  const toneClass =
    tone === 'base'
      ? 'bg-background'
      : tone === 'alt'
        ? 'bg-foreground/[0.02]'
        : tone === 'dim'
          ? 'bg-foreground/[0.04]'
          : 'bg-gradient-to-br from-[#0047bb0d] via-transparent to-[#D33F490d]'; // highlight

  const patternClass =
    pattern === 'grid'
      ? 'bg-[linear-gradient(transparent_23px,_#ffffff0a_24px),linear-gradient(90deg,transparent_23px,#ffffff0a_24px)] bg-[length:24px_24px]'
      : pattern === 'dots'
        ? 'bg-[radial-gradient(circle_1px,_#ffffff14_1px,transparent_1.5px)] bg-[length:18px_18px]'
        : pattern === 'waves'
          ? 'bg-[url(/waves.svg)] bg-[length:1200px_auto] bg-no-repeat bg-top'
          : pattern === 'blueprint'
            ? 'bg-[radial-gradient(#0047bb14_1px,transparent_1px)] bg-[length:14px_14px] backdrop-blur-[1px]'
            : '';

  return (
    <section className={`${basePad} ${toneClass} ${patternClass} ${className}`}>
      <div className={container}>{children}</div>
    </section>
  );
}

/**
 * Heading set — keep section titles consistent
 */
export function SectionHeader({
  title,
  subtitle,
  center = false,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm text-foreground/70 ${center ? 'mx-auto' : ''}">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * IconBadge — consistent icon container
 */
export function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03]">
      {children}
    </span>
  );
}

/**
 * Card primitive with variants
 */
export function Card({
  children,
  className = '',
  variant = 'glass' as const,
}: React.PropsWithChildren<{
  className?: string;
  variant?: 'plain' | 'glass' | 'bordered' | 'elevated';
}>) {
  const base = 'rounded-2xl transition-all duration-300';
  const styles = {
    plain: 'bg-background border border-foreground/10',
    glass: 'bg-background/70 border border-foreground/10 backdrop-blur-sm',
    bordered:
      'p-[1px] bg-gradient-to-br from-[#0047bb66] via-transparent to-[#D33F4966]',
    elevated: 'bg-background border border-foreground/10 shadow-lg',
  } as const;

  // bordered variant expects an inner wrapper
  if (variant === 'bordered') {
    return (
      <div className={`${base} ${styles.bordered} ${className}`}>
        <div className="rounded-2xl bg-background/70 backdrop-blur-sm border border-foreground/10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} ${styles[variant]} ${className}`}>{children}</div>
  );
}

/**
 * Divider between sections
 */
export function SectionDivider() {
  return <div className="h-px w-full bg-foreground/10" />;
}

/**
 * Example usage (remove in prod):
 *
 * <Section tone="alt" pattern="grid">
 *   <SectionHeader title="What We Can Do For You" subtitle="Services built to grow your business" center />
 *   <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">...
 * </div>
 * </Section>
 */
