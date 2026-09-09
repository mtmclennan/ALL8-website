import assert from "node:assert/strict";
import test from "node:test";

import { safeCanonicalUrl, siteUrl } from "../config/site-origin.ts";

test("site origin accepts and normalizes only an HTTPS origin", () => {
  const previous = process.env.SITE_URL;

  try {
    process.env.SITE_URL = " https://all8webworks.com/ ";
    assert.equal(siteUrl(), "https://all8webworks.com");

    for (const invalid of [
      "http://all8webworks.com",
      "https://all8webworks.com/path",
      "https://all8webworks.com?source=test",
      "not-a-url",
    ]) {
      process.env.SITE_URL = invalid;
      assert.throws(() => siteUrl());
    }
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
});

test("CMS canonicals remain on the configured ALL8 origin", () => {
  const previous = process.env.SITE_URL;

  process.env.SITE_URL = "https://all8webworks.com";

  try {
    assert.equal(
      safeCanonicalUrl(
        "https://all8webworks.com/blog/canonical",
        "/blog/fallback",
      ),
      "https://all8webworks.com/blog/canonical",
    );
    assert.equal(
      safeCanonicalUrl("https://example.com/article", "/blog/fallback"),
      "https://all8webworks.com/blog/fallback",
    );
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
});
