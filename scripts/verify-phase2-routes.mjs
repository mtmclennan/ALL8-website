const origin = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://all8webworks.com";

const routes = [
  {
    path: "/",
    h1: "Turn More Searches, Clicks & Calls Into Customers.",
    links: [
      "/work",
      "/tools",
      "/blog/local-seo-for-contractors-google-maps",
      "/blog/more-traffic-won-t-fix-the-wrong-website",
    ],
  },
  {
    path: "/services",
    h1: "Fix the Gaps Between Search and Sale.",
    links: [
      "/work",
      "/services/lead-generation-websites",
      "/services/missed-call-recovery",
    ],
  },
  {
    path: "/services/lead-generation-websites",
    links: ["/work/service-business-growth-case-study"],
  },
  {
    path: "/services/missed-call-recovery",
    links: [
      "/work/service-business-growth-case-study",
      "/tools/missed-call-revenue-calculator",
    ],
  },
  {
    path: "/tools",
    h1: "Tools for Service Businesses",
    links: ["/tools/missed-call-revenue-calculator"],
  },
  {
    path: "/tools/missed-call-revenue-calculator",
    h1: "Missed Call Revenue Calculator",
    links: ["/tools", "/services/missed-call-recovery"],
    includes: ["Calculate My Estimate"],
  },
  {
    path: "/work",
    h1: "Results & Case Studies",
    links: ["/work/service-business-growth-case-study"],
  },
  {
    path: "/work/service-business-growth-case-study",
    h1: "From Search Growth to a Better Lead-Handling System",
    links: ["/contact"],
  },
  {
    path: "/blog",
    links: [
      "/blog/local-seo-for-contractors-google-maps",
      "/blog/more-traffic-won-t-fix-the-wrong-website",
    ],
  },
  {
    path: "/blog/local-seo-for-contractors-google-maps",
    links: ["/services/local-seo-google-business-profile"],
  },
  {
    path: "/blog/more-traffic-won-t-fix-the-wrong-website",
    links: ["/services/lead-generation-websites"],
  },
  {
    path: "/hire-matt",
    h1: "Developer. Marketer. Business Problem Solver.",
    noindex: true,
    excludes: ["Get My Free Lead System Review"],
  },
];

const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const getAttribute = (tag, attribute) => {
  const match = tag.match(
    new RegExp(`\\b${attribute}=(?:"([^"]*)"|'([^']*)')`, "i"),
  );

  return decodeHtml(match?.[1] ?? match?.[2] ?? "");
};

const getMeta = (html, key) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find(
    (candidate) =>
      getAttribute(candidate, "name") === key ||
      getAttribute(candidate, "property") === key,
  );

  return tag ? getAttribute(tag, "content") : "";
};

const getCanonical = (html) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => getAttribute(candidate, "rel") === "canonical");

  return tag ? getAttribute(tag, "href") : "";
};

const normalizedUrl = (value) => value.replace(/\/$/, "");

const getTitle = (html) =>
  decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");

const getH1s = (html) =>
  [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
    decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()),
  );

const hasHref = (html, href) => {
  const tags = html.match(/<a\b[^>]*>/gi) ?? [];

  return tags.some((tag) => getAttribute(tag, "href") === href);
};

let failureCount = 0;

for (const route of routes) {
  const response = await fetch(`${origin}${route.path}`, { redirect: "manual" });
  const html = await response.text();
  const h1s = getH1s(html);
  const title = getTitle(html);
  const description = getMeta(html, "description");
  const canonical = getCanonical(html);
  const expectedCanonical = new URL(route.path, `${canonicalOrigin}/`).toString();
  const robots = getMeta(html, "robots");
  const errors = [];

  if (response.status !== 200) errors.push(`status ${response.status}`);
  if (!title) errors.push("missing title");
  if (!description) errors.push("missing meta description");
  if (normalizedUrl(canonical) !== normalizedUrl(expectedCanonical)) {
    errors.push(`canonical ${JSON.stringify(canonical)} (expected ${expectedCanonical})`);
  }
  if (h1s.length !== 1) errors.push(`${h1s.length} H1 elements`);
  if (route.h1 && h1s[0] !== route.h1) {
    errors.push(`H1 ${JSON.stringify(h1s[0])} (expected ${JSON.stringify(route.h1)})`);
  }

  for (const key of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!getMeta(html, key)) errors.push(`missing ${key}`);
  }
  if (
    normalizedUrl(getMeta(html, "og:url")) !== normalizedUrl(expectedCanonical)
  ) {
    errors.push(`og:url does not match canonical`);
  }
  for (const key of [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ]) {
    if (!getMeta(html, key)) errors.push(`missing ${key}`);
  }

  const isNoindex = /(?:^|[,\s])noindex(?:$|[,\s])/i.test(robots);
  if (Boolean(route.noindex) !== isNoindex) {
    errors.push(route.noindex ? "missing noindex" : "unexpected noindex");
  }

  for (const href of route.links ?? []) {
    if (!hasHref(html, href)) errors.push(`missing SSR link ${href}`);
  }
  for (const text of route.excludes ?? []) {
    if (decodeHtml(html.replace(/<[^>]+>/g, " ")).includes(text)) {
      errors.push(`contains excluded text ${JSON.stringify(text)}`);
    }
  }
  for (const text of route.includes ?? []) {
    if (!decodeHtml(html.replace(/<[^>]+>/g, " ")).includes(text)) {
      errors.push(`missing text ${JSON.stringify(text)}`);
    }
  }

  failureCount += errors.length;
  console.log(
    `${errors.length ? "FAIL" : "PASS"} ${route.path} | ${response.status} | ${h1s[0] ?? "no H1"}`,
  );
  for (const error of errors) console.log(`  - ${error}`);
}

if (failureCount) {
  console.error(`\nRoute verification failed with ${failureCount} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`\nRoute verification passed for ${routes.length} representative routes.`);
}
