import assert from "node:assert/strict";
import test from "node:test";

import { verifyCaptcha } from "../lib/intake/verifyCaptcha.ts";

test("reCAPTCHA rejects a missing token when verification is configured", async () => {
  const previousSecret = process.env.RECAPTCHA_SECRET;

  process.env.RECAPTCHA_SECRET = "test-secret";

  try {
    assert.equal(await verifyCaptcha(undefined, "lead_review"), false);
  } finally {
    if (previousSecret === undefined) {
      delete process.env.RECAPTCHA_SECRET;
    } else {
      process.env.RECAPTCHA_SECRET = previousSecret;
    }
  }
});

test("reCAPTCHA validates success, score, action, and hostname", async () => {
  const previousSecret = process.env.RECAPTCHA_SECRET;
  const previousSiteUrl = process.env.SITE_URL;
  const previousFetch = globalThis.fetch;

  process.env.RECAPTCHA_SECRET = "test-secret";
  process.env.SITE_URL = "https://all8webworks.com";

  try {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          success: true,
          score: 0.9,
          action: "lead_review",
          hostname: "all8webworks.com",
        }),
        { status: 200 },
      );

    assert.equal(await verifyCaptcha("token", "lead_review"), true);
    assert.equal(await verifyCaptcha("token", "contact_form"), false);

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          success: true,
          score: 0.1,
          action: "lead_review",
          hostname: "wrong.example.com",
        }),
        { status: 200 },
      );

    assert.equal(await verifyCaptcha("token", "lead_review"), false);
  } finally {
    globalThis.fetch = previousFetch;

    if (previousSecret === undefined) delete process.env.RECAPTCHA_SECRET;
    else process.env.RECAPTCHA_SECRET = previousSecret;

    if (previousSiteUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previousSiteUrl;
  }
});
