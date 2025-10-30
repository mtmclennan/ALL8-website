// import type { Metadata } from 'next';
// import pagesJson from '@/data/pages.json';
// import { PagesSchema, type PageMeta } from '@/schemas/pages.schema';
// import { site, siteUrl } from '@/config/site.config';

// const IS_DEV = process.env.NODE_ENV !== 'production';

// /** Normalize path to start with a single leading slash. */
// function normPath(p: string) {
//   if (!p) return '/';
//   return p.startsWith('/') ? p : `/${p}`;
// }

// /** Build absolute URL safely. */
// function toAbs(base: string | undefined, pathOrUrl: string) {
//   // If already absolute, return as-is
//   try {
//     const test = new URL(pathOrUrl);
//     return test.toString();
//   } catch {
//     // fall through
//   }
//   const b = base || 'https://all8webworks.ca'; // fallback so build doesn’t explode
//   return new URL(normPath(pathOrUrl), b).toString();
// }

// /** Zod-guarded JSON load */
// function parseOrThrow<T>(schema: any, json: unknown, name: string): T {
//   const res = schema.safeParse(json);
//   if (!res.success) {
//     if (IS_DEV) {
//       // Throw loudly in dev so you see the real issue
//       throw new Error(`${name} invalid:\n${res.error}`);
//     }
//     console.error(`${name} invalid`, res.error);
//     // Minimal safe fallback: empty array/object depending on schema
//     return (Array.isArray(json) ? [] : {}) as T;
//   }
//   return res.data as T;
// }

// let _pages: PageMeta[] | null = null;

// export function loadPages(): PageMeta[] {
//   if (_pages) return _pages;
//   _pages = parseOrThrow<PageMeta[]>(PagesSchema, pagesJson, 'pages.json');
//   return _pages;
// }

// export function getPageMeta(path: string): PageMeta | null {
//   const p = normPath(path);
//   return loadPages().find((x) => x.path === p) ?? null;
// }

// /** Build a Next.js Metadata object for a given static path */
// export function buildStaticMetadata(path: string): Metadata {
//   const p = normPath(path);
//   const pm = getPageMeta(p);

//   // In dev, fail loudly if the page isn’t found so you notice the mismatch
//   if (!pm) {
//     if (IS_DEV) {
//       throw new Error(
//         `No entry for "${p}" in pages.json. Add it or fix the path.`
//       );
//     }
//     return { title: 'Page', description: site.description };
//   }

//   const base = siteUrl(); // may be undefined at build if env missing
//   const canonical = toAbs(base, p);

//   // Ensure absolute OG image
//   const imageRel = pm.ogImage || site.defaultOgImage;
//   const image = toAbs(base, imageRel);

//   const robots: Metadata['robots'] | undefined = pm.noindex
//     ? {
//         index: false,
//         follow: false,
//         nocache: true,
//         googleBot: {
//           index: false,
//           follow: false,
//           noimageindex: true,
//           noarchive: true,
//         },
//       }
//     : undefined;

//   return {
//     title: pm.title,
//     description: pm.description,
//     alternates: { canonical },
//     openGraph: {
//       url: canonical,
//       title: pm.title,
//       description: pm.description,
//       siteName: site.name,
//       locale: site.locale, // e.g. "en-CA"
//       type: 'website',
//       images: [{ url: image, width: 1200, height: 630, alt: pm.title }],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: pm.title,
//       description: pm.description,
//       images: [image],
//       site: site.social.twitter, // e.g. "@all8webworks"
//       creator: site.social.twitter,
//     },
//     robots,
//   };
// }
