import type { CaptchaAction } from "./verifyCaptcha.ts";
import type { LeadActionState } from "../leads/leadSubmission.ts";

type RecaptchaApi = {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: CaptchaAction }): Promise<string>;
};

const TIMEOUT_MS = 15_000;
const SCRIPT_ID = "all8-recaptcha";
let loading: Promise<RecaptchaApi> | undefined;
let reloadRequired = false;

function api() {
  return (window as Window & { grecaptcha?: RecaptchaApi }).grecaptcha;
}

/** One shared script, including across client-side navigation and concurrent forms. */
export function loadRecaptcha(
  siteKey: string | undefined,
): Promise<RecaptchaApi> {
  if (!siteKey || typeof window === "undefined") {
    return Promise.reject(new Error("CAPTCHA unavailable"));
  }
  if (loading) return loading;

  loading = new Promise<RecaptchaApi>((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    let settled = false;
    const timer = setTimeout(() => fail(), TIMEOUT_MS);
    const cleanup = () => {
      clearTimeout(timer);
      script?.removeEventListener("load", ready);
      script?.removeEventListener("error", fail);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      script?.remove();
      reloadRequired = true;
      reject(new Error("CAPTCHA loading failed"));
    };
    const ready = () => {
      if (settled) return;
      const captcha = api();

      if (!captcha) return fail();
      try {
        captcha.ready(() => {
          if (settled) return;
          if (typeof captcha.execute !== "function") return fail();
          settled = true;
          reloadRequired = false;
          cleanup();
          resolve(captcha);
        });
      } catch {
        fail();
      }
    };

    if (api() && !reloadRequired) {
      ready();

      return;
    }
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.defer = true;
    }
    script.addEventListener("load", ready);
    script.addEventListener("error", fail);
    if (!script.isConnected) document.head.appendChild(script);
  }).catch((error: unknown) => {
    loading = undefined; // Failed loads must never poison a subsequent retry.
    throw error;
  });

  return loading;
}

async function freshToken(siteKey: string | undefined, action: CaptchaAction) {
  const captcha = await loadRecaptcha(siteKey);

  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("CAPTCHA execution timed out")),
      TIMEOUT_MS,
    );

    Promise.resolve()
      .then(() => captcha.execute(siteKey!, { action }))
      .then((token) => {
        if (typeof token !== "string" || !token.trim()) {
          throw new Error("CAPTCHA returned no token");
        }
        resolve(token);
      })
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

type FormAction = (
  previous: LeadActionState,
  formData: FormData,
) => Promise<LeadActionState>;

/** Run inside useActionState so pending covers verification and server dispatch. */
export function withCaptcha(
  submit: FormAction,
  siteKey: string | undefined,
  action: CaptchaAction,
): FormAction {
  return async (previous, formData) => {
    formData.delete("token");
    try {
      formData.set("token", await freshToken(siteKey, action));
    } catch {
      return {
        ok: false,
        captured: false,
        message:
          "We couldn't complete spam verification. Check your connection and allow Google reCAPTCHA in your browser, then try sending again.",
      };
    }

    try {
      return await submit(previous, formData);
    } finally {
      formData.delete("token");
    }
  };
}
