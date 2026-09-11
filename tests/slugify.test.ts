import assert from "node:assert/strict";
import test from "node:test";

import { slugify } from "../lib/utils/slugify.ts";

test("slugify removes apostrophes inside words for new content", () => {
  assert.equal(slugify("It Isn't What You Think"), "it-isnt-what-you-think");
  assert.equal(
    slugify("More Traffic Won’t Fix It"),
    "more-traffic-wont-fix-it",
  );
});

test("slugify emits predictable lowercase ASCII segments", () => {
  assert.equal(
    slugify("  High‑Performance Contractor Website!  "),
    "high-performance-contractor-website",
  );
  assert.equal(slugify("Café & CRM"), "cafe-crm");
});
