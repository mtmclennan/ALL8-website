import { isIP } from "node:net";

const TRUSTED_CLIENT_IP_HEADER = "x-all8-client-ip";

/**
 * Reads the single client address normalized by ALL8's trusted local Nginx
 * proxy. Direct requests and ordinary forwarding headers are intentionally
 * ignored so a client cannot choose its own rate-limit key.
 */
export function getTrustedClientIp(headers: Headers) {
  if (process.env.TRUST_PROXY_IP_HEADER !== "true") return "unknown";

  const value = headers.get(TRUSTED_CLIENT_IP_HEADER)?.trim();

  if (!value || value.includes(",") || isIP(value) === 0) return "unknown";

  return value;
}
