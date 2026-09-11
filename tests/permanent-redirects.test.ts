import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOG_SLUG_MIGRATIONS,
  canonicalBlogSlug,
  canonicalInternalPath,
  sourceBlogSlug,
} from "../config/permanent-redirects.mjs";

test("blog slug migrations resolve in both directions", () => {
  for (const [source, destination] of Object.entries(BLOG_SLUG_MIGRATIONS)) {
    assert.equal(canonicalBlogSlug(source), destination);
    assert.equal(sourceBlogSlug(destination), source);
    assert.equal(
      canonicalInternalPath(`/blog/${source}`),
      `/blog/${destination}`,
    );
  }
});

test("legacy service paths resolve directly to their canonical route", () => {
  assert.equal(
    canonicalInternalPath("/services/google-business-profile-optimization"),
    "/services/local-seo-google-business-profile",
  );
  assert.equal(
    canonicalInternalPath("/services/local-seo-foundation"),
    "/services/local-seo-google-business-profile",
  );
});
