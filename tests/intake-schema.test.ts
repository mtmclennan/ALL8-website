import assert from "node:assert/strict";
import test from "node:test";

import { LeadReviewSchema } from "../lib/intake/schema.ts";

const validLead = {
  name: "Taylor Owner",
  business: "Example Service Co",
  website: "example.com",
  email: "taylor@example.com",
  phone: "",
  challenge: "Website isn't converting",
  hp: "",
};

test("lead review accepts the minimal valid business contact", () => {
  const parsed = LeadReviewSchema.safeParse(validLead);

  assert.equal(parsed.success, true);
});

test("lead review rejects missing required identity fields", () => {
  const parsed = LeadReviewSchema.safeParse({
    ...validLead,
    name: "",
    business: "",
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path[0]);

    assert.ok(fields.includes("name"));
    assert.ok(fields.includes("business"));
  }
});

test("lead review rejects malformed email and website values", () => {
  const parsed = LeadReviewSchema.safeParse({
    ...validLead,
    email: "not-an-email",
    website: "localhost",
  });

  assert.equal(parsed.success, false);
});

test("honeypot must stay empty", () => {
  const parsed = LeadReviewSchema.safeParse({ ...validLead, hp: "spam" });

  assert.equal(parsed.success, false);
});
