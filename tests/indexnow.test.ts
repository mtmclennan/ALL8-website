import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeIndexNowUrl,
  validIndexNowKey,
} from "../lib/indexnow/client.ts";

test("IndexNow key follows the protocol's length and alphabet", () => {
  for (const key of ["aB09-xyz", "b".repeat(128)])
    assert.equal(validIndexNowKey(key), true);
  for (const key of [
    undefined,
    "short",
    "b".repeat(129),
    "key_with_underscores",
    "aB09-xyz\n",
  ]) {
    assert.equal(validIndexNowKey(key), false);
  }
});

test("IndexNow normalizes canonical URLs without accepting alternate origins or ambiguous paths", () => {
  const origin = "https://all8webworks.com";

  assert.equal(normalizeIndexNowUrl(origin), origin + "/");
  assert.equal(
    normalizeIndexNowUrl(origin + "/pricing/?utm_source=demo#plans"),
    origin + "/pricing",
  );
  assert.equal(
    normalizeIndexNowUrl(origin + "/services/local-seo-foundation"),
    origin + "/services/local-seo-google-business-profile",
  );
  for (const input of [
    "/pricing",
    "http://all8webworks.com",
    "https://all8webworks.ca",
    "https://www.all8webworks.com",
    "https://all8webworks.com.evil.example",
    "https://all8webworks.com:443/",
    "https://user@all8webworks.com/",
    origin + "//pricing",
    origin + "/pricing/../about",
    origin + "/%2fpricing",
    origin + "/\\pricing",
    origin + "/pricing\n",
  ]) {
    assert.throws(() => normalizeIndexNowUrl(input), /Invalid IndexNow URL/);
  }
});
