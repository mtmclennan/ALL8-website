"use client";

import type { LeadActionState } from "@/lib/leads/submitLead";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { X, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

import Button from "./ui/Button";

import { useHubSpotContextFields } from "@/hooks/use-hubspotContextFields";
import { submitLeadReview } from "@/app/actions/submit-lead-review";
import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";

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
  "w-full min-h-[46px] rounded-[10px] border border-white/[0.08] bg-white/[0.045] px-3.5 py-3 text-[15px] text-white placeholder:text-[#5A7391] transition-colors focus:border-primary focus:bg-white/[0.07] focus:outline-none";

function Field({
  label,
  htmlFor,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx("flex flex-1 flex-col gap-1.5", className)}>
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
    </div>
  );
}

export default function LeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    submitLeadReview,
    initialState,
  );
  const { hutk, pageUrl, pageName, utm } =
    useHubSpotContextFields("Lead System Review");

  const [challenge, setChallenge] = useState("");
  const [done, setDone] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && state.ok) setDone(true);
  }, [isPending, state.ok]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setDone(false);
        setChallenge("");
      }, 250);

      return () => clearTimeout(t);
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => nameRef.current?.focus(), 120);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();

        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button, input, a[href], select, textarea",
        ),
      ).filter((el) => el.offsetParent !== null);

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

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
        const t = await grecaptcha.execute(siteKey, { action: "lead_review" });

        if (tokenRef.current) tokenRef.current.value = t || "";
        formData.set("token", tokenRef.current?.value || "");
      } catch {
        // non-fatal — server side treats a missing token as unverified but non-blocking
      }
    }

    return formAction(formData);
  };

  const telHref = toTelHref(siteConfig.phone);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[400] grid place-items-center p-6 transition-opacity duration-200",
        open
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0",
      )}
    >
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}`}
        strategy="lazyOnload"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(4,7,14,.82)] backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        aria-labelledby="leadModalTitle"
        aria-modal="true"
        className={clsx(
          "relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[20px] border border-white/[0.14] bg-content3 p-9 shadow-[0_40px_100px_-20px_rgba(0,0,0,.8)] transition-transform duration-200 sm:p-9",
          open ? "translate-y-0" : "translate-y-3.5",
        )}
        role="dialog"
      >
        <button
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-[10px] text-white/50 transition-colors hover:bg-white/[0.058] hover:text-white"
          type="button"
          onClick={onClose}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        {!done ? (
          <div>
            <h2
              className="pr-9 text-[25px] font-extrabold tracking-[-.022em]"
              id="leadModalTitle"
            >
              Get Your Free Lead System Review
            </h2>
            <p className="mb-6 mt-2 text-[14.5px] leading-relaxed text-white/70">
              Fifteen minutes. We walk the path a customer takes to reach you
              and show you where the biggest gaps appear to be.
            </p>

            <form noValidate action={enhancedAction} className="space-y-4">
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
                <input
                  name="leadType"
                  type="hidden"
                  value="Lead System Review"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Field htmlFor="fName" label="Name">
                  <input
                    ref={nameRef}
                    required
                    autoComplete="name"
                    className={inputClass}
                    id="fName"
                    name="name"
                    type="text"
                  />
                </Field>
                <Field htmlFor="fBiz" label="Business name">
                  <input
                    required
                    autoComplete="organization"
                    className={inputClass}
                    id="fBiz"
                    name="business"
                    type="text"
                  />
                </Field>
              </div>

              <Field htmlFor="fSite" label="Website">
                <input
                  autoComplete="url"
                  className={inputClass}
                  id="fSite"
                  inputMode="url"
                  name="website"
                  placeholder="yourbusiness.com"
                  type="text"
                />
              </Field>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Field htmlFor="fEmail" label="Email">
                  <input
                    required
                    autoComplete="email"
                    className={inputClass}
                    id="fEmail"
                    name="email"
                    type="email"
                  />
                </Field>
                <Field optional htmlFor="fPhone" label="Phone">
                  <input
                    autoComplete="tel"
                    className={inputClass}
                    id="fPhone"
                    name="phone"
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
                        className={clsx(
                          "inline-flex min-h-11 items-center rounded-full border px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors",
                          active
                            ? "border-[rgba(0,118,255,.45)] bg-[rgba(0,118,255,.14)] text-[#cfe4ff]"
                            : "border-white/[0.08] bg-white/[0.045] text-white/70 hover:border-white/[0.14] hover:text-white",
                        )}
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

              <Button
                className="mt-2 w-full"
                disabled={isPending}
                type="submit"
              >
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
          </div>
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
    </div>
  );
}
