import assert from "node:assert/strict";
import test from "node:test";

import { verifyCaptcha } from "../lib/intake/verifyCaptcha.ts";

test("verification diagnostics distinguish failures and never echo untrusted data", async (t) => {
  const previousFetch = globalThis.fetch;
  const keys = [
    "RECAPTCHA_SECRET",
    "RECAPTCHA_MIN_SCORE",
    "SITE_URL",
    "DEPLOYMENT_ENV",
  ] as const;
  const previous = keys.map((key) => process.env[key]);
  const logs: unknown[][] = [];
  t.mock.method(console, "warn", (...args: unknown[]) => {
    logs.push(args);
  });
  t.after(() => {
    globalThis.fetch = previousFetch;
    keys.forEach((key, i) => {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    });
  });
  process.env.RECAPTCHA_SECRET = "private-secret";
  process.env.RECAPTCHA_MIN_SCORE = "0.3";
  process.env.SITE_URL = "https://all8webworks.com";
  const valid = {
    success: true,
    score: 0.9,
    action: "lead_review",
    hostname: "all8webworks.com",
  };
  const cases: Array<[unknown, string]> = [
    [null, "invalid_response"],
    [[], "invalid_response"],
    ["customer@example.com", "invalid_response"],
    [{}, "provider_rejected"],
    [{ ...valid, success: "true" }, "provider_rejected"],
    [{ ...valid, action: "contact_form" }, "action_mismatch"],
    [{ ...valid, hostname: "private-host.example" }, "hostname_mismatch"],
    [{ ...valid, score: "0.9" }, "invalid_score"],
    [{ ...valid, score: null }, "invalid_score"],
    [{ ...valid, score: 0.29 }, "low_score"],
    [
      { success: false, "error-codes": ["invalid-input-secret"] },
      "invalid_secret",
    ],
    [
      { success: false, "error-codes": ["timeout-or-duplicate"] },
      "expired_or_reused_token",
    ],
    [
      { success: false, "error-codes": ["invalid-input-response"] },
      "invalid_token",
    ],
    [
      { success: false, "error-codes": ["customer@example.com"] },
      "provider_rejected",
    ],
  ];
  for (const [body, reason] of cases) {
    globalThis.fetch = async () => new Response(JSON.stringify(body));
    assert.equal(await verifyCaptcha("private-token", "lead_review"), false);
    assert.deepEqual(logs.at(-1), [
      "[reCAPTCHA] Verification rejected",
      { reason, action: "lead_review" },
    ]);
  }
  for (const [fetcher, reason] of [
    [
      async () => new Response("customer@example.com", { status: 503 }),
      "provider_http_error",
    ],
    [
      async () => new Response("not JSON: customer@example.com"),
      "invalid_response",
    ],
    [
      async () => {
        throw new Error("private-secret private-token customer@example.com");
      },
      "verification_error",
    ],
    [
      async () => {
        throw new DOMException("private-token", "TimeoutError");
      },
      "provider_timeout",
    ],
  ] as const) {
    globalThis.fetch = fetcher;
    assert.equal(await verifyCaptcha("private-token", "lead_review"), false);
    assert.deepEqual(logs.at(-1), [
      "[reCAPTCHA] Verification rejected",
      { reason, action: "lead_review" },
    ]);
  }
  assert.equal(await verifyCaptcha(undefined, "lead_review"), false);
  assert.equal((logs.at(-1)![1] as { reason: string }).reason, "missing_token");
  delete process.env.RECAPTCHA_SECRET;
  process.env.DEPLOYMENT_ENV = "production";
  assert.equal(await verifyCaptcha("private-token", "lead_review"), false);
  assert.equal(
    (logs.at(-1)![1] as { reason: string }).reason,
    "missing_secret",
  );
  assert.doesNotMatch(
    JSON.stringify(logs),
    /private-secret|private-token|customer@example.com|private-host/,
  );
});

test("each expected action succeeds only with the matching verified action", async (t) => {
  const previousFetch = globalThis.fetch;
  const previousSecret = process.env.RECAPTCHA_SECRET;
  const previousScore = process.env.RECAPTCHA_MIN_SCORE;
  process.env.RECAPTCHA_SECRET = "test-secret";
  process.env.RECAPTCHA_MIN_SCORE = "0.3";
  t.after(() => {
    globalThis.fetch = previousFetch;
    if (previousSecret === undefined) delete process.env.RECAPTCHA_SECRET;
    else process.env.RECAPTCHA_SECRET = previousSecret;
    if (previousScore === undefined) delete process.env.RECAPTCHA_MIN_SCORE;
    else process.env.RECAPTCHA_MIN_SCORE = previousScore;
  });
  for (const action of [
    "lead_review",
    "contact_form",
    "newsletter_signup",
  ] as const) {
    globalThis.fetch = async (_url, init) => {
      assert.ok(init?.signal);
      return new Response(
        JSON.stringify({
          success: true,
          action,
          hostname: "all8webworks.com",
          score: 0.3,
        }),
      );
    };
    assert.equal(await verifyCaptcha("token", action), true);
  }
});

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
