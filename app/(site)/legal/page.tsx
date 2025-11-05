// import fs from 'fs';
// import path from 'path';
// import Link from 'next/link';
// import type { Metadata } from 'next';
// import { legalVars } from '@/config/legal.config';

// const legalPath = path.join(process.cwd(), 'data/legal.json');

// interface LegalPageMeta {
//   slug: string;
//   title: string;
//   version: string;
//   jurisdiction: string;
// }

// export const metadata: Metadata = {
//   title: `Legal • ${legalVars.companyName}`,
//   description: `View ${legalVars.companyName} legal policies including Terms, Privacy, and Cookies.`,
//   robots: { index: false, follow: true },
//   openGraph: {
//     title: `Legal Information | ${legalVars.companyName}`,
//     description: `Official legal documents and policies from ${legalVars.companyName}.`,
//     url: `${legalVars.websiteUrl}/legal`,
//     type: 'website',
//   },
// };

// export default function LegalIndex() {
//   const file = fs.readFileSync(legalPath, 'utf8');
//   const pages: LegalPageMeta[] = JSON.parse(file);

//   return (
//     <main className="mx-auto max-w-3xl px-6 py-16">
//       <header className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-300 text-center m-8">
//           Legal
//         </h1>
//         <p className="text-gray-300">
//           Official legal documents and policies for{' '}
//           <span className="font-medium">{legalVars.companyName}</span>.
//         </p>
//       </header>

//       <ul className="divide-y divide-gray-200 border-y border-gray-200">
//         {pages.map((page) => (
//           <li
//             key={page.slug}
//             className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
//           >
//             <div>
//               <Link
//                 href={`/legal/${page.slug}`}
//                 className="text-lg font-medium text-blue-400 hover:underline"
//               >
//                 {page.title}
//               </Link>
//               <p className="text-sm text-gray-500">
//                 Jurisdiction: {page.jurisdiction}
//               </p>
//             </div>
//             <p className="mt-1 sm:mt-0 text-sm text-gray-400">
//               v{page.version}
//             </p>
//           </li>
//         ))}
//       </ul>

//       <footer className="mt-12 text-sm text-gray-500">
//         © {new Date().getFullYear()} {legalVars.companyName}. All rights
//         reserved.
//       </footer>
//     </main>
//   );
// }
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { legalVars } from '@/config/legal.config';
import LegalPage from './legalPage';

const legalPath = path.join(process.cwd(), 'data/legal.json');

interface LegalPageMeta {
  slug: string;
  title: string;
  version: string;
  jurisdiction: string;
}

export const metadata: Metadata = {
  title: `Legal • ${legalVars.companyName}`,
  description: `View ${legalVars.companyName} legal policies including Terms, Privacy, and Cookies.`,
  robots: { index: false, follow: true },
  openGraph: {
    title: `Legal Information | ${legalVars.companyName}`,
    description: `Official legal documents and policies from ${legalVars.companyName}.`,
    url: `${legalVars.websiteUrl}/legal`,
    type: 'website',
  },
};

export default async function LegalIndex() {
  const file = await fs.promises.readFile(legalPath, 'utf8');
  const pages: LegalPageMeta[] = JSON.parse(file);

  return <LegalPage pages={pages} companyName={legalVars.companyName} />;
}
