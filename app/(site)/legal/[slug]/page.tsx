// import fs from 'fs';
// import path from 'path';
// import { notFound } from 'next/navigation';
// import ReactMarkdown from 'react-markdown';
// import type { Metadata } from 'next';
// import remarkGfm from 'remark-gfm';
// import { replacePlaceholders } from '@/lib/utils/replacePlaceholders';
// import { legalVars } from '@/config/legal.config';

// // Define the LegalPage type
// interface LegalPage {
//   slug: string;
//   title: string;
//   jurisdiction: string;
//   version: string;
//   body: string;
//   lastUpdatedISO: string;
// }

// // Absolute path to your JSON data
// const legalPath = path.join(process.cwd(), '/data/legal.json');

// // Helper to load all pages
// function getAllLegalPages(): LegalPage[] {
//   const file = fs.readFileSync(legalPath, 'utf8');
//   return JSON.parse(file) as LegalPage[];
// }

// // Helper to find a specific page by slug
// function getLegalPage(slug: string): LegalPage | undefined {
//   return getAllLegalPages().find((page) => page.slug === slug);
// }

// // --------- Static generation ---------

// export async function generateStaticParams() {
//   const pages = getAllLegalPages();
//   return pages.map((page) => ({ slug: page.slug }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   const page = getLegalPage(params.slug);
//   if (!page) notFound();

//   return {
//     title: `${page.title} • ${legalVars.companyName}`,
//     description: `${page.title} information for ${legalVars.companyName}.`,
//     robots: { index: false, follow: true },
//   };
// }

// // --------- Page component ---------

// export default function LegalPage({ params }: { params: { slug: string } }) {
//   const page = getLegalPage(params.slug);
//   if (!page) notFound();

//   // Replace placeholders using your helper
//   const body = replacePlaceholders(page.body);

//   return (
//     <main className="prose prose-neutral mx-auto max-w-3xl py-12 px-4">
//       <header className="mb-8">
//         <h1 className="text-4xl font-bold">{page.title}</h1>
//         <p className="text-sm text-gray-500">
//           Version {page.version} — Jurisdiction: {page.jurisdiction}
//         </p>
//       </header>

//       <article className="prose-headings:font-semibold prose-a:text-blue-600 prose-a:underline-offset-2">
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
//       </article>

//       <footer className="mt-12 border-t pt-4 text-sm text-gray-500">
//         Last updated: {page.lastUpdatedISO}
//       </footer>
//     </main>
//   );
// }
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
import { replacePlaceholders } from '@/lib/utils/replacePlaceholders';
import { legalVars } from '@/config/legal.config';

// Define the LegalPage type
interface LegalPage {
  slug: string;
  title: string;
  jurisdiction: string;
  version: string;
  body: string;
  lastUpdatedISO: string;
}

// Absolute path to your JSON data
const legalPath = path.join(process.cwd(), 'data/legal.json');

// Helper to load all pages
function getAllLegalPages(): LegalPage[] {
  const file = fs.readFileSync(legalPath, 'utf8');
  return JSON.parse(file) as LegalPage[];
}

// Helper to find a specific page by slug
function getLegalPage(slug: string): LegalPage | undefined {
  return getAllLegalPages().find((page) => page.slug === slug);
}

// --------- Static generation ---------

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
  };
}

// --------- Page component ---------

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  // Replace placeholders using your helper
  const body = replacePlaceholders(page.body);

  return (
    <main className="prose prose-neutral mx-auto max-w-3xl py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{page.title}</h1>
        <p className="text-sm text-gray-500">
          Version {page.version} — Jurisdiction: {page.jurisdiction}
        </p>
      </header>

      <article className="prose-headings:font-semibold prose-a:text-blue-600 prose-a:underline-offset-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </article>

      <footer className="mt-12 border-t pt-4 text-sm text-gray-500">
        Last updated: {page.lastUpdatedISO}
      </footer>
    </main>
  );
}
