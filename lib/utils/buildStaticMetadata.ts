import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { PageSchema, type PageMeta } from '@/schemas/pages.schema';
import { site, siteUrl } from '@/config/site.config';

const IS_DEV = process.env.NODE_ENV !== 'production';

/** Normalize path to always start with a single slash */
function normPath(p: string) {
  if (!p) return '/';
  return p.startsWith('/') ? p : `/${p}`;
}

/** Build absolute URL safely */
function toAbs(base: string | undefined, pathOrUrl: string) {
  try {
    const test = new URL(pathOrUrl);
    return test.toString();
  } catch {
    const b = base || 'https://all8webworks.ca';
    return new URL(normPath(pathOrUrl), b).toString();
  }
}

/** Helper for reading and validating a JSON file */
function readPageFile(filePath: string): PageMeta | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const res = PageSchema.safeParse(parsed);
    if (!res.success) {
      if (IS_DEV)
        throw new Error(`Invalid page JSON: ${filePath}\n${res.error}`);
      console.error(`Invalid page JSON: ${filePath}`, res.error);
      return null;
    }
    return res.data;
  } catch (err) {
    if (IS_DEV) throw err;
    console.error(`Missing or unreadable page file: ${filePath}`, err);
    return null;
  }
}

/** Load and validate a single page JSON by slug */
export function loadPageJson(slug: string): PageMeta | null {
  const file = path.join(process.cwd(), '/data/pages', `${slug}.json`);
  return readPageFile(file);
}

/** Load all static page JSON files (for sitemap or CMS preview) */
export function loadAllPages(): (PageMeta & { path: string })[] {
  const dir = path.join(process.cwd(), '/data/pages');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  return files
    .map((file) => {
      const page = readPageFile(path.join(dir, file));
      if (!page) return null;

      let route = file.replace('.json', '');
      if (route === 'index') route = '/';
      else if (route === 'servicesPage') route = '/services';
      else route = `/${route}`;

      return { ...page, path: route };
    })
    .filter(Boolean) as (PageMeta & { path: string })[];
}

/** Build Metadata for a given static path */
export function buildStaticMetadata(pathStr: string): Metadata {
  const p = normPath(pathStr);
  const slug =
    p === '/'
      ? 'index'
      : p === '/services'
        ? 'servicesPage'
        : p.replace('/', '');

  const page = loadPageJson(slug);

  if (!page) {
    return {
      title: site.name,
      description: site.description,
    };
  }

  const base = siteUrl();
  const canonical = toAbs(base, p);
  const imageRel = page.ogImage || site.defaultOgImage;
  const image = toAbs(base, imageRel);

  const robots: Metadata['robots'] | undefined = page.noindex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          noarchive: true,
        },
      }
    : undefined;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: page.title,
      description: page.description,
      siteName: site.name,
      locale: site.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [image],
      site: site.social.twitter,
      creator: site.social.twitter,
    },
    robots,
  };
}
