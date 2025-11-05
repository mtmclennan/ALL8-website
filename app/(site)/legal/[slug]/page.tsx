import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import { replacePlaceholders } from '@/lib/utils/replacePlaceholders';
import { legalVars } from '@/config/legal.config';

// ---------------- Types ----------------
interface LegalPage {
  slug: string;
  title: string;
  jurisdiction: string;
  version: string;
  body: string;
  lastUpdatedISO: string;
}

// ---------------- Data helpers ----------------
const legalPath = path.join(process.cwd(), 'data/legal.json');

function getAllLegalPages(): LegalPage[] {
  const file = fs.readFileSync(legalPath, 'utf8');
  return JSON.parse(file) as LegalPage[];
}

function getLegalPage(slug: string): LegalPage | undefined {
  return getAllLegalPages().find((page) => page.slug === slug);
}

// ---------------- Static generation ----------------
export async function generateStaticParams() {
  const pages = getAllLegalPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return {
    title: `${page.title} • ${legalVars.companyName}`,
    description: `${page.title} information for ${legalVars.companyName}.`,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${page.title} | ${legalVars.companyName}`,
      description: `Legal details and terms for ${legalVars.companyName}.`,
      url: `${legalVars.websiteUrl}/legal/${slug}`,
      type: 'article',
    },
  };
}

// ---------------- Page component ----------------
export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  const body = replacePlaceholders(page.body);

  return (
    <main className="relative mx-auto max-w-4xl px-6 py-20 text-gray-300">
      {/* blueprint-style faint glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#0076ff0a,transparent_60%)]" />

      <header className="mb-10 relative text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 tracking-tight drop-shadow-[0_0_10px_rgba(0,118,255,0.3)]">
          {page.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Version {page.version} • Jurisdiction: {page.jurisdiction}
        </p>
      </header>

      <article
        className="
          prose prose-invert prose-headings:text-gray-100
          prose-p:text-gray-100 prose-strong:text-gray-100
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          prose-ul:list-disc prose-li:marker:text-blue-500
          max-w-none leading-relaxed [&>p]:mb-8 [&>h2]:mb-1 [&>h2]:text-lg [&>h2]:text-blue-300 
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </article>

      <footer className="mt-16 border-t border-slate-700/60 pt-4 text-center text-sm text-gray-500">
        Last updated: {new Date(page.lastUpdatedISO).toLocaleDateString()}{' '}
        <br />© {new Date().getFullYear()} {legalVars.companyName}. All rights
        reserved.
      </footer>
    </main>
  );
}
