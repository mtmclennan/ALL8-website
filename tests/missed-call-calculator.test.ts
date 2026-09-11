import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMissedCallOpportunity,
  getOpportunityBand,
  MissedCallInputsSchema,
} from "../lib/calculators/missedCall.ts";

const normalInputs = {
  missedCallsPerWeek: 8,
  leadRate: 60,
  averageJobValue: 2_500,
  closeRate: 35,
  recoveryRate: 25,
};

test("calculates the documented missed-call opportunity example", () => {
  const result = calculateMissedCallOpportunity(normalInputs);

  assert.equal(result.potentialLeadsPerWeek, 4.8);
  assert.equal(result.potentialJobsPerWeek, 1.68);
  assert.equal(result.weeklyOpportunity, 4_200);
  assert.equal(result.annualOpportunity, 218_400);
  assert.equal(result.annualUnrecoveredOpportunity, 163_800);
  assert.equal(result.monthlyUnrecoveredOpportunity, 13_650);
  assert.equal(result.annualPotentialLeads, 249.6);
  assert.equal(result.annualPotentialJobs, 65.52);
});

test("returns zero opportunity when missed calls are zero", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    missedCallsPerWeek: 0,
  });

  assert.equal(result.annualOpportunity, 0);
  assert.equal(result.annualUnrecoveredOpportunity, 0);
});

test("returns zero opportunity when the lead rate is zero", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    leadRate: 0,
  });

  assert.equal(result.annualUnrecoveredOpportunity, 0);
});

test("returns zero opportunity when the close rate is zero", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    closeRate: 0,
  });

  assert.equal(result.annualUnrecoveredOpportunity, 0);
});

test("returns zero unrecovered opportunity at a 100% recovery rate", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    recoveryRate: 100,
  });

  assert.equal(result.annualUnrecoveredOpportunity, 0);
  assert.equal(result.annualPotentialJobs, 0);
});

test("matches total opportunity at a 0% recovery rate", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    recoveryRate: 0,
  });

  assert.equal(result.annualUnrecoveredOpportunity, result.annualOpportunity);
});

test("handles decimal percentage inputs", () => {
  const result = calculateMissedCallOpportunity({
    ...normalInputs,
    leadRate: 62.5,
    closeRate: 33.3,
    recoveryRate: 12.5,
  });

  assert.ok(Number.isFinite(result.annualUnrecoveredOpportunity));
  assert.ok(Math.abs(result.potentialLeadsPerWeek - 5) < Number.EPSILON);
  assert.ok(Math.abs(result.potentialJobsPerWeek - 1.665) < 1e-12);
});

test("rejects negative inputs", () => {
  assert.equal(
    MissedCallInputsSchema.safeParse({
      ...normalInputs,
      missedCallsPerWeek: -1,
    }).success,
    false,
  );
  assert.throws(() =>
    calculateMissedCallOpportunity({
      ...normalInputs,
      averageJobValue: -100,
    }),
  );
});

test("handles a very large valid calculation without overflow", () => {
  const result = calculateMissedCallOpportunity({
    missedCallsPerWeek: 10_000,
    leadRate: 100,
    averageJobValue: 100_000_000,
    closeRate: 100,
    recoveryRate: 0,
  });

  assert.equal(result.annualOpportunity, 52_000_000_000_000);
  assert.ok(Number.isFinite(result.annualOpportunity));
});

test("assigns only broad analytics result bands", () => {
  assert.equal(getOpportunityBand(24_999), "under_25k");
  assert.equal(getOpportunityBand(25_000), "25k_50k");
  assert.equal(getOpportunityBand(50_000), "50k_100k");
  assert.equal(getOpportunityBand(100_000), "100k_250k");
  assert.equal(getOpportunityBand(250_000), "250k_plus");
});
