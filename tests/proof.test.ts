import assert from "node:assert/strict";
import test from "node:test";

import { hydrateProofContent, proofDisplay } from "../data/proof.ts";

test("proof tokens resolve from the typed source of truth", () => {
  const content = hydrateProofContent({
    range: "{{proof.search.range}}",
    sentence:
      "Growth was {{proof.search.factor}} through {{proof.search.period}}.",
    profile: "{{proof.profile.increaseSigned}}",
  });

  assert.deepEqual(content, {
    range: proofDisplay.searchRange,
    sentence: `Growth was ${proofDisplay.searchFactor} through ${proofDisplay.searchPeriod}.`,
    profile: proofDisplay.profileIncreaseSigned,
  });
});
