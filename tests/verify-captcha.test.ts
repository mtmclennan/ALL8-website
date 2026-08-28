import assert from "node:assert/strict";
import test from "node:test";

import { verifyCaptcha } from "../lib/intake/verifyCaptcha.ts";

test("reCAPTCHA rejects a missing token when verification is configured", async () => {
  const previousSecret = process.env.RECAPTCHA_SECRET;

  process.env.RECAPTCHA_SECRET = "test-secret";

  try {
    assert.equal(await verifyCaptcha(), false);
  } finally {
    if (previousSecret === undefined) {
      delete process.env.RECAPTCHA_SECRET;
    } else {
      process.env.RECAPTCHA_SECRET = previousSecret;
    }
  }
});
