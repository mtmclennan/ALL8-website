import assert from "node:assert/strict";
import test from "node:test";

import { getPlan, getPlanPriceDisplay } from "../data/plans.ts";

test("ongoing plans lead with the monthly fee and keep setup and minimum terms", () => {
  assert.deepEqual(getPlanPriceDisplay(getPlan("managed-website")), {
    amount: "$299",
    unit: "/mo",
    detail: "+ $1,995 one-time setup · 12-month minimum",
  });
  assert.deepEqual(getPlanPriceDisplay(getPlan("lead-system")), {
    amount: "$995",
    unit: "/mo",
    detail: "+ $2,495 one-time setup · 6-month minimum",
  });
  assert.deepEqual(getPlanPriceDisplay(getPlan("growth-system")), {
    amount: "From $1,500",
    unit: "/mo",
    detail: "Setup quoted · 6-month minimum",
  });
  assert.deepEqual(getPlanPriceDisplay(getPlan("google-ads")), {
    amount: "$600",
    unit: "/mo + ad spend",
    detail: "+ $500 one-time setup · 3-month minimum",
  });
});

test("entry offers show one-time and free terms", () => {
  assert.deepEqual(getPlanPriceDisplay(getPlan("tune-up")), {
    amount: "$1,250",
    detail: "One-time fee",
  });
  assert.deepEqual(getPlanPriceDisplay(getPlan("free-review")), {
    amount: "Free",
    detail: "No commitment",
  });
});
