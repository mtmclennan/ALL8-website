import { MetadataRoute } from "next";

import { loadServices } from "../lib/utils/data-loaders";
import { loadAllPages } from "../lib/utils/buildStaticMetadata"; // from the static pages setup

import { siteUrl } from "@/config/site.config";
import { client as sanity } from "@/app/studio/sanity/lib/client";
import {
  allPostsQuery,
  categoryArchiveSitemapQuery,
} from "@/app/studio/sanity/lib/queries";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";

export const revalidate = 3600; // 1 hour

type BlogSitemapPost = {
  slug?: {
    current?: string;
  };
  _updatedAt?: string;
  publishedAt?: string;
};

type CategorySitemapEntry = {
  slug?: string;
  _updatedAt?: string;
  postCount?: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  // static pages (from pages.json) — skip noindex pages
  const staticPages = loadAllPages()
    .filter((p) => !p.noindex && p.path !== "/tuneUpPage")
    .map((p) => ({
      url: new URL(p.path, base).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  // service pages (from services.json)
  const services = loadServices().map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: s.priority ?? 0.7,
  }));

  // Blog posts and category archives (Sanity)
  const [posts, categories] = await Promise.all([
    sanity.fetch<BlogSitemapPost[]>(allPostsQuery),
    sanity.fetch<CategorySitemapEntry[]>(categoryArchiveSitemapQuery),
  ]);

  const blogPages = posts
    .filter((p): p is BlogSitemapPost & { slug: { current: string } } =>
      Boolean(p.slug?.current),
    )
    .map((p) => {
      const postDate = p._updatedAt ?? p.publishedAt;

      return {
        url: `${base}/blog/${canonicalBlogSlug(p.slug.current)}`,
        ...(postDate ? { lastModified: new Date(postDate) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

  const categoryPages = categories
    .filter(
      (category): category is CategorySitemapEntry & { slug: string } =>
        Boolean(category.slug) && (category.postCount ?? 0) >= 3,
    )
    .map((category) => ({
      url: `${base}/blog/category/${category.slug}`,
      ...(category._updatedAt
        ? { lastModified: new Date(category._updatedAt) }
        : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // add homepage explicitly
  const home = {
    url: `${base}/`,
    changeFrequency: "monthly" as const,
    priority: 1.0,
  };

  const blog = {
    url: `${base}/blog`,
    changeFrequency: "monthly" as const,
    priority: 1.0,
  };

  const permanentPages: MetadataRoute.Sitemap = [
    "/privacy",
    "/work",
    "/work/service-business-growth-case-study",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/work" ? 0.9 : path.startsWith("/work/") ? 0.8 : 0.4,
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
