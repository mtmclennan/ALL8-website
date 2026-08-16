"use client";

import type { LeadActionState } from "@/lib/leads/submitLead";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";

import { useHubSpotContextFields } from "@/hooks/use-hubspotContextFields";
import { submitLeadReview } from "@/app/actions/submit-lead-review";
import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";
import Button from "@/app/(site)/_components/ui/Button";
import { trackFormStart, trackGenerateLead } from "@/lib/analytics/dataLayer";

const CHALLENGES = [
  "Getting found",
  "Getting enough calls/leads",
  "Missed calls",
  "Follow-up",
  "Tracking results",
  "Not sure",
];

const initialState: LeadActionState = { ok: false };

const inputClass =
  "w-full min-h-[46px] rounded-[10px] border border-white/[0.08] bg-white/[0.045] px-3.5 py-3 text-base text-white placeholder:text-[#5A7391] transition-colors focus:border-primary focus:bg-white/[0.07] focus:outline-none";

const inputErrorClass = "border-red-400/60 focus:border-red-400/60";

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label
        className="text-[12.5px] font-bold text-white/70"
        htmlFor={htmlFor}
      >
        {label}{" "}
        {optional && (
          <span className="font-medium text-white/40">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="text-[12.5px] font-medium text-red-400"
          id={`${htmlFor}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function InlineLeadForm() {
  const [state, formAction, isPending] = useActionState(
    submitLeadReview,
    initialState,
  );
  const { hutk, pageUrl, pageName, utm } =
    useHubSpotContextFields("Contact Page Form");
  const [challenge, setChallenge] = useState("");
  const hpRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const formStartedRef = useRef(false);
  const leadTrackedRef = useRef(false);

  const done = state.ok;
  const telHref = toTelHref(siteConfig.phone);

  useEffect(() => {
    if (done && !leadTrackedRef.current) {
      leadTrackedRef.current = true;
      trackGenerateLead("contact_page", {
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        utmContent: utm.content,
        utmTerm: utm.term,
        pageName,
      });
    }
  }, [done, utm, pageName]);

  const handleFormFocus = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackFormStart("contact_page");
  };

  const enhancedAction = async (formData: FormData) => {
    formData.set("hp", hpRef.current?.value || "");
    formData.set("hutk", hutk || "");
    formData.set("pageUrl", pageUrl || "");
    formData.set("pageName", pageName || "");
    formData.set("utm_source", utm.source || "");
    formData.set("utm_medium", utm.medium || "");
    formData.set("utm_campaign", utm.campaign || "");
    formData.set("utm_content", utm.content || "");
    formData.set("utm_term", utm.term || "");
    formData.set("challenge", challenge);

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (siteKey && typeof window !== "undefined" && "grecaptcha" in window) {
      try {
        // @ts-expect-error grecaptcha injected by script
        await grecaptcha.ready();
        const t = await grecaptcha.execute(siteKey, { action: "contact_form" });

        if (tokenRef.current) tokenRef.current.value = t || "";
        formData.set("token", tokenRef.current?.value || "");
      } catch {
        // non-fatal
      }
    }

    return formAction(formData);
  };

  return (
    <div className="mx-auto max-w-[620px] rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-9 sm:p-[38px]">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}`}
        strategy="lazyOnload"
      />
      {!done ? (
        <>
          <h2 className="mb-2 text-2xl font-extrabold tracking-[-.022em]">
            Get Your Free Lead System Review
          </h2>
          <p className="mb-7 text-[15px] leading-relaxed text-white/70">
            Fifteen minutes. We walk the path a customer takes to reach you and
            show you where the biggest gaps appear to be.
          </p>

          <form
            noValidate
            action={enhancedAction}
            className="space-y-4"
            onFocusCapture={handleFormFocus}
          >
            <div aria-hidden="true" className="sr-only">
              <input
                ref={hpRef}
                autoComplete="off"
                defaultValue=""
                name="hp"
                tabIndex={-1}
                type="text"
              />
              <input ref={tokenRef} name="token" type="hidden" />
              <input name="leadType" type="hidden" value="Contact Page Form" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Field
                error={state.fieldErrors?.name?.[0]}
                htmlFor="cName"
                label="Name"
              >
                <input
                  required
                  aria-describedby={
                    state.fieldErrors?.name ? "cName-error" : undefined
                  }
                  aria-invalid={Boolean(state.fieldErrors?.name)}
                  autoComplete="name"
                  className={clsx(
                    inputClass,
                    state.fieldErrors?.name && inputErrorClass,
                  )}
                  id="cName"
                  name="name"
                  type="text"
                />
              </Field>
              <Field
                error={state.fieldErrors?.business?.[0]}
                htmlFor="cBiz"
                label="Business name"
              >
                <input
                  required
                  aria-describedby={
                    state.fieldErrors?.business ? "cBiz-error" : undefined
                  }
                  aria-invalid={Boolean(state.fieldErrors?.business)}
                  autoComplete="organization"
                  className={clsx(
                    inputClass,
                    state.fieldErrors?.business && inputErrorClass,
                  )}
                  id="cBiz"
                  name="business"
                  type="text"
                />
              </Field>
            </div>

            <Field
              error={state.fieldErrors?.website?.[0]}
              htmlFor="cSite"
              label="Website"
            >
              <input
                aria-describedby={
                  state.fieldErrors?.website ? "cSite-error" : undefined
                }
                aria-invalid={Boolean(state.fieldErrors?.website)}
                autoComplete="url"
                className={clsx(
                  inputClass,
                  state.fieldErrors?.website && inputErrorClass,
                )}
                id="cSite"
                inputMode="url"
                name="website"
                placeholder="yourbusiness.com"
                type="text"
              />
            </Field>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Field
                error={state.fieldErrors?.email?.[0]}
                htmlFor="cEmail"
                label="Email"
              >
                <input
                  required
                  aria-describedby={
                    state.fieldErrors?.email ? "cEmail-error" : undefined
                  }
                  aria-invalid={Boolean(state.fieldErrors?.email)}
                  autoComplete="email"
                  className={clsx(
                    inputClass,
                    state.fieldErrors?.email && inputErrorClass,
                  )}
                  id="cEmail"
                  name="email"
                  type="email"
                />
              </Field>
              <Field optional htmlFor="cPhone" label="Mobile">
                <input
                  autoComplete="tel"
                  className={inputClass}
                  id="cPhone"
                  name="phone"
                  placeholder="So we can text you back"
                  type="tel"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[12.5px] font-bold text-white/70">
                Biggest challenge right now?{" "}
                <span className="font-medium text-white/40">(optional)</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {CHALLENGES.map((c) => {
                  const active = challenge === c;

                  return (
                    <button
                      key={c}
                      aria-pressed={active}
                      className={
                        active
                          ? "inline-flex min-h-11 items-center rounded-full border border-[rgba(0,118,255,.45)] bg-[rgba(0,118,255,.14)] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#cfe4ff]"
                          : "inline-flex min-h-11 items-center rounded-full border border-white/[0.08] bg-white/[0.045] px-3.5 py-2.5 text-[13.5px] font-semibold text-white/70 hover:border-white/[0.14] hover:text-white"
                      }
                      type="button"
                      onClick={() => setChallenge(active ? "" : c)}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {state.message && !state.ok && (
              <p className="text-sm text-red-400" role="alert">
                {state.message}
              </p>
            )}

            <Button className="mt-2 w-full" disabled={isPending} type="submit">
              {isPending ? "Sending…" : "Send My Review Request"}
            </Button>

            <p className="text-center text-[12.5px] leading-relaxed text-white/60">
              No long-term commitment · Clear recommendations · You keep the
              findings
              <br />
              We use your details to prepare and send the review.{" "}
              <Link
                className="text-accent-blue hover:text-[#8ec5ff]"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </p>
          </form>
        </>
      ) : (
        <div className="py-4 text-center">
          <div className="mx-auto mb-5 grid h-[60px] w-[60px] place-items-center rounded-full border border-[rgba(34,197,94,.32)] bg-[rgba(34,197,94,.13)]">
            <CheckCircle2
              className="text-stage-win"
              size={26}
              strokeWidth={2.6}
            />
          </div>
          <h3 className="mb-2.5 text-[22px] font-extrabold tracking-[-.02em]">
            Request received
          </h3>
          <p className="mb-5 text-[15px] leading-relaxed text-white/70">
            We&apos;ll review your search visibility, website and lead path,
            then get back to you within one business day.
          </p>
          <Button href={telHref} variant="ghost">
            Prefer to talk now? Call us
          </Button>
        </div>
      )}
    </div>
  );
}
