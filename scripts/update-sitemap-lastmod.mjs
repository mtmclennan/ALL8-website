// Keeps data/sitemap-lastmod.json in step with real content changes.
//
//   node scripts/update-sitemap-lastmod.mjs          update the manifest
//   node scripts/update-sitemap-lastmod.mjs --check  exit 1 if it is stale
//
// A path's lastModified moves to today only when the hash of its content
// inputs (lib/seo/lastmodInputs.mjs) differs from the stored hash. A path with
// no entry yet is seeded from git history (the last commit that changed its
// content), never from the build or deploy time.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  computeHashes,
  gitSource,
  hashRoute,
  routeFiles,
} from "../lib/seo/lastmodInputs.mjs";

const root = process.cwd();
const manifestPath = path.join(root, "data/sitemap-lastmod.json");
const checkOnly = process.argv.includes("--check");

const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};
const utcDay = (iso) => new Date(iso).toISOString().slice(0, 10);
const today = new Date().toISOString().slice(0, 10);

/**
 * Day the route's current content first appeared: walk the commits that touched
 * its inputs newest-first and stop at the first commit whose hash differs from
 * today's. The oldest commit in the unbroken run of identical hashes is the
 * change that produced the current content.
 */
function seedDay(route, currentHash) {
  const log = git("log", "--format=%H %cI", "--", ...routeFiles(route))
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" "));
  let day;

  for (const [sha, iso] of log) {
    if (hashRoute(gitSource(root, sha), route) !== currentHash) break;
    day = utcDay(iso);
  }

  return day;
}

const hashes = computeHashes(root);
const previous = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};
const next = {};
const changes = [];

for (const route of Object.keys(hashes).sort()) {
  const hash = hashes[route];
  const old = previous[route];

  if (old && old.hash === hash) {
    next[route] = old;
    continue;
  }

  const lastModified = old ? today : (seedDay(route, hash) ?? today);

  next[route] = { hash, lastModified };
  changes.push(`${old ? "changed" : "added"} ${route} -> ${lastModified}`);
}

for (const route of Object.keys(previous)) {
  if (!(route in hashes)) changes.push(`removed ${route}`);
}

if (checkOnly) {
  if (changes.length) {
    console.error("sitemap-lastmod.json is stale:\n" + changes.join("\n"));
    console.error("Run: node scripts/update-sitemap-lastmod.mjs");
    process.exit(1);
  }
  console.log("sitemap-lastmod.json is up to date");
} else {
  fs.writeFileSync(manifestPath, JSON.stringify(next, null, 2) + "\n");
  console.log(changes.length ? changes.join("\n") : "No content changes.");
}
