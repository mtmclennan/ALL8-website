const origin = process.argv[2] ?? "http://localhost:3002";
const maximumPages = Number(process.argv[3] ?? 120);
const queue = [
  "/",
  "/services",
  "/hire-matt",
  "/work",
  "/work/service-business-growth-case-study",
];
const seen = new Set();
const broken = [];
const pageChecks = [];
const invalidStructuredData = [];

while (queue.length && seen.size < maximumPages) {
  const path = queue.shift();

  if (!path || seen.has(path)) continue;
  seen.add(path);

  try {
    const response = await fetch(new URL(path, origin), { redirect: "follow" });

    if (!response.ok) {
      broken.push({ path, status: response.status });
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) continue;

    const html = await response.text();
    const h1Count = [...html.matchAll(/<h1\b/gi)].length;
    const canonical =
      html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? null;

    pageChecks.push({ path, h1Count, canonical });

    for (const [index, match] of [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
      ),
    ].entries()) {
      try {
        JSON.parse(match[1]);
      } catch (error) {
        invalidStructuredData.push({
          path,
          script: index + 1,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    for (const match of html.matchAll(/href="([^"]+)"/gi)) {
      const href = match[1].replaceAll("&amp;", "&");

      if (
        !href.startsWith("/") ||
        href.startsWith("//") ||
        href.startsWith("/_next") ||
        href.startsWith("/api") ||
        href.startsWith("/studio")
      ) {
        continue;
      }

      const nextPath = href.split("#")[0].split("?")[0];

      if (nextPath && !seen.has(nextPath) && !queue.includes(nextPath)) {
        queue.push(nextPath);
      }
    }
  } catch (error) {
    broken.push({
      path,
      status: "request-error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

const invalidHeadings = pageChecks.filter((page) => page.h1Count !== 1);
const invalidCanonicals = pageChecks.filter(
  (page) => !page.canonical?.startsWith("https://all8webworks.com"),
);

console.log(
  JSON.stringify(
    {
      origin,
      crawled: seen.size,
      remaining: queue.length,
      broken,
      invalidHeadings,
      invalidCanonicals,
      invalidStructuredData,
    },
    null,
    2,
  ),
);

if (
  broken.length ||
  invalidHeadings.length ||
  invalidCanonicals.length ||
  invalidStructuredData.length
) {
  process.exitCode = 1;
}
