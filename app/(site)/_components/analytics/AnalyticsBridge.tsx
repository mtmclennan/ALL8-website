"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  trackCustomEvent,
  trackLinkClick,
  trackPageView,
} from "@/lib/analytics/dataLayer";

// GTM's own container-load / GA4 Configuration tag already covers the very
// first pageview, so this only needs to fire on subsequent client-side
// navigations — otherwise every route change would double-count page 1.
//
// Deliberately NOT a "have I run yet" boolean: React (with reactStrictMode
// enabled, dev only) invokes this effect twice in a row on mount, and a
// boolean flipped inside the *skip* branch flips true→push on that second
// invocation instead of staying skipped. Comparing against the last tracked
// URL is idempotent — repeated invocations for the same URL are always a
// no-op, regardless of how many times the effect body runs for one render.
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const lastTrackedUrl = useRef(currentUrl);

  useEffect(() => {
    if (lastTrackedUrl.current === currentUrl) return;
    lastTrackedUrl.current = currentUrl;
    trackPageView(currentUrl);
  }, [currentUrl]);

  return null;
}

// Single delegated listener for the whole document — avoids attaching a
// handler per tel:/sms:/mailto: link and avoids ever double-firing per click,
// since data-cta (explicit intent) always wins over the href-pattern fallback.
function DelegatedClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;

      if (!target) return;
      const el = target.closest<HTMLElement>(
        '[data-cta], a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]',
      );

      if (!el) return;

      const ctaId = el.getAttribute("data-cta");

      if (ctaId) {
        const eventName = el.getAttribute("data-cta-event") || "cta_click";

        trackCustomEvent(eventName, ctaId);

        return;
      }

      const href = el.getAttribute("href") || "";

      if (href.startsWith("tel:")) trackLinkClick("phone_click", href);
      else if (href.startsWith("sms:")) trackLinkClick("sms_click", href);
      else if (href.startsWith("mailto:")) trackLinkClick("email_click", href);
    }

    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export default function AnalyticsBridge() {
  return (
    <>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
      <DelegatedClickTracker />
    </>
  );
}
