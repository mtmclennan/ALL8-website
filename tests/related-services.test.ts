import assert from "node:assert/strict";
import test from "node:test";

import { selectRelatedServiceSlugs } from "../lib/relatedServiceSelection.ts";

test("leads in a title or tag does not match the ads keyword", () => {
  const services = selectRelatedServiceSlugs({
    title: "Keep more leads from slipping away",
    tags: ["leads"],
  });

  assert.ok(!services.includes("google-ads-lead-generation"));
});

test("ads and google ads tags match Google Ads", () => {
  for (const tag of ["ads", "google ads"]) {
    assert.ok(
      selectRelatedServiceSlugs({ tags: [tag] }).includes(
        "google-ads-lead-generation",
      ),
      tag,
    );
  }
});

test("specific follow-up and CRM intents survive a website match", () => {
  assert.deepEqual(
    selectRelatedServiceSlugs({ tags: ["website", "follow-up", "crm"] }),
    [
      "lead-follow-up-automation",
      "crm-sales-pipeline",
      "lead-generation-websites",
    ],
  );
});

test("system case study uses its exact service mapping in order", () => {
  assert.deepEqual(
    selectRelatedServiceSlugs({
      slug: "the-problem-wasn-t-skill-it-was-the-system",
    }),
    [
      "custom-lead-systems",
      "crm-sales-pipeline",
      "lead-follow-up-automation",
    ],
  );
});

test("hyphens and spaces match the same phrase", () => {
  for (const title of ["Missed-call response", "Missed call response"]) {
    assert.equal(selectRelatedServiceSlugs({ title })[0], "missed-call-recovery");
  }
});
