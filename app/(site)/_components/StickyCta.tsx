"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import clsx from "clsx";

import { useLeadModal } from "./LeadModalProvider";
import Button from "./ui/Button";

import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";

/**
 * Mobile-only sticky bar. Shows once the user scrolls past the hero and
 * before the page's own final CTA section comes into view. Pages without
 * `#hero`/`#cta` (most non-homepage routes, for now) simply never trigger it.
 */
export default function StickyCta() {
  const pathname = usePathname();
  const { isOpen, openModal } = useLeadModal();
  const [heroPassed, setHeroPassed] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const cta = document.getElementById("cta");

    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => setHeroPassed(!entry.isIntersecting),
          { threshold: 0 },
        )
      : null;
    const ctaObserver = cta
      ? new IntersectionObserver(
          ([entry]) => setCtaVisible(entry.isIntersecting),
          { threshold: 0 },
        )
      : null;

    if (hero && heroObserver) heroObserver.observe(hero);
    if (cta && ctaObserver) ctaObserver.observe(cta);

    return () => {
      heroObserver?.disconnect();
      ctaObserver?.disconnect();
    };
  }, []);

  const show = heroPassed && !ctaVisible && !isOpen;
  const telHref = toTelHref(siteConfig.phone);

  if (pathname.startsWith("/hire-matt")) return null;

  return (
    <div
      aria-hidden={!show}
      className={clsx(
        "fixed inset-x-0 z-[180] hidden items-center gap-2.5 border-t border-white/[0.08] bg-background/95 px-4 backdrop-blur-xl transition-[bottom] duration-300 ease-out max-[960px]:flex",
        "py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        show ? "bottom-0" : "-bottom-40",
      )}
      inert={!show}
    >
      <Button
        className="flex-1 justify-center whitespace-normal text-center"
        onClick={openModal}
      >
        Get My Free Lead Leak Review
      </Button>
      <a
        aria-label={`Call ${siteConfig.phone}`}
        className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-white/25 text-white hover:border-accent-blue hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
        href={telHref}
      >
        <Phone size={19} />
      </a>
    </div>
  );
}
