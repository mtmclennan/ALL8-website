import { MetadataRoute } from "next";

import { loadServices } from "../lib/utils/data-loaders";
import { loadAllPages } from "../lib/utils/buildStaticMetadata"; // from the static pages setup

import { siteUrl } from "@/config/site.config";
import { getMeaningfulUpdateDate } from "@/lib/blogDate";
import { getBlogCanonicalUrl } from "@/lib/seo/blogCanonical";
import { client as sanity } from "@/app/studio/sanity/lib/client";
import {
  allPostsQuery,
  categoryArchiveSitemapQuery,
} from "@/app/studio/sanity/lib/queries";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";
import { manifestLastModified } from "@/lib/seo/lastmod";
import { newestDate, parseDate } from "@/lib/seo/lastmodDates";

export const revalidate = 3600; // 1 hour

type BlogSitemapPost = {
  slug?: {
    current?: string;
  };
  canonicalUrl?: string | null;
  categories?: { slug?: string | null }[] | null;
  updatedAt?: string;
  publishedAt?: string;
};

/** A lastModified field only when a real date is known; never a default. */
function withLastModified(date: Date | undefined) {
  return date ? { lastModified: date } : {};
}

type CategorySitemapEntry = {
  slug?: string;
  postCount?: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  // static pages (from pages.json) — skip noindex pages
  const staticPages = loadAllPages()
    .filter((p) => !p.noindex && p.path !== "/tuneUpPage")
    .map((p) => ({
      url: new URL(p.path, base).toString(),
      ...withLastModified(manifestLastModified(p.path)),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  // service pages (from services.json)
  const services = loadServices().map((s) => ({
    url: `${base}/services/${s.slug}`,
    ...withLastModified(manifestLastModified(`/services/${s.slug}`)),
    changeFrequency: "weekly" as const,
    priority: s.priority ?? 0.7,
  }));

  // Blog posts and category archives (Sanity)
  const [posts, categories] = await Promise.all([
    sanity.fetch<BlogSitemapPost[]>(allPostsQuery),
    sanity.fetch<CategorySitemapEntry[]>(categoryArchiveSitemapQuery),
  ]);

  // Newest real content date per post: a meaningful update, else publish date.
  const postDate = (p: BlogSitemapPost) =>
    parseDate(
      getMeaningfulUpdateDate(p.publishedAt, p.updatedAt) ?? p.publishedAt,
    );

  const blogPages = posts
    .filter((p): p is BlogSitemapPost & { slug: { current: string } } =>
      Boolean(p.slug?.current),
    )
    .flatMap((p) => {
      const url = `${base}/blog/${canonicalBlogSlug(p.slug.current)}`;

      if (getBlogCanonicalUrl(p.slug.current, p.canonicalUrl) !== url)
        return [];

      return [
        {
          url,
          ...withLastModified(postDate(p)),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        },
      ];
    });

  const categoryPages = categories
    .filter(
      (category): category is CategorySitemapEntry & { slug: string } =>
        Boolean(category.slug) && (category.postCount ?? 0) >= 3,
    )
    .map((category) => ({
      url: `${base}/blog/category/${category.slug}`,
      // newest post the category lists
      ...withLastModified(
        newestDate(
          posts
            .filter((p) => p.categories?.some((c) => c?.slug === category.slug))
            .map((p) => postDate(p)?.toISOString()),
        ),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // add homepage explicitly
  const home = {
    url: `${base}/`,
    ...withLastModified(manifestLastModified("/")),
    changeFrequency: "monthly" as const,
    priority: 1.0,
  };

  const blog = {
    url: `${base}/blog`,
    // newest post the index lists
    ...withLastModified(
      newestDate(posts.map((p) => postDate(p)?.toISOString())),
    ),
    changeFrequency: "monthly" as const,
    priority: 1.0,
  };

  const permanentPages: MetadataRoute.Sitemap = [
    "/privacy",
    "/pricing",
    "/tools",
    "/tools/missed-call-revenue-calculator",
    "/work",
    "/work/service-business-growth-case-study",
  ].map((path) => ({
    url: `${base}${path}`,
    ...withLastModified(manifestLastModified(path)),
    changeFrequency: "monthly" as const,
    priority:
      path === "/work" || path === "/tools/missed-call-revenue-calculator"
        ? 0.9
        : path.startsWith("/work/") || path === "/tools"
          ? 0.8
          : 0.4,
  }));

  const entries: MetadataRoute.Sitemap = [
    home,
    blog,
    ...permanentPages,
    ...staticPages,
    ...services,
    ...categoryPages,
    ...blogPages,
  ];

  return Array.from(
    new Map(entries.map((entry) => [entry.url, entry])).values(),
  );
}
