import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type Stage = "found" | "contacted" | "follow" | "win";
type AuditedService = {
  slug: string;
  journeyStages: Stage[];
};

const services = JSON.parse(
  readFileSync(new URL("../data/services.json", import.meta.url), "utf8"),
) as AuditedService[];
const validStages = new Set<Stage>(["found", "contacted", "follow", "win"]);

test("every service maps to at least one valid lead-journey stage", () => {
  assert.equal(services.length, 9);

  for (const service of services) {
    assert.ok(service.journeyStages.length > 0, service.slug);
    assert.equal(
      new Set(service.journeyStages).size,
      service.journeyStages.length,
    );

    for (const stage of service.journeyStages) {
      assert.ok(validStages.has(stage), `${service.slug}: ${stage}`);
    }
  }
});

test("cross-stage services are not forced into one journey box", () => {
  const website = services.find(
    (service) => service.slug === "lead-generation-websites",
  );
  const custom = services.find(
    (service) => service.slug === "custom-lead-systems",
  );

  assert.deepEqual(website?.journeyStages, ["found", "contacted"]);
  assert.deepEqual(custom?.journeyStages, [
    "found",
    "contacted",
    "follow",
    "win",
  ]);
});
