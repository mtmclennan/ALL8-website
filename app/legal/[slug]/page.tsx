import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { compileMDX } from 'next-mdx-remote/rsc';
import { legalVars } from '@/config/legal.config';
import ClientMDX from '../../../components/ClientMDX';

const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal');

function injectTokens(md: string) {
  return md.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const k = key.trim();
    try {
      // eslint-disable-next-line no-new-func
      const val = new Function('vars', `with(vars){ return ${k}; }`)(legalVars);
      return (val ?? '').toString();
    } catch {
      return (legalVars as any)[k] ?? '';
    }
  });
}

export async function generateStaticParams() {
  const files = await fs.readdir(LEGAL_DIR);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = await fs.readFile(path.join(LEGAL_DIR, `${slug}.mdx`), 'utf8');
  const { data } = matter(raw);
  const title = data.title
    ? `${data.title} • ${legalVars.companyName}`
    : `${slug} • ${legalVars.companyName}`;
  return {
    title,
    description: `${data.title ?? slug} for ${legalVars.companyName}`,
    alternates: { canonical: `${legalVars.websiteUrl}/legal/${slug}` },
    openGraph: { title, type: 'article' },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(LEGAL_DIR, `${slug}.mdx`);
  const file = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(file);
  const hydrated = injectTokens(content);

  // ✅ Compile to a serialized object (no React element mismatch)
  const { content: MDX } = await compileMDX({
    source: hydrated,
    options: { parseFrontmatter: false },
    components: {}, // add shortcodes here if you make any
  });
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">
        {String(data.title ?? 'Legal')}
      </h1>
      <article className="prose prose-slate max-w-none">{MDX}</article>
      <footer className="mt-12 text-sm text-gray-500">
        Version: {String(data.version ?? '–')} • Jurisdiction:{' '}
        {String(data.jurisdiction ?? '–')}
        <br />
        Last updated: {String(legalVars.lastUpdatedISO)}
      </footer>
    </main>
  );
}
