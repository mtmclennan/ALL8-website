import assert from "node:assert/strict";
import test from "node:test";

import { getTrustedClientIp } from "../lib/intake/clientIp.ts";

test("client IP ignores forwarding headers unless the trusted proxy is enabled", () => {
  const previous = process.env.TRUST_PROXY_IP_HEADER;
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.10",
    "x-all8-client-ip": "198.51.100.12",
  });

  try {
    delete process.env.TRUST_PROXY_IP_HEADER;
    assert.equal(getTrustedClientIp(headers), "unknown");

    process.env.TRUST_PROXY_IP_HEADER = "true";
    assert.equal(getTrustedClientIp(headers), "198.51.100.12");
    assert.equal(
      getTrustedClientIp(
        new Headers({ "x-all8-client-ip": "198.51.100.12, 10.0.0.1" }),
      ),
      "unknown",
    );
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY_IP_HEADER;
    else process.env.TRUST_PROXY_IP_HEADER = previous;
  }
});
