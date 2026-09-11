import { canonicalInternalPath } from "../../config/permanent-redirects.mjs";
import { siteUrl } from "../../config/site-origin.ts";

const LEGACY_HOSTS = new Set(["all8webworks.ca", "www.all8webworks.ca"]);

function canonicalizeHref(href: string) {
  try {
    const canonicalOrigin = siteUrl();
    const url = new URL(href, canonicalOrigin);

    if (url.origin !== canonicalOrigin && !LEGACY_HOSTS.has(url.hostname)) {
      return href;
    }

    return `${canonicalInternalPath(url.pathname)}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export function canonicalizePortableTextLinks<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(canonicalizePortableTextLinks) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        key === "href" && typeof item === "string"
          ? canonicalizeHref(item)
          : canonicalizePortableTextLinks(item),
      ]),
    ) as T;
  }

  return value;
}
