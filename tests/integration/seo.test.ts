// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  allPostsQuery,
  categoryArchiveSitemapQuery,
} from "@/app/studio/sanity/lib/queries";
import { PERMANENT_REDIRECTS } from "@/config/permanent-redirects.mjs";
import { getBlogCanonicalUrl } from "@/lib/seo/blogCanonical";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { proxy } from "@/proxy";

const sanityFetch = vi.hoisted(() => vi.fn());

vi.mock("@/app/studio/sanity/lib/client", () => ({
  client: { fetch: sanityFetch },
}));

const origin = "https://all8webworks.com";
const oldSlug = "the-contractor-s-guide-to-a-high-performance-website";
const newSlug = "high-performance-contractor-website";
const publishedAt = "2026-10-06T12:00:00Z";
const updatedAt = "2026-10-08T12:00:00Z";
const pricing = {
  path: "/pricing",
  title: "Plans & Pricing",
  description: "Compare plans for service businesses.",
};

afterEach(() => {
  vi.unstubAllEnvs();
  sanityFetch.mockReset();
});

describe("indexing policy", () => {
  it("permits public production routes and keeps intentional page exclusions", () => {
    vi.stubEnv("DEPLOYMENT_ENV", "production");

    expect(robots()).toMatchObject({
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: `${origin}/sitemap.xml`,
    });
    const metadata = buildPageMetadata(pricing);

    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(`${origin}/pricing`);
    expect(metadata.openGraph?.url).toBe(`${origin}/pricing`);
    expect(buildPageMetadata({ ...pricing, noindex: true }).robots).toMatchObject({
      index: false,
      follow: true,
    });
  });

  it.each([undefined, "preview"])("keeps preview metadata restrictive for %s", (env) => {
    vi.stubEnv("DEPLOYMENT_ENV", env);
    vi.stubEnv("NODE_ENV", "production");

    expect(robots()).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
    for (const noindex of [false, true]) {
      expect(buildPageMetadata({ ...pricing, noindex }).robots).toMatchObject({
        index: false,
        follow: false,
      });
    }
  });
});

it("honors valid CMS canonicals while resolving retired URLs and migrated posts", () => {
  expect(getBlogCanonicalUrl("article", `${origin}/blog/${oldSlug}/`)).toBe(
    `${origin}/blog/${newSlug}`,
  );
  expect(getBlogCanonicalUrl(oldSlug, `${origin}/about`)).toBe(
    `${origin}/blog/${newSlug}`,
  );
  expect(getBlogCanonicalUrl("article", `${origin}/blog/article?utm_source=test`)).toBe(
    `${origin}/blog/article`,
  );
});

it("lists self-canonical articles once and uses editorial sitemap dates", async () => {
  sanityFetch.mockImplementation(async (query: string) => {
    if (query === allPostsQuery) {
      return [
        { slug: { current: oldSlug }, publishedAt },
        { slug: { current: newSlug }, publishedAt },
        { slug: { current: "editorial-update" }, publishedAt, updatedAt },
        { slug: { current: "bad-date" }, publishedAt: "invalid" },
        { slug: { current: "alternate" }, canonicalUrl: `${origin}/blog/${newSlug}` },
        {},
      ];
    }
    if (query === categoryArchiveSitemapQuery) {
      return [
        { slug: "thin", postCount: 2 },
        { slug: "eligible", postCount: 3, _updatedAt: updatedAt },
      ];
    }
    throw new Error("Unexpected sitemap query");
  });

  const entries = await sitemap();
  const urls = entries.map(({ url }) => url);

  expect(urls).toHaveLength(new Set(urls).size);
  expect(urls.every((url) => new URL(url).origin === origin)).toBe(true);
  expect(urls).toContain(`${origin}/pricing`);
  for (const path of [`/blog/${oldSlug}`, "/blog/alternate", "/blog/category/thin", "/hire-matt", "/tuneUpPage"]) {
    expect(urls).not.toContain(`${origin}${path}`);
  }
  const date = (path: string) => entries.find(({ url }) => url === `${origin}${path}`)?.lastModified;

  expect(date(`/blog/${newSlug}`)).toEqual(new Date(publishedAt));
  expect(date("/blog/editorial-update")).toEqual(new Date(updatedAt));
  expect(urls).toContain(`${origin}/blog/bad-date`);
  expect(date("/blog/bad-date")).toBeUndefined();
  expect(urls).toContain(`${origin}/blog/category/eligible`);
  expect(date("/blog/category/eligible")).toBeUndefined();
});

it("preserves legacy host paths and queries and has no chained or looping app aliases", () => {
  const sources = new Set(PERMANENT_REDIRECTS.map(({ source }) => source));

  expect(sources.size).toBe(PERMANENT_REDIRECTS.length);
  for (const { destination } of PERMANENT_REDIRECTS) {
    expect(sources.has(destination)).toBe(false);
  }
  const path = "/pricing?utm_source=legacy";
  for (const host of ["all8webworks.ca", "www.all8webworks.ca"]) {
    const response = proxy(new NextRequest(`http://${host}${path}`));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(`${origin}${path}`);
  }
  expect(proxy(new NextRequest(`${origin}${path}`)).headers.has("location")).toBe(false);
});
