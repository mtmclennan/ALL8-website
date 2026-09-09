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
};

export async function verifyCaptcha(
  token: string | undefined,
  expectedAction: CaptchaAction,
) {
  const secret = process.env.RECAPTCHA_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production" || isProductionDeployment()) {
      console.error("[reCAPTCHA] RECAPTCHA_SECRET is required in production.");

      return false;
    }

    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = (await res.json()) as RecaptchaResponse;
    const configuredScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.3");
    const minimumScore = Number.isFinite(configuredScore)
      ? configuredScore
      : 0.3;
    const expectedHostname = new URL(siteUrl()).hostname;

    return Boolean(
      data.success &&
        data.action === expectedAction &&
        data.hostname === expectedHostname &&
        typeof data.score === "number" &&
        data.score >= minimumScore,
    );
  } catch (error) {
    console.error("[reCAPTCHA] Verification request failed:", error);

    return false;
  }
}
