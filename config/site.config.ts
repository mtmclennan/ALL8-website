import { loadSite } from "../lib/utils/data-loaders";

import { SiteData } from "@/schemas/site.schema";

export {
  absoluteSiteUrl,
  isProductionDeployment,
  safeCanonicalUrl,
  siteUrl,
} from "./site-origin";

export const site: SiteData = loadSite();
