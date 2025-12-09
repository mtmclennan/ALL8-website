import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site.config';
import { loadServices } from '../lib/utils/data-loaders';
import { loadAllPages } from '../lib/utils/buildStaticMetadata'; // from the static pages setup
import { client as sanity } from '@/app/studio/sanity/lib/client';
import { allPostsQuery } from '@/app/studio/sanity/lib/queries';
import { Post } from './studio/sanity.types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  // static pages (from pages.json) — skip noindex pages
  const staticPages = loadAllPages()
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: new URL(p.path, base).toString(),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

  // service pages (from services.json)
  const services = loadServices().map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: s.priority ?? 0.7,
  }));

  // Blog posts (Sanity)
  const posts = await sanity.fetch(allPostsQuery);

  const blogPages = posts.map((p: Post) => ({
    url: `${base}/blog/${p.slug?.current}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // add homepage explicitly
  const home = {
    url: `${base}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  return [home, ...staticPages, ...services, ...blogPages];
}
