import type { Metadata } from 'next';
import pagesJson from '@/data/pages.json';
import { PagesSchema, type PageMeta } from '@/schemas/pages.schema';
import { site, siteUrl } from '@/config/site.config';

const IS_DEV = process.env.NODE_ENV !== 'production';

function parseOrThrow<T>(schema: any, json: unknown, name: string): T {
  const res = schema.safeParse(json);
  if (!res.success) {
    if (IS_DEV) throw new Error(`${name} invalid:\n${res.error}`);
    console.error(`${name} invalid`, res.error);
    return schema.parse(schema._def.typeName === 'ZodArray' ? [] : {}) as T;
  }
  return res.data as T;
}

let _pages: PageMeta[] | null = null;

export function loadPages(): PageMeta[] {
  if (_pages) return _pages;
  _pages = parseOrThrow<PageMeta[]>(PagesSchema, pagesJson, 'pages.json');
  return _pages;
}

export function getPageMeta(path: string): PageMeta | null {
  return loadPages().find((p) => p.path === path) ?? null;
}

/** Build a Next.js Metadata object for a given static path */
export function buildStaticMetadata(path: string): Metadata {
  const pm = getPageMeta(path);
  if (!pm) return { title: 'Page', description: site.description };

  const base = siteUrl();
  const canonical = new URL(path, base).toString();
  const image = pm.ogImage || site.defaultOgImage;

  const robots = pm.noindex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
      }
    : undefined;

  return {
    title: pm.title,
    description: pm.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: pm.title,
      description: pm.description,
      siteName: site.name,
      locale: site.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: pm.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pm.title,
      description: pm.description,
      images: [image],
      site: site.social.twitter,
      creator: site.social.twitter,
    },
    robots,
  };
}
