"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Linkedin } from "lucide-react";

import refinement from "./VisualRefinement.module.css";
import Logo from "./Logo";
import Button from "./ui/Button";

import { siteConfig } from "@/config/site";
import { PLANS } from "@/data/plans";
import { toTelHref } from "@/lib/utils/phone";

export type FooterLink = { label: string; href: string };

const PLAN_LINKS: FooterLink[] = PLANS.map((plan) => ({
  label: plan.name,
  href: `/pricing#${plan.id}`,
}));

const RESOURCES: FooterLink[] = [
  { label: "Blog", href: "/blog" },
  {
    label: "Missed-Call Calculator",
    href: "/tools/missed-call-revenue-calculator",
  },
  { label: "Work", href: "/work" },
  { label: "About ALL8", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LINK_CLASS =
  "inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h2 className="mb-[18px] text-xs font-bold uppercase tracking-[.12em] text-white/60">
        {title}
      </h2>
      <ul className="flex flex-col">
        {links.map((item) => (
          <li key={item.href}>
            <Link className={LINK_CLASS} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  year,
  services,
}: {
  year: number;
  /** Passed from the server layout so the full service catalogue stays out of the client bundle. */
  services: FooterLink[];
}) {
  const pathname = usePathname();
  const telHref = toTelHref(siteConfig.phone);

  if (pathname.startsWith("/hire-matt")) {
    return (
      <footer
        className={`${pathname === "/" || pathname.startsWith("/hire-matt") ? refinement.surface : ""} border-t border-white/[0.08] bg-[#070A12]`}
      >
        <div className="mx-auto flex max-w-[1160px] flex-col gap-4 px-6 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>&copy; {year} Matt McLennan · Ontario, Canada</p>
          <div className="flex flex-wrap gap-5">
            <a
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              data-cta="hire-footer-email"
              data-cta-event="hire_contact_click"
              href="mailto:hello@all8webworks.com?subject=Opportunity%20for%20Matt"
            >
              Email
            </a>
            <a
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              data-cta="hire-footer-linkedin"
              data-cta-event="hire_linkedin_click"
              href="https://www.linkedin.com/in/matthew-mclennan-dev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <Link
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/"
            >
              ALL8 Webworks
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`${pathname === "/" || pathname.startsWith("/hire-matt") ? refinement.surface : ""} border-t border-white/[0.08] bg-[#070A12]`}
    >
      <div className="mx-auto max-w-[1160px] px-6 pb-8 pt-16 sm:px-10">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr]">
          <div>
            <Link className="mb-3.5 flex items-center gap-2.5" href="/">
              <Logo size="sm" variant="horizontal" />
            </Link>
            <p className="max-w-[270px] text-sm leading-relaxed text-white/60">
              Lead systems for service businesses — connecting search
              visibility, websites, calls, follow-up and tracking.
            </p>
            <p className="mt-3 text-[13px] text-white/60">
              Serving service businesses across the U.S. &amp; Canada ·{" "}
              {siteConfig.addressLine}
            </p>
            <ul className="mt-3 flex flex-col">
              <li>
                <a className={LINK_CLASS} href={telHref}>
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a className={LINK_CLASS} href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <Button className="mt-4" href="/contact" variant="ghost">
              Free Lead Leak Review
            </Button>
          </div>

          <FooterColumn links={services} title="Services" />
          <FooterColumn links={PLAN_LINKS} title="Plans" />
          <FooterColumn links={RESOURCES} title="Resources" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-[26px]">
          <p className="text-[13px] text-white/40">
            &copy; {year} ALL8 WEBWORKS. All rights reserved. Based in Ontario,
            Canada. &nbsp;&middot;&nbsp;{" "}
            <Link
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            &nbsp;&middot;&nbsp;
            <Link
              className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/legal"
            >
              Legal
            </Link>
          </p>
          <div className="flex gap-2.5">
            {siteConfig.links.linkedin && (
              <a
                aria-label="Visit ALL8 Webworks on LinkedIn"
                className="grid h-11 w-11 place-items-center rounded-[10px] border border-white/[0.08] bg-white/[0.036] text-white/70 transition-colors hover:border-accent-blue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                href={siteConfig.links.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin size={16} />
              </a>
            )}
            {siteConfig.links.facebook && (
              <a
                aria-label="Visit ALL8 Webworks on Facebook"
                className="grid h-11 w-11 place-items-center rounded-[10px] border border-white/[0.08] bg-white/[0.036] text-white/70 transition-colors hover:border-accent-blue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                href={siteConfig.links.facebook}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Facebook size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
