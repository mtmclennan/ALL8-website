import type { Metadata } from "next";

import { absoluteSiteUrl, safeCanonicalUrl, site } from "@/config/site.config";

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  canonicalUrl?: string;
  image?: string;
  twitterImage?: string;
  imageAlt?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  type?: "article" | "website";
  noindex?: boolean;
};

export function normalizeBrandName(value: string) {
  return value.replace(/all8 webworks/gi, site.name);
}

export function withBrandSuffix(value: string) {
  const title = normalizeBrandName(value).trim();

  return new RegExp(`\\|\\s*${site.name}$`, "i").test(title)
    ? title.replace(new RegExp(`${site.name}$`, "i"), site.name)
    : `${title} | ${site.name}`;
}

function metadataImageUrl(image?: string) {
  const candidate = image || site.defaultOgImage;

  try {
    return new URL(candidate).toString();
  } catch {
    return absoluteSiteUrl(candidate);
  }
}

export function buildPageMetadata({
  title,
  description,
  path,
  canonicalUrl,
  image,
  twitterImage,
  imageAlt,
  openGraphTitle,
  openGraphDescription,
  type = "website",
  noindex = false,
}: MetadataOptions): Metadata {
  const normalizedTitle = normalizeBrandName(title);
  const normalizedDescription = normalizeBrandName(description);
  const canonical = safeCanonicalUrl(canonicalUrl, path);
  const ogTitle = normalizeBrandName(openGraphTitle ?? normalizedTitle);
  const ogDescription = normalizeBrandName(
    openGraphDescription ?? normalizedDescription,
  );
  const resolvedImage = metadataImageUrl(image);
  const resolvedTwitterImage = metadataImageUrl(twitterImage ?? image);

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      locale: site.locale,
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [resolvedTwitterImage],
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
          nocache: true,
          googleBot: {
            index: false,
            follow: true,
            noimageindex: true,
            noarchive: true,
          },
        }
      : undefined,
  };
}
