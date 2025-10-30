// // components/SectionWrapper.tsx
// 'use client';
// import React from 'react';
// import clsx from 'clsx';

// export type SectionProps = React.PropsWithChildren<{
//   tone?:
//     | 'base'
//     | 'alt'
//     | 'dim'
//     | 'highlight'
//     | 'alert'
//     | 'callout'
//     | 'gradient';
//   pattern?: 'none' | 'grid' | 'dots' | 'waves' | 'blueprint' | 'rays';

//   className?: string;
// }>;

// const basePad = 'py-16 sm:py-20';
// const container = 'relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

// /* --- background tone layers --- */
// const tones = {
//   base: 'bg-background',
//   alt: 'bg-content1',
//   dim: 'bg-content2',
//   highlight:
//     'bg-gradient-to-br from-[#0047BB0d] via-transparent to-[#6E56CF0d]',
//   alert: 'relative overflow-hidden bg-[#111]', // uses .alert-overlay
//   callout: 'bg-background overflow-hidden', // uses .callout-overlay
//   gradient: 'tone-gradient',
// } as const;

// /* --- decorative pattern layers --- */
// const patterns = {
//   none: '',
//   grid:
//     "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
//     'before:bg-[linear-gradient(transparent_23px,_#ffffff0a_24px),linear-gradient(90deg,transparent_23px,#ffffff0a_24px)] ' +
//     'before:bg-[length:24px_24px]',
//   dots:
//     "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
//     'before:bg-[radial-gradient(circle_1px,_#ffffff14_1px,transparent_1.5px)] before:bg-[length:18px_18px]',
//   waves: 'relative before:pointer-events-none pattern-waves',

//   blueprint:
//     "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
//     'before:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(89,186,224,.12),transparent_60%),' +
//     'linear-gradient(to_right,rgba(255,255,255,.10)_1px,transparent_1px),' +
//     'linear-gradient(to_bottom,rgba(255,255,255,.10)_1px,transparent_1px),' +
//     'linear-gradient(45deg,rgba(0,71,187,.10)_1px,transparent_1px),' +
//     'linear-gradient(-45deg,rgba(0,71,187,.10)_1px,transparent_1px)] ' +
//     'before:bg-[length:auto,_24px_24px,_24px_24px,_48px_48px,_48px_48px] ' +
//     'before:bg-[position:0_0,_0_0,_0_0,_0_0,_0_0]',
//   rays: 'relative before:pointer-events-none pattern-rays',
// } as const;

// /* --- component --- */
// export function Section({
//   tone = 'base',
//   pattern = 'none',
//   className = '',
//   children,
// }: SectionProps) {
//   const isAlert = tone === 'alert';

//   return (
//     <section
//       className={clsx(
//         basePad,
//         tones[tone],
//         patterns[pattern],
//         className,
//         'relative isolate'
//       )}
//     >
//       {/* ⚠️ the Tailwind utility overlay */}
//       {isAlert && (
//         <>
//           <div className="alert-overlay" />
//           <div className="absolute inset-0 z-0 alert-noise opacity-30" />
//           <div className="absolute inset-0 z-0 alert-glitch opacity-40" />
//         </>
//       )}

//       {/* content always sits above */}
//       <div className={container}>{children}</div>
//     </section>
//   );
// }
// /* ---------- Heading set ---------- */
// function renderBrandFont(text: string) {
//   // Split on 'ALL8' or 'ALL8 Webworks', case-insensitive
//   const parts = text.split(/(ALL8\s*Webworks|ALL8)/gi);

//   return parts.map((part, i) => {
//     const upper = part.toUpperCase().trim();

//     if (upper === 'ALL8 WEBWORKS') {
//       return (
//         <span key={i}>
//           <span className="font-display tracking-tight text-foreground">
//             ALL8
//           </span>{' '}
//           <span className="font-body font-light text-brand-blue">Webworks</span>
//         </span>
//       );
//     }

//     if (upper === 'ALL8') {
//       return (
//         <span key={i} className="font-display tracking-tight text-foreground">
//           {part}
//         </span>
//       );
//     }

//     return part;
//   });
// }

// export function SectionHeader({
//   title,
//   subtitle,
//   center = false,
//   className = '',
// }: {
//   title: string | React.ReactNode;
//   subtitle?: string;
//   center?: boolean;
//   className?: string;
// }) {
//   const renderContent = (input: string | React.ReactNode) => {
//     if (typeof input === 'string') return renderBrandFont(input);
//     return input;
//   };

//   return (
//     <div className={clsx('mb-12', center && 'text-center')}>
//       <h2
//         className={clsx(
//           'text-4xl font-semibold tracking-tight sm:text-6xl',
//           className
//         )}
//       >
//         {renderContent(title)}
//       </h2>
//       {subtitle && (
//         <p
//           className={clsx(
//             'mt-3 max-w-2xl text text-foreground/70',
//             center && 'mx-auto'
//           )}
//         >
//           {renderContent(subtitle)}
//         </p>
//       )}
//     </div>
//   );
// }

// /* ---------- IconBadge ---------- */
// export function IconBadge({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03]">
//       {children}
//     </span>
//   );
// }
// /* ---------- Card ---------- */
// export function Card({
//   children,
//   className = '',
//   variant = 'glass' as const,
// }: React.PropsWithChildren<{
//   className?: string;
//   variant?: 'plain' | 'glass' | 'bordered' | 'elevated';
// }>) {
//   const base = 'rounded-2xl transition-all duration-300';

//   const styles = {
//     // Solid surface that stands off the page
//     plain: 'bg-content1 ring-1 ring-divider',

//     // Frosted surface: slight translucency + blur + ring
//     glass:
//       'bg-content1/70 ring-1 ring-divider supports-[backdrop-filter]:backdrop-blur-md',

//     // Outer gradient ring, inner frosted panel (on-brand chrome vibe)
//     bordered:
//       'p-[2px] bg-gradient-to-br from-[#59BAE066] via-[#0047BB66] to-[#D0000066]',

//     // Elevated with a shadow that actually shows on dark
//     elevated:
//       'bg-content1 ring-1 ring-divider shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_70px_rgba(0,0,0,0.55)]',
//   } as const;

//   if (variant === 'bordered') {
//     return (
//       <div className={clsx(base, styles.bordered, className)}>
//         <div className="rounded-2xl bg-background ring-1 ring-divider supports-[backdrop-filter]:backdrop-blur-md">
//           {children}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={clsx(base, styles[variant], className)}>{children}</div>
//   );
// }

// /* ---------- Divider ---------- */
// export function SectionDivider() {
//   return <div className="h-px w-full bg-divider" />;
// }

// export function ButtonGradientWrapper({
//   children,
//   className,
// }: React.PropsWithChildren<{ className?: string }>) {
//   return (
//     <div
//       className={clsx(
//         'inline-block p-[2px] rounded-xl bg-gradient-to-br',
//         'from-[#59BAE066] via-[#0047BB66] to-[#D0000066]',
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// }

'use client';
import React from 'react';
import clsx from 'clsx';

export type SectionProps = React.PropsWithChildren<{
  tone?:
    | 'base'
    | 'alt'
    | 'dim'
    | 'highlight'
    | 'alert'
    | 'callout'
    | 'gradient';
  pattern?: 'none' | 'grid' | 'dots' | 'blueprint';
  className?: string;
}>;

const basePad = 'py-16 sm:py-20';
const container = 'relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

/* --- background tone layers --- */
const tones = {
  base: 'bg-background',
  alt: 'bg-content1',
  dim: 'bg-content2',
  highlight:
    'bg-gradient-to-br from-[#0047BB0d] via-transparent to-[#6E56CF0d]',
  alert: 'relative overflow-hidden bg-[#111]',
  callout: 'bg-background overflow-hidden',
  gradient:
    'relative overflow-hidden isolate bg-gradient-to-br from-[#0047bb0f] via-transparent to-[#d000000f]',
} as const;

/* --- simplified pattern layers --- */
const patterns = {
  none: '',
  grid:
    "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
    'before:bg-[linear-gradient(transparent_23px,_#ffffff0a_24px),linear-gradient(90deg,transparent_23px,#ffffff0a_24px)] ' +
    'before:bg-[length:24px_24px]',
  dots:
    "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
    'before:bg-[radial-gradient(circle_1px,_#ffffff14_1px,transparent_1.5px)] before:bg-[length:18px_18px]',
  blueprint:
    "relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:pointer-events-none " +
    'before:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(89,186,224,.15),transparent_60%),' +
    'linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),' +
    'linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] ' +
    'before:bg-[length:auto,_24px_24px,_24px_24px] before:mix-blend-overlay',
} as const;

export function Section({
  tone = 'base',
  pattern = 'none',
  className = '',
  children,
}: SectionProps) {
  const isAlert = tone === 'alert';

  return (
    <section
      className={clsx(
        basePad,
        tones[tone],
        patterns[pattern],
        'relative isolate',
        className
      )}
    >
      {/* alert visual overlay (self-contained now) */}
      {isAlert && (
        <>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(208,0,0,0.25),transparent_70%)] opacity-30" />
          <div className="absolute inset-0 z-0 bg-[repeating-linear-gradient(45deg,rgba(208,0,0,0.08)_0_12px,transparent_12px_24px)] opacity-20" />
        </>
      )}
      <div className={container}>{children}</div>
    </section>
  );
}

/* ---------- Heading set ---------- */
function renderBrandFont(text: string) {
  const parts = text.split(/(ALL8\s*Webworks|ALL8)/gi);
  return parts.map((part, i) => {
    const upper = part.toUpperCase().trim();
    if (upper === 'ALL8 WEBWORKS') {
      return (
        <span key={i}>
          <span className="font-display tracking-tight text-foreground">
            ALL8
          </span>{' '}
          <span className="font-body font-light text-brand-blue">Webworks</span>
        </span>
      );
    }
    if (upper === 'ALL8') {
      return (
        <span key={i} className="font-display tracking-tight text-foreground">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function SectionHeader({
  title,
  subtitle,
  center = false,
  className = '',
}: {
  title: string | React.ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  const renderContent = (input: string | React.ReactNode) => {
    if (typeof input === 'string') return renderBrandFont(input);
    return input;
  };

  return (
    <div className={clsx('mb-12', center && 'text-center')}>
      <h2
        className={clsx(
          'text-4xl font-semibold tracking-tight sm:text-6xl',
          className
        )}
      >
        {renderContent(title)}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'mt-3 max-w-2xl text text-foreground/70',
            center && 'mx-auto'
          )}
        >
          {renderContent(subtitle)}
        </p>
      )}
    </div>
  );
}

/* ---------- IconBadge ---------- */
export function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03]">
      {children}
    </span>
  );
}

/* ---------- Card ---------- */
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
    plain: 'bg-content1 ring-1 ring-divider',
    glass:
      'bg-content1/70 ring-1 ring-divider supports-[backdrop-filter]:backdrop-blur-md',
    bordered:
      'p-[2px] bg-gradient-to-br from-[#59BAE066] via-[#0047BB66] to-[#D0000066]',
    elevated:
      'bg-content1 ring-1 ring-divider shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_70px_rgba(0,0,0,0.55)]',
  } as const;

  if (variant === 'bordered') {
    return (
      <div className={clsx(base, styles.bordered, className)}>
        <div className="rounded-2xl bg-background ring-1 ring-divider supports-[backdrop-filter]:backdrop-blur-md">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(base, styles[variant], className)}>{children}</div>
  );
}

/* ---------- Divider ---------- */
export function SectionDivider() {
  return <div className="h-px w-full bg-divider" />;
}

/* ---------- Gradient Button Wrapper ---------- */
export function ButtonGradientWrapper({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'inline-flex shrink-0 rounded-xl p-[2px]',
        'bg-gradient-to-br from-[#59BAE066] via-[#0047BB66] to-[#D0000066]',
        'w-fit', // keeps it tight around the child
        className
      )}
    >
      {children}
    </div>
  );
}
