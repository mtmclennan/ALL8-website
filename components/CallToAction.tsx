// import { Link } from '@heroui/link';
// import { button as buttonStyles } from '@heroui/theme';

// export default function CallToAction() {
//   return (
//     <section className="bg-primary text-white py-16 px-6">
//       <div className="max-w-4xl mx-auto text-center space-y-6">
//         <h2 className="text-3xl md:text-4xl font-bold">
//           Ready to Get Started?
//         </h2>
//         <p className="text-lg text-white/90">
//           Get in touch with us today for a free estimate on your excavation
//           project. We’re here to help you bring your vision to life!
//         </p>
//         <Link
//           className={buttonStyles({
//             color: 'secondary',
//             size: 'lg',
//             radius: 'sm',
//             variant: 'shadow',
//           })}
//           href="/contact"
//         >
//           Start Your Project Today
//         </Link>
//       </div>
//     </section>
//   );
// }

'use client';

import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Link from 'next/link';
import { PhoneCall, CalendarCheck, ArrowRight } from 'lucide-react';
import { Section, SectionHeader, Card } from './SectionWrapper'; // adjust the import path

const BRAND_PRIMARY = '#0047bb'; // Royal Blue
const BRAND_ACCENT = '#D33F49'; // Assure Red

export default function StrongCTA() {
  return (
    <Section
      tone="highlight"
      pattern="none"
      className="relative overflow-hidden"
    >
      {/* background flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(1200px 600px at 10% -20%, ${BRAND_PRIMARY}22, transparent 70%),` +
            `radial-gradient(900px 400px at 110% 0%, ${BRAND_ACCENT}22, transparent 60%)`,
        }}
      />

      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionHeader
            title="Ready to Grow Your Business?"
            subtitle="Get a free consultation. We'll audit your site, outline a plan, and give you clear next steps—no pressure."
            center
          />

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`,
              }}
            >
              <PhoneCall className="h-4 w-4" />
              Get a Quote
            </Link>
            {/* If you use Calendly or similar, point this to your scheduling link */}
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a Free Call
            </Link>
          </div>

          {/* Micro-trust row */}
          <div className="mt-5 text-xs text-white/80">
            No long contracts • Transparent pricing • Built for speed &
            conversions
          </div>
        </m.div>
      </LazyMotion>
    </Section>
  );
}
