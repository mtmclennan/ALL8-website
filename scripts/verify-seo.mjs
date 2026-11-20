import assert from "node:assert/strict";

import { JSDOM } from "jsdom";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3000").origin;
const preview = process.argv.includes("--preview");
const canonicalOrigin = "https://all8webworks.com";
const priority = [
  "/",
  "/services",
  "/pricing",
  "/services/lead-generation-websites",
  "/services/local-seo-google-business-profile",
  "/work/service-business-growth-case-study",
  "/blog/how-fast-should-a-service-business-respond-to-a-new-lead",
  "/blog/what-makes-a-high-converting-service-page-for-trades-businesses",
  "/blog/why-your-business-isn-t-showing-up-on-google-maps-and-it-s-not-what-you-think",
];

async function request(path, status = 200) {
  const response = await fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  });

  assert.equal(response.status, status, path);

  return response;
}

async function checkHtml(path, { noindex = preview, nofollow = preview } = {}) {
  const response = await request(path);

  assert.match(response.headers.get("content-type") ?? "", /text\/html/i, path);
  const { window } = new JSDOM(await response.text());

  try {
    const { document } = window;
    const meta = (selector) =>
      [...document.querySelectorAll(selector)].map((tag) => tag.content.trim());
    const directive = [
      response.headers.get("x-robots-tag"),
      ...meta('meta[name="robots"], meta[name="googlebot"]'),
    ].join(" ");
    const expected = new URL(path, canonicalOrigin).href;
    const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];

    assert.equal(/\b(?:none|noindex)\b/i.test(directive), noindex, `${path} noindex`);
    assert.equal(/\b(?:none|nofollow)\b/i.test(directive), nofollow, `${path} nofollow`);
    assert.equal(canonicals.length, 1, `${path} canonical count`);
    assert.equal(new URL(canonicals[0].href).href, expected, `${path} canonical`);
    assert.ok(canonicals[0].closest("head"), `${path} canonical in head`);
    const [ogUrl] = meta('meta[property="og:url"]');

    assert.equal(new URL(ogUrl).href, expected, `${path} og:url`);
    assert.ok(document.title.trim(), `${path} title`);
    const [description] = meta('meta[name="description"]');

    assert.ok(description, `${path} description`);
    const headings = [...document.querySelectorAll("main h1")];

    assert.equal(headings.length, 1, `${path} H1 count`);
    assert.ok(headings[0].textContent.trim(), `${path} SSR heading`);
    assert.ok(document.querySelector("nav a[href]"), `${path} SSR navigation`);

    const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((tag) => {
        const value = JSON.parse(tag.textContent);

        return value["@graph"] ?? value;
      });

    assert.equal(
      nodes.find((node) => node["@type"] === "Organization")?.["@id"],
      `${canonicalOrigin}/#organization`,
      `${path} organization JSON-LD`,
    );
    assert.equal(
      nodes.find((node) => node["@type"] === "WebSite")?.publisher?.["@id"],
      `${canonicalOrigin}/#organization`,
      `${path} website publisher JSON-LD`,
    );
    if (/^\/blog\/(?!category\/)/.test(path)) {
      const article = nodes.find((node) => node["@type"] === "BlogPosting");

      assert.equal(article?.mainEntityOfPage?.["@id"], expected, `${path} article JSON-LD`);
    }

    return { title: document.title, description, heading: headings[0].textContent.trim() };
  } finally {
    window.close();
  }
}

const robots = await (await request("/robots.txt")).text();
const searchGroups = robots.split(/\r?\n\s*\r?\n/).filter((section) =>
  /^User-agent:\s*(?:\*|Googlebot)\s*$/im.test(section),
);

if (preview) {
  assert.ok(searchGroups.some((section) => /^Disallow:\s*\/\s*$/im.test(section)));
  assert.doesNotMatch(robots, /^Sitemap:/im);
  await Promise.all(["/", "/pricing", "/hire-matt"].map((path) => checkHtml(path)));
  console.log("Preview robots and page metadata passed.");
} else {
  assert.ok(searchGroups.length > 0);
  assert.ok(searchGroups.every((section) => !/^Disallow:\s*\/\s*$/im.test(section)));
  assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
  const xml = await (await request("/sitemap.xml")).text();
  const { window } = new JSDOM(xml, { contentType: "text/xml" });
  const locations = [...window.document.querySelectorAll("url > loc")]
    .map((tag) => new URL(tag.textContent));

  window.close();
  assert.equal(locations.length, new Set(locations.map((url) => url.href)).size);
  const paths = locations.map((url) => {
    assert.equal(url.href, new URL(url.pathname, canonicalOrigin).href);

    return url.pathname;
  });

  for (const path of priority) assert.ok(paths.includes(path), `${path} in sitemap`);
  assert.ok(!paths.includes("/hire-matt"));
  const metadata = new Map();

  for (let i = 0; i < paths.length; i += 6) {
    await Promise.all(paths.slice(i, i + 6).map(async (path) => {
      metadata.set(path, await checkHtml(path));
    }));
  }
  for (const field of ["title", "description", "heading"]) {
    assert.equal(new Set(priority.map((path) => metadata.get(path)[field])).size, priority.length);
  }
  await checkHtml("/hire-matt", { noindex: true });
  for (const [source, destination, status] of [
    ["/pricing/", "/pricing", 308],
    ["/services/local-seo-foundation", "/services/local-seo-google-business-profile", 308],
    ["/blog/the-contractor-s-guide-to-a-high-performance-website", "/blog/high-performance-contractor-website", 301],
  ]) {
    const response = await request(`${source}?utm_source=seo-check`, status);

    assert.equal(
      new URL(response.headers.get("location"), origin).href,
      new URL(`${destination}?utm_source=seo-check`, origin).href,
    );
    assert.ok(paths.includes(destination), `${destination} reaches a checked page`);
  }
  console.log(`Production SEO passed for ${paths.length} sitemap pages, intentional noindex and three redirects.`);
}
