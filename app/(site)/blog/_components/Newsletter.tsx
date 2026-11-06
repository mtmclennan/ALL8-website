"use client";

import type { LeadActionState } from "@/lib/leads/leadSubmission";

import { useActionState, useEffect } from "react";

import { loadRecaptcha, withCaptcha } from "@/lib/intake/clientCaptcha";
import { useHubSpotContextFields } from "@/hooks/use-hubspotContextFields";
import { submitNewsletter } from "@/app/actions/submit-newsletter";
import Button from "@/app/(site)/_components/ui/Button";
import HoneypotField from "@/app/(site)/_components/HoneypotField";
import RecaptchaDisclosure from "@/app/(site)/_components/RecaptchaDisclosure";

const initialState: LeadActionState = { ok: false };

export default function Newsletter() {
  const [state, formAction, isPending] = useActionState(
    withCaptcha(
      submitNewsletter,
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      "newsletter_signup",
    ),
    initialState,
  );
  const { hutk, pageUrl, pageName, utm } =
    useHubSpotContextFields("Blog Newsletter");

  useEffect(() => {
    // Warm the shared loader after hydration; a failed load is retried on submit.
    void loadRecaptcha(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY).catch(
      () => {},
    );
  }, []);

  const enhancedAction = (formData: FormData) => {
    formData.set("hutk", hutk || "");
    formData.set("pageUrl", pageUrl || "");
    formData.set("pageName", pageName || "");
    formData.set("utm_source", utm.source || "");
    formData.set("utm_medium", utm.medium || "");
    formData.set("utm_campaign", utm.campaign || "");
    formData.set("utm_content", utm.content || "");
    formData.set("utm_term", utm.term || "");

    return formAction(formData);
  };

  return (
    <>
      <div className="mt-14 grid grid-cols-1 items-center gap-[34px] rounded-[20px] border border-[rgba(0,118,255,.24)] bg-gradient-to-br from-[rgba(0,118,255,.12)] to-[rgba(11,15,26,.2)] p-11 max-[960px]:p-7 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h2 className="mb-2.5 text-[clamp(23px,2.4vw,30px)] font-extrabold leading-[1.14] tracking-[-.024em]">
            One Note a Month. Nothing Else.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-white/70">
            A short piece on one thing that&apos;s costing service businesses
            work, and what to do about it. No sequences, no pitches, unsubscribe
            in one click.
          </p>
        </div>
        <div>
          {state.ok ? (
            <p className="text-[15px] font-semibold text-emerald-400">
              You&apos;re on the list. First note lands next month.
            </p>
          ) : (
            <form
              noValidate
              action={enhancedAction}
              className="flex flex-wrap gap-2.5"
            >
              <HoneypotField />
              <input name="leadType" type="hidden" value="Blog Newsletter" />
              <input
                required
                aria-label="Email address"
                autoComplete="email"
                className="min-w-[200px] flex-1 rounded-[10px] border border-white/[0.08] bg-white/[0.045] px-3.5 py-3 text-base text-white placeholder:text-[#5A7391] focus:border-primary focus:bg-white/[0.07]"
                name="email"
                placeholder="you@yourbusiness.com"
                type="email"
              />
              <Button disabled={isPending} type="submit">
                {isPending ? "Sending…" : "Subscribe"}
              </Button>
            </form>
          )}
          {!state.ok && state.message && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {state.message}
            </p>
          )}
          {!state.ok && (
            <>
              <p className="mt-3 text-[12.5px] text-white/70">
                Monthly. Unsubscribe any time.
              </p>
              <RecaptchaDisclosure />
            </>
          )}
        </div>
      </div>
    </>
  );
}
