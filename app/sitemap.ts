import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site.config';
import { loadServices } from '../lib/utils/data-loaders';
import { loadPages } from '../lib/utils/page-meta'; // from the static pages setup

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  // static pages (from pages.json) — skip noindex pages
  const staticPages = loadPages()
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: new URL(p.path, base).toString(),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // service pages (from services.json)
  const services = loadServices().map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: s.priority ?? 0.7,
  }));

  // add homepage explicitly
  const home = {
    url: `${base}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  return [home, ...staticPages, ...services];
}
