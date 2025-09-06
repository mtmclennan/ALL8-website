import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { safeText } from '@/lib/utils/safe';
import { Metadata } from 'next';
import { validateMetadata } from '@/lib/utils/seoValidation';
import { buildStaticMetadata } from '@/lib/utils/page-meta';

const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal');
export const metadata: Metadata = buildStaticMetadata('/legal');

validateMetadata(metadata.title, metadata.description);

export default async function LegalIndex() {
  const files = (await fs.readdir(LEGAL_DIR)).filter((f) => f.endsWith('.mdx'));
  const items = await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(LEGAL_DIR, f), 'utf8');
      const { data } = matter(raw);
      const slug = f.replace(/\.mdx$/, '');
      return {
        slug,
        title: safeText(data.title) ?? slug,
        version: safeText(data.version) ?? '',
      };
    })
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Legal</h1>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.slug}>
            <a
              className="text-blue-600 hover:underline"
              href={`/legal/${it.slug}`}
            >
              {it.title}
            </a>
            {it.version && (
              <span className="ml-2 text-xs text-gray-500">v{it.version}</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
