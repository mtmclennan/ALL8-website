import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { computeHashes } from "../lib/seo/lastmodInputs.mjs";
import { newestDate, parseDate } from "../lib/seo/lastmodDates.ts";

type Manifest = Record<string, { hash: string; lastModified: string }>;

const manifest: Manifest = JSON.parse(
  fs.readFileSync("data/sitemap-lastmod.json", "utf8"),
);
const hashes: Record<string, string | undefined> = computeHashes(process.cwd());

test("every tracked page has a manifest entry and every entry is still tracked", () => {
  assert.deepEqual(Object.keys(manifest).sort(), Object.keys(hashes).sort());
});

test("manifest hashes match current content, so unchanged pages keep their old date", () => {
  // Fails when a page's content changed but its lastModified was not refreshed
  // (run: node scripts/update-sitemap-lastmod.mjs).
  for (const [route, entry] of Object.entries(manifest)) {
    assert.equal(
      entry.hash,
      hashes[route],
      `${route}: content changed; run node scripts/update-sitemap-lastmod.mjs`,
    );
  }
});

test("no lastModified is in the future or equals the build time", () => {
  const now = Date.now();
  const startOfToday = Date.parse(new Date(now).toISOString().slice(0, 10));

  for (const [route, entry] of Object.entries(manifest)) {
    assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}$/, route);

    const time = parseDate(entry.lastModified)?.getTime();

    assert.ok(time !== undefined, `${route}: unparseable date`);
    assert.ok(time <= now, `${route}: ${entry.lastModified} is in the future`);
    // Dates are day-precision; a value carrying the current instant would be a build timestamp.
    assert.notEqual(time, now, `${route}: equals the build time`);
    assert.ok(
      time <= startOfToday,
      `${route}: ${entry.lastModified} is after today`,
    );
  }
});

test("blog index and category dates come from the newest listed post", () => {
  assert.equal(
    newestDate([
      "2026-01-05T10:00:00Z",
      undefined,
      "2026-03-02T00:00:00Z",
      "junk",
    ])?.toISOString(),
    "2026-03-02T00:00:00.000Z",
  );
  assert.equal(newestDate([]), undefined);
  assert.equal(newestDate([undefined, "not a date"]), undefined);
});
