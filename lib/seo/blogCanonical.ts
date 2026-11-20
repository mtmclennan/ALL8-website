import {
  canonicalBlogSlug,
  canonicalInternalPath,
  sourceBlogSlug,
} from "@/config/permanent-redirects.mjs";
import { absoluteSiteUrl, safeCanonicalUrl } from "@/config/site-origin";

export function getBlogCanonicalUrl(slug: string, override?: string | null) {
  const canonicalSlug = canonicalBlogSlug(slug);
  const path = `/blog/${canonicalSlug}`;

  // Published slug migrations take precedence over existing CMS overrides.
  if (sourceBlogSlug(canonicalSlug) !== canonicalSlug) {
    return absoluteSiteUrl(path);
  }

  const url = new URL(safeCanonicalUrl(override ?? undefined, path));
  const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";

  if (url.username || url.password || normalizedPath.startsWith("//")) {
    return absoluteSiteUrl(path);
  }

  url.pathname = canonicalInternalPath(normalizedPath);

  return url.toString();
}
