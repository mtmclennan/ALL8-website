// @vitest-environment node

import { createHmac } from "node:crypto";

import { NextRequest } from "next/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { GET } from "@/app/api/indexnow/key/[key]/route";
import { POST } from "@/app/api/indexnow/sanity/route";
import { submitIndexNow } from "@/lib/indexnow/client";

const mocks = vi.hoisted(() => ({
  sanity: vi.fn(),
  invalidate: vi.fn(),
  values: new Map<string, string>(),
}));

vi.mock("@/app/studio/sanity/env", () => ({
  projectId: "project",
  dataset: "production",
}));
vi.mock("@/app/studio/sanity/lib/client", () => ({
  client: { fetch: mocks.sanity },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.invalidate }));
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({
      set: async (key: string, value: string) => {
        if (mocks.values.has(key)) return null;
        mocks.values.set(key, value);

        return "OK";
      },
      get: async (key: string) => mocks.values.get(key),
      eval: async (_: string, [key]: string[], [token, state]: string[]) => {
        if (mocks.values.get(key) !== token) return 0;
        if (state === "done") mocks.values.set(key, "done");
        else mocks.values.delete(key);

        return 1;
      },
    }),
  },
}));

const origin = "https://all8webworks.com";
const endpoint = "https://api.indexnow.org/indexnow";
const key = "test-indexnow-public-key";
const secret = "this-test-signing-secret-is-separate";
const post = {
  id: "article",
  revision: "currentRev",
  slug: "fresh-article",
  draft: false,
  noIndex: false,
  canonicalUrl: null as string | null,
};
const publish = {
  projectId: "project",
  dataset: "production",
  meaningful: true,
  before: null,
  after: post,
};

function signed(event: unknown, signingSecret = secret) {
  const body = JSON.stringify(event);
  const timestamp = Date.now();
  const signature = createHmac("sha256", signingSecret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");

  return new NextRequest(origin + "/api/indexnow/sanity", {
    method: "POST",
    headers: { "sanity-webhook-signature": `t=${timestamp},v1=${signature}` },
    body,
  });
}

function live(record = post) {
  return {
    _id: record.id,
    _rev: record.revision,
    slug: { current: record.slug },
    draft: record.draft,
    seo: { noIndex: record.noIndex, canonicalUrl: record.canonicalUrl },
  };
}

function page(url: string, revision = post.revision, robots = "index,follow") {
  return new Response(
    `<head><link rel="canonical" href="${url}"><meta name="robots" content="${robots}"><meta name="all8-article-revision" content="${revision}"></head>`,
    {
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

function upstream(status = 202, serve = (url: string) => page(url)) {
  vi.mocked(fetch).mockImplementation(async (input) =>
    input === endpoint ? new Response(null, { status }) : serve(String(input)),
  );
}

const submissions = () =>
  vi.mocked(fetch).mock.calls.filter(([url]) => url === endpoint);

beforeEach(() => {
  vi.stubEnv("DEPLOYMENT_ENV", "production");
  vi.stubEnv("INDEXNOW_ENABLED", "true");
  vi.stubEnv("INDEXNOW_KEY", key);
  vi.stubEnv("INDEXNOW_ENDPOINT", undefined);
  vi.stubEnv("SANITY_INDEXNOW_WEBHOOK_SECRET", secret);
  mocks.values.clear();
  mocks.sanity.mockReset().mockResolvedValue(live());
  mocks.invalidate.mockClear();
});

afterEach(() => vi.unstubAllEnvs());

it("serves exactly the configured UTF-8 public key on the production key route", async () => {
  const get = (value: string) =>
    GET(new Request(origin), { params: Promise.resolve({ key: value }) });
  const response = await get(key);

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "text/plain; charset=utf-8",
  );
  expect(await response.text()).toBe(key);
  expect((await get(secret)).status).toBe(404);
  vi.stubEnv("INDEXNOW_KEY", "bad/secret");
  expect((await get("bad/secret")).status).toBe(404);
  vi.stubEnv("INDEXNOW_KEY", key);
  vi.stubEnv("DEPLOYMENT_ENV", "preview");
  expect((await get(key)).status).toBe(404);
});

it("rejects missing or invalid signatures, mismatched datasets and preview requests", async () => {
  const unsigned = new NextRequest(origin + "/api/indexnow/sanity", {
    method: "POST",
    headers: { authorization: `Bearer ${key}` },
    body: JSON.stringify(publish),
  });

  expect((await POST(unsigned)).status).toBe(401);
  expect((await POST(signed(publish, key))).status).toBe(401);
  expect((await POST(signed({ ...publish, dataset: "staging" }))).status).toBe(
    403,
  );
  vi.stubEnv("DEPLOYMENT_ENV", "preview");
  expect((await POST(signed(publish))).status).toBe(404);
  expect(fetch).not.toHaveBeenCalled();
  expect(mocks.sanity).not.toHaveBeenCalled();
});

it("checks the public revision before submitting and suppresses both concurrent and completed duplicates", async () => {
  upstream(202, (url) => page(url, "staleRev"));
  const path = "/blog/fresh-article";

  expect((await POST(signed(publish))).status).toBe(503);
  expect(mocks.invalidate).toHaveBeenCalledWith(path);
  expect(mocks.invalidate).toHaveBeenCalledWith("/sitemap.xml");
  expect(submissions()).toHaveLength(0);
  upstream();
  const responses = await Promise.all([
    POST(signed(publish)),
    POST(signed(publish)),
  ]);
  const outcomes = await Promise.all(
    responses.map((response) => response.json()),
  );

  expect(outcomes.map(({ outcome }) => outcome)).toContain("submitted");
  expect(await (await POST(signed(publish))).json()).toEqual({
    outcome: "duplicate",
  });
  expect(submissions()).toHaveLength(1);
  expect(JSON.parse(String(submissions()[0][1]?.body))).toEqual({
    host: "all8webworks.com",
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList: [origin + path],
  });
});

it("waits for a public 404/410 on unpublish and handles both URLs after a slug change", async () => {
  const before = { ...post, slug: "old-article", revision: "previousRev" };
  const oldUrl = origin + "/blog/old-article";
  const newUrl = origin + "/blog/fresh-article";
  const rename = { ...publish, before };

  mocks.sanity.mockImplementation(async (_query, { slugs }) =>
    slugs.includes(before.slug) ? null : live(),
  );
  upstream(200, (url) =>
    url === oldUrl ? page(url, before.revision) : page(url),
  );
  expect((await POST(signed(rename))).status).toBe(503);
  expect(submissions()).toHaveLength(0);
  upstream(200, (url) =>
    url === oldUrl ? new Response(null, { status: 404 }) : page(url),
  );
  expect((await POST(signed(rename))).status).toBe(200);
  expect(JSON.parse(String(submissions()[0][1]?.body)).urlList).toEqual([
    oldUrl,
    newUrl,
  ]);

  mocks.sanity.mockResolvedValue(null);
  upstream(200, () => new Response(null, { status: 410 }));
  expect(
    (await POST(signed({ ...publish, before: post, after: null }))).status,
  ).toBe(200);
  expect(JSON.parse(String(submissions()[1][1]?.body)).urlList).toEqual([
    newUrl,
  ]);
});

it("excludes nonmeaningful events, drafts, versions, alternate canonicals and noindex pages", async () => {
  for (const event of [
    { ...publish, meaningful: false },
    { ...publish, after: { ...post, id: "drafts.article" } },
    { ...publish, after: { ...post, id: "versions.release.article" } },
    { ...publish, after: { ...post, draft: true } },
    { ...publish, after: { ...post, noIndex: true } },
    { ...publish, after: { ...post, canonicalUrl: origin + "/blog/other" } },
  ]) {
    mocks.values.clear();
    expect((await POST(signed(event))).status).toBe(200);
  }
  expect(fetch).not.toHaveBeenCalled();
  expect(mocks.sanity).not.toHaveBeenCalled();

  mocks.values.clear();
  upstream(202, (url) => page(url, post.revision, "noindex,follow"));
  expect((await POST(signed(publish))).status).toBe(503);
  expect(submissions()).toHaveLength(0);
});

it("notifies only the destination of a mapped Sanity slug, and omits redirected removals", async () => {
  const migrated = {
    ...post,
    slug: "the-contractor-s-guide-to-a-high-performance-website",
  };
  const canonical = origin + "/blog/high-performance-contractor-website";

  mocks.sanity.mockResolvedValue(live(migrated));
  upstream();
  expect((await POST(signed({ ...publish, after: migrated }))).status).toBe(
    200,
  );
  expect(JSON.parse(String(submissions()[0][1]?.body)).urlList).toEqual([
    canonical,
  ]);
  expect(fetch).not.toHaveBeenCalledWith(
    origin + "/blog/" + migrated.slug,
    expect.anything(),
  );

  mocks.sanity.mockResolvedValue(null);
  upstream(
    202,
    () =>
      new Response(null, {
        status: 301,
        headers: { location: origin + "/blog" },
      }),
  );
  expect(
    await (
      await POST(signed({ ...publish, before: migrated, after: null }))
    ).json(),
  ).toEqual({ outcome: "ignored" });
  expect(submissions()).toHaveLength(1);
});

it("releases failed deliveries for retry and does not log keys or upstream response bodies", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  upstream(429);
  expect((await POST(signed(publish))).status).toBe(503);
  expect(JSON.stringify(warn.mock.calls)).not.toContain(key);
  expect(JSON.stringify(warn.mock.calls)).not.toContain(secret);
  upstream(200);
  expect((await POST(signed(publish))).status).toBe(200);

  vi.mocked(fetch).mockRejectedValueOnce(new Error(secret));
  await expect(submitIndexNow([origin + "/pricing"])).rejects.toThrow(
    "IndexNow request failed",
  );
  await expect(
    submitIndexNow(["https://all8webworks.ca/pricing"]),
  ).rejects.toThrow("Invalid IndexNow URL");
});
