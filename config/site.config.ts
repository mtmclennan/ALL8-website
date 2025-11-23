import { SiteData } from '@/schemas/site.schema';
import { loadSite } from '../lib/utils/data-loaders';

export const site: SiteData = loadSite();

export function siteUrl() {
  // .env for domains; fallback to CA
  const ca = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://all8webworks.ca';
  const us = process.env.NEXT_PUBLIC_SITE_URL_US;
  const canonical =
    (process.env.NEXT_PUBLIC_CANONICAL_DOMAIN as 'ca' | 'com') ?? 'ca';
  return canonical === 'ca' ? ca : (us ?? ca);
}
