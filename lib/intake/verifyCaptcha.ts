import { isProductionDeployment, siteUrl } from "../../config/site-origin.ts";

export type CaptchaAction =
  | "contact_form"
  | "lead_review"
  | "newsletter_signup";

type RecaptchaResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: unknown;
};

// Never log provider bodies, tokens, secrets, hostnames, or submitted fields.
function rejectCaptcha(reason: string, action: CaptchaAction) {
  console.warn("[reCAPTCHA] Verification rejected", { reason, action });

  return false;
}

export async function verifyCaptcha(
  token: string | undefined,
  expectedAction: CaptchaAction,
) {
  const secret = process.env.RECAPTCHA_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production" || isProductionDeployment()) {
      return rejectCaptcha("missing_secret", expectedAction);
    }

    return true;
  }

  if (!token) return rejectCaptcha("missing_token", expectedAction);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return rejectCaptcha("provider_http_error", expectedAction);

    let data: RecaptchaResponse;

    try {
      const body: unknown = await res.json();

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return rejectCaptcha("invalid_response", expectedAction);
      }
      data = body as RecaptchaResponse;
    } catch {
      return rejectCaptcha("invalid_response", expectedAction);
    }
    const configuredScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.3");
    const minimumScore = Number.isFinite(configuredScore)
      ? configuredScore
      : 0.3;
    const expectedHostname = new URL(siteUrl()).hostname;

    if (data.success !== true) {
      const codes = Array.isArray(data["error-codes"])
        ? data["error-codes"]
        : [];
      const reason = codes.includes("invalid-input-secret")
        ? "invalid_secret"
        : codes.includes("timeout-or-duplicate")
          ? "expired_or_reused_token"
          : codes.includes("invalid-input-response")
            ? "invalid_token"
            : "provider_rejected";

      return rejectCaptcha(reason, expectedAction);
    }
    if (data.action !== expectedAction)
      return rejectCaptcha("action_mismatch", expectedAction);
    if (data.hostname !== expectedHostname)
      return rejectCaptcha("hostname_mismatch", expectedAction);
    if (typeof data.score !== "number" || !Number.isFinite(data.score))
      return rejectCaptcha("invalid_score", expectedAction);
    if (data.score < minimumScore)
      return rejectCaptcha("low_score", expectedAction);

    return true;
  } catch (error) {
    const timeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return rejectCaptcha(
      timeout ? "provider_timeout" : "verification_error",
      expectedAction,
    );
  }
}
