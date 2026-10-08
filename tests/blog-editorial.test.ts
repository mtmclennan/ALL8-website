import assert from "node:assert/strict";
import test from "node:test";

import { formatPostDate, getMeaningfulUpdateDate } from "../lib/blogDate.ts";
import { getBodyImageLayout } from "../lib/blogImage.ts";

test("post dates format in UTC so late-evening posts keep their date", () => {
  assert.equal(formatPostDate("2026-10-06T23:30:00.000Z", "long"), "October 6, 2026");
  assert.equal(formatPostDate("2026-10-06T23:30:00.000Z"), "Oct 6, 2026");
  assert.equal(formatPostDate(undefined), null);
  assert.equal(formatPostDate("not a date"), null);
});

test("an update only counts when it lands on a later day", () => {
  assert.equal(
    getMeaningfulUpdateDate("2026-10-06T15:22:00Z", "2026-10-06T18:46:47Z"),
    null,
  );
  assert.equal(
    getMeaningfulUpdateDate("2026-10-06T15:22:00Z", "2026-10-09T08:00:00Z"),
    "2026-10-09T08:00:00Z",
  );
  assert.equal(getMeaningfulUpdateDate("2026-10-06T15:22:00Z", undefined), null);
});

test("portrait infographics keep their orientation and offer a full-size view", () => {
  assert.deepEqual(getBodyImageLayout({ width: 1080, height: 3200 }), {
    orientation: "portrait",
    offerFullSize: true,
  });
  assert.deepEqual(getBodyImageLayout({ width: 1200, height: 630 }), {
    orientation: "landscape",
    offerFullSize: false,
  });
  assert.equal(getBodyImageLayout({ width: 2400, height: 1260 }).offerFullSize, true);
  assert.equal(getBodyImageLayout({ width: 1000, height: 1000 }).orientation, "square");
  assert.deepEqual(getBodyImageLayout(null), {
    orientation: "landscape",
    offerFullSize: false,
  });
});
