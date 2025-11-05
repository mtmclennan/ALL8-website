'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface LegalPageMeta {
  slug: string;
  title: string;
  version: string;
  jurisdiction: string;
}

interface LegalPageProps {
  pages: LegalPageMeta[];
  companyName: string;
}

export default function LegalPage({ pages, companyName }: LegalPageProps) {
  return (
    <main className="relative mx-auto max-w-4xl px-6 py-20 text-gray-300">
      {/* blueprint-like glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#0076ff0a,transparent_60%)]" />

      <header className="text-center mb-14 relative">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-bold text-blue-400 tracking-tight drop-shadow-[0_0_10px_rgba(0,118,255,0.4)]"
        >
          Legal Information
        </motion.h1>
        <p className="mt-4 text-gray-400 text-base max-w-2xl mx-auto">
          Official legal policies and documents for{' '}
          <span className="font-medium text-gray-200">{companyName}</span>. Stay
          informed about how we handle your data and operate transparently.
        </p>
      </header>

      <ul className="space-y-4 relative">
        {pages.map((page, i) => (
          <motion.li
            key={page.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-slate-700/70 bg-charcoal/40 backdrop-blur-sm hover:bg-charcoal/60 hover:border-blue-500/50 transition-colors p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <Link
                  href={`/legal/${page.slug}`}
                  className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 hover:underline"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  Jurisdiction: {page.jurisdiction}
                </p>
              </div>
              <p className="text-sm text-gray-500">v{page.version}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
