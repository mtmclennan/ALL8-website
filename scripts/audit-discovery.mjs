import { JSDOM } from "jsdom";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3000").origin;
const publicOrigin = "https://all8webworks.com";

async function get(path) {
  return fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  });
}

const sitemap = await get("/sitemap.xml");
if (!sitemap.ok) throw new Error(`Sitemap HTTP ${sitemap.status}`);
const { window: xml } = new JSDOM(await sitemap.text(), { contentType: "text/xml" });
const paths = new Set([...xml.document.querySelectorAll("url > loc")]
  .map((element) => new URL(element.textContent).pathname));
xml.close();

async function crawl(path) {
  const response = await get(path);
  const html = await response.text();
  const { window } = new JSDOM(html, { url: new URL(path, origin) });

  try {
    const { document } = window;
    const links = (selector) => [
      ...new Set([...document.querySelectorAll(selector)].flatMap((node) => {
        const url = URL.parse(node.href);

        return url && [origin, publicOrigin].includes(url.origin) &&
          url.pathname !== path && paths.has(url.pathname) ? [url.pathname] : [];
      })),
    ].sort();
    const query = (selector) => [...document.querySelectorAll(selector)];

    return {
      path,
      status: response.status,
      htmlBytes: Buffer.byteLength(html),
      cache: Object.fromEntries(["cache-control", "age", "cf-cache-status", "x-nextjs-cache"]
        .map((key) => [key, response.headers.get(key)])),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: [
        response.headers.get("x-robots-tag"),
        ...query('meta[name="robots"], meta[name="googlebot"]').map((tag) => tag.content),
      ].filter(Boolean),
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content?.trim(),
      headings: query("main h1, main h2, main h3, main h4, main h5, main h6")
        .map((node) => [Number(node.tagName.slice(1)), node.textContent.trim()]),
      images: query("main img").map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
        loading: img.getAttribute("loading"),
        sizes: img.getAttribute("sizes"),
      })),
      scripts: query("script[src]").map((node) => node.src),
      styles: query('link[rel="stylesheet"]').map((node) => node.href),
      links: links("a[href]"),
      main: links("main a[href]"),
    };
  } finally {
    window.close();
  }
}

const pages = [];
const queue = [...paths].sort();
while (queue.length) pages.push(...await Promise.all(queue.splice(0, 4).map(crawl)));

const byPath = new Map(pages.map((page) => [page.path, page]));
function depths(edge) {
  const found = new Map([["/", 0]]);
  const pending = ["/"];

  for (const path of pending) {
    for (const target of byPath.get(path)?.[edge] ?? []) {
      if (found.has(target)) continue;

      found.set(target, found.get(path) + 1);
      pending.push(target);
    }
  }

  return found;
}

const depth = depths("links");
const mainDepth = depths("main");
console.log(JSON.stringify(pages.map((page) => ({
  ...page,
  depth: depth.get(page.path) ?? null,
  mainDepth: mainDepth.get(page.path) ?? null,
  incoming: pages.filter((candidate) => candidate.links.includes(page.path)).length,
  mainIncoming: pages.filter((candidate) => candidate.main.includes(page.path)).length,
})), null, 2));
