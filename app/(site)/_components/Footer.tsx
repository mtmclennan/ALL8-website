"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Linkedin } from "lucide-react";

import refinement from "./VisualRefinement.module.css";
import Logo from "./Logo";

import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";

const OUTCOMES = [
  { label: "Get More Opportunities", href: "/services#get-found" },
  { label: "Convert More Visitors", href: "/services#get-contacted" },
  { label: "Faster Follow-Up", href: "/services#respond" },
  { label: "Pipeline & Tracking", href: "/services#win" },
  { label: "All Services", href: "/services" },
];

const COMPANY = [
  { label: "About ALL8", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Work", href: "/work" },
  { label: "How It Works", href: "/#system" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer({ year }: { year: number }) {
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
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div>
            <Link
              className="mb-3.5 flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/"
            >
              <Logo size="sm" variant="horizontal" />
            </Link>
            <p className="all8-muted max-w-[250px] text-sm leading-relaxed">
              Lead systems for service businesses — connecting search
              visibility, websites, calls, follow-up and tracking.
            </p>
            <div className="all8-faint mt-4 flex items-center gap-2 text-[13px]">
              <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-accent-blue" />
              Serving service businesses across the U.S. &amp; Canada
            </div>
            <p className="all8-faint mt-[18px] max-w-[250px] text-sm leading-relaxed">
              ALL8 WEBWORKS
              <br />
              {siteConfig.addressLine}
              <br />
              <a
                className="all8-body-link inline-flex min-h-11 items-center rounded-sm"
                href={telHref}
              >
                {siteConfig.phone}
              </a>
              <br />
              <a
                className="all8-body-link inline-flex min-h-11 items-center rounded-sm"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </p>
          </div>

          <div>
            <h2 className="all8-faint mb-[18px] text-xs font-bold uppercase tracking-[.12em]">
              Outcomes
            </h2>
            <ul className="flex flex-col gap-1">
              {OUTCOMES.map((item) => (
                <li key={item.label}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="all8-faint mb-[18px] text-xs font-bold uppercase tracking-[.12em]">
              Company
            </h2>
            <ul className="flex flex-col gap-1">
              {COMPANY.map((item) => (
                <li key={item.label}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="all8-faint mb-[18px] text-xs font-bold uppercase tracking-[.12em]">
              Contact
            </h2>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.links.linkedin && (
                <li>
                  <a
                    className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                    href={siteConfig.links.linkedin}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {siteConfig.links.facebook && (
                <li>
                  <a
                    className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                    href={siteConfig.links.facebook}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </li>
              )}
              {/* <li>
                <Button
                  className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                  type="button"
                  onClick={openModal}
                >
                  Get My Free Lead Leak Review
                </Button>
              </li> */}
            </ul>
          </div>
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
