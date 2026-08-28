import { loadSite } from "../lib/utils/data-loaders";

import { SiteData } from "@/schemas/site.schema";

export const site: SiteData = loadSite();

export function siteUrl() {
  // The .com domain is the single public canonical. NEXT_PUBLIC_SITE_URL_US is
  // retained for compatibility with the existing deployment configuration.
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL_US ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://all8webworks.com";

  return configured.replace(/\/$/, "");
}
