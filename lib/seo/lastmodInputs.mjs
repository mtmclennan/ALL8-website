// Declares which source files carry each sitemap URL's content and hashes them.
// Used by scripts/update-sitemap-lastmod.mjs and tests/sitemap-lastmod.test.ts.
// Node-only (reads the filesystem); the sitemap itself reads the committed
// manifest, never these files.
//
// Hashes are computed from a "source" ({ read, list }) so the same code can hash
// the working tree (fsSource) or any past commit (gitSource); the update script
// uses that to seed dates from history instead of guessing.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SITE = "app/(site)";

/** Static pages: files (or directories, hashed recursively) that hold the page's copy. */
export const STATIC_INPUTS = {
  "/": [
    `${SITE}/page.tsx`,
    `${SITE}/Home.tsx`,
    `${SITE}/_components/home`,
    "data/home.json",
    "data/home.ts",
    "data/plans.ts",
    "data/proof.ts",
  ],
  "/pricing": [`${SITE}/pricing/page.tsx`, "data/plans.ts"],
  "/privacy": [`${SITE}/privacy/page.tsx`],
  "/tools": [`${SITE}/tools/page.tsx`, "data/tools.ts"],
  "/tools/missed-call-revenue-calculator": [
    `${SITE}/tools/missed-call-revenue-calculator`,
    "lib/calculators",
  ],
  "/work": [`${SITE}/work/page.tsx`, "data/work.ts"],
  "/work/service-business-growth-case-study": [
    `${SITE}/work/service-business-growth-case-study/page.tsx`,
    "data/work.ts",
    "data/proof.ts",
    "data/plans.ts",
  ],
  "/about": ["data/pages/about.json", "data/pages/about.ts"],
  "/contact": ["data/pages/contact.json", "data/pages/contact.ts"],
  "/services": [
    "data/pages/servicesPage.json",
    "data/pages/servicesPage.ts",
    "data/services.json",
  ],
};

/**
 * Strip noise that is not content so styling/formatting-only edits do not move
 * a date: CRLF vs LF (via whitespace collapsing), className attributes, and whitespace runs.
 * Changing this function changes every hash: re-seed the manifest if you do.
 */
export function normalise(text) {
  return text
    .replace(
      /\sclassName=(?:"[^"]*"|'[^']*'|\{`[^`]*`\}|\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g,
      "",
    )
    .replace(/\s+/g, " ");
}

export function fsSource(root) {
  const list = (rel) => {
    const abs = path.join(root, rel);

    if (!fs.existsSync(abs)) return [];
    if (fs.statSync(abs).isFile()) return [rel];

    return fs.readdirSync(abs).flatMap((name) => list(`${rel}/${name}`));
  };

  return { list, read: (rel) => fs.readFileSync(path.join(root, rel), "utf8") };
}

export function gitSource(root, sha) {
  const git = (...args) => {
    try {
      return execFileSync("git", args, {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      return "";
    }
  };

  return {
    list: (rel) =>
      git("ls-tree", "-r", "--name-only", sha, "--", rel)
        .split("\n")
        .filter(Boolean),
    read: (rel) => git("show", `${sha}:${rel}`),
  };
}

export function hashFiles(source, inputs) {
  const hash = createHash("sha256");

  for (const rel of inputs.flatMap((i) => source.list(i)).sort()) {
    hash.update(`${rel}
${normalise(source.read(rel))}
`);
  }

  return hash.digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, stable(value[k])]),
    );
  }

  return value;
}

const SERVICES_FILE = "data/services.json";
const PLANS_FILE = "data/plans.ts";

/** Files whose history can move a given route's hash (for seeding). */
export function routeFiles(route) {
  return route.startsWith("/services/")
    ? [SERVICES_FILE, PLANS_FILE]
    : STATIC_INPUTS[route];
}

/**
 * Hash for one route, or undefined if it does not exist in this source.
 * A service page hashes its own entry in services.json plus the plan data its
 * pricing block renders, so editing one service never moves the other eight.
 */
export function hashRoute(source, route) {
  if (!route.startsWith("/services/")) {
    return hashFiles(source, STATIC_INPUTS[route]);
  }

  const slug = route.slice("/services/".length);
  const text = source.read(SERVICES_FILE);
  let entry;

  try {
    entry = JSON.parse(text).find((s) => s.slug === slug);
  } catch {
    return undefined;
  }

  if (!entry) return undefined;

  return createHash("sha256")
    .update(JSON.stringify(stable(entry)))
    .update(hashFiles(source, [PLANS_FILE]))
    .digest("hex");
}

export function allRoutes(source) {
  const services = JSON.parse(source.read(SERVICES_FILE));

  return [
    ...Object.keys(STATIC_INPUTS),
    ...services.map((s) => `/services/${s.slug}`),
  ];
}

/** { "/path": hash } for every tracked URL in the working tree. */
export function computeHashes(root = process.cwd()) {
  const source = fsSource(root);

  return Object.fromEntries(
    allRoutes(source).map((route) => [route, hashRoute(source, route)]),
  );
}
