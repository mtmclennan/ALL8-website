import assert from "node:assert/strict";
import test from "node:test";

import { canonicalizePortableTextLinks } from "../lib/seo/canonicalizePortableTextLinks.ts";

test("portable text internal links bypass legacy hosts and route redirects", () => {
  const body = [
    {
      markDefs: [
        {
          href: "https://all8webworks.ca/services/google-business-profile-optimization",
        },
        { href: "/services/local-seo-foundation" },
        { href: "https://example.com/reference" },
      ],
    },
  ];

  assert.deepEqual(canonicalizePortableTextLinks(body), [
    {
      markDefs: [
        { href: "/services/local-seo-google-business-profile" },
        { href: "/services/local-seo-google-business-profile" },
        { href: "https://example.com/reference" },
      ],
    },
  ]);
});
