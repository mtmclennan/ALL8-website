import assert from "node:assert/strict";
import test from "node:test";

import { buildArticleHeadings } from "../lib/blogHeadings.ts";
import { validateBlogHref } from "../lib/blogHref.ts";
import {
  getArticleImageAlt,
  getArticleImageDimensions,
  getArticleImageSourceUrl,
} from "../lib/blogImage.ts";
import { getTableHeaderCount, hasConsistentTableRows } from "../lib/blogTable.ts";

test("heading IDs are unique and the TOC uses the same deterministic IDs", () => {
  const body = [
    { _type: "block", _key: "a", style: "h2", children: [{ text: "Lead Response" }] },
    { _type: "block", _key: "b", style: "h3", children: [{ text: "Lead Response" }] },
    { _type: "block", _key: "c", style: "h2", children: [{ text: "Lead Response" }] },
    { _type: "block", _key: "d", style: "h1", children: [{ text: "Lead Response 2" }] },
    { _type: "block", _key: "e", style: "h2", children: [{ text: "!!!" }] },
  ];

  const { toc, idsByKey } = buildArticleHeadings(body);

  assert.deepEqual(toc.map((item) => item.id), [
    "lead-response",
    "lead-response-3",
    "lead-response-2-2",
    "section",
  ]);
  assert.equal(idsByKey.get("b"), "lead-response-2");
  assert.equal(idsByKey.get("c"), toc[1].id);
});

test("body image dimensions use Sanity metadata and account for crop", () => {
  assert.deepEqual(
    getArticleImageDimensions({
      assetMetadata: { dimensions: { width: 1536, height: 1024 } },
      crop: { left: 0.1, right: 0.1, top: 0.25, bottom: 0.25 },
    }),
    { width: 1229, height: 512 },
  );
  assert.deepEqual(
    getArticleImageDimensions({ asset: { _ref: "image-abc-800x600-webp" } }),
    { width: 800, height: 600 },
  );
});

test("legacy image alt is nonempty while explicit decoration stays empty", () => {
  const legacy = {
    assetMetadata: {
      originalFilename: "lead-response-targets-service-businesses.webp",
    },
  };

  assert.equal(
    getArticleImageAlt(legacy, "Lead response"),
    "Lead response targets service businesses",
  );
  assert.equal(getArticleImageAlt({ ...legacy, decorative: true }, "Lead response"), "");
  assert.equal(
    getArticleImageAlt({ ...legacy, alt: "A comparison chart" }, "Lead response"),
    "A comparison chart",
  );
  assert.equal(
    getArticleImageSourceUrl({ sourceUrl: "javascript:alert(1)" }),
    null,
  );
});

test("links accept site paths and HTTPS while rejecting unsafe destinations", () => {
  assert.equal(validateBlogHref("/services/missed-call-recovery"), true);
  assert.equal(validateBlogHref("https://example.com/resource"), true);
  assert.notEqual(validateBlogHref("//example.com"), true);
  assert.notEqual(validateBlogHref("http://example.com"), true);
  assert.notEqual(validateBlogHref("javascript:alert(1)"), true);
});

test("table rows must have equal widths and header count is bounded", () => {
  assert.equal(
    hasConsistentTableRows([{ cells: [1, 2] }, { cells: [3, 4] }]),
    true,
  );
  assert.equal(
    hasConsistentTableRows([{ cells: [1, 2] }, { cells: [3] }]),
    false,
  );
  assert.equal(getTableHeaderCount(5, 3), 3);
  assert.equal(getTableHeaderCount(-2, 3), 0);
});
