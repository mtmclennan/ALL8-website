import { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site.config';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/drafts/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
