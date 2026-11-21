import { parseDate } from "./lastmodDates";

import manifest from "@/data/sitemap-lastmod.json";

type Manifest = Record<string, { hash: string; lastModified: string }>;

const entries = manifest as Manifest;

/**
 * Last real content change for a tracked path, from the committed manifest
 * (maintained by scripts/update-sitemap-lastmod.mjs). Returns undefined when
 * no real date is known; callers must then omit lastModified.
 */
export function manifestLastModified(path: string): Date | undefined {
  return parseDate(entries[path]?.lastModified);
}
