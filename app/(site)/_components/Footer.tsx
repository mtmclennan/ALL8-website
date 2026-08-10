"use client";

import Link from "next/link";
import { Facebook, Linkedin } from "lucide-react";

import Logo from "./Logo";
import { useLeadModal } from "./LeadModalProvider";

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
  { label: "Blog", href: "/blog" },
  { label: "Results", href: "/#proof" },
  { label: "How It Works", href: "/#system" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer() {
  const { openModal } = useLeadModal();
  const telHref = toTelHref(siteConfig.phone);

  return (
    <footer className="border-t border-white/[0.08] bg-[#070A12]">
      <div className="mx-auto max-w-[1160px] px-6 pb-8 pt-16 sm:px-10">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div>
            <Link className="mb-3.5 flex items-center gap-2.5" href="/">
              <Logo size="sm" variant="horizontal" />
            </Link>
            <p className="max-w-[250px] text-sm leading-relaxed text-white/45">
              Lead systems for service businesses — connecting search
              visibility, websites, calls, follow-up and tracking.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[13px] text-white/45">
              <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
              Serving service businesses across the U.S. &amp; Canada
            </div>
            <p className="mt-[18px] max-w-[250px] text-sm leading-relaxed text-white/45">
              ALL8 WEBWORKS
              <br />
              {siteConfig.addressLine}
              <br />
              <a className="text-white/70 hover:text-white" href={telHref}>
                {siteConfig.phone}
              </a>
              <br />
              <a
                className="text-white/70 hover:text-white"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </p>
          </div>

          <div>
            <h4 className="mb-[18px] text-xs font-bold uppercase tracking-[.12em] text-white/40">
              Outcomes
            </h4>
            <ul className="flex flex-col gap-[11px]">
              {OUTCOMES.map((item) => (
                <li key={item.label}>
                  <Link
                    className="text-sm text-white/70 hover:text-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[18px] text-xs font-bold uppercase tracking-[.12em] text-white/40">
              Company
            </h4>
            <ul className="flex flex-col gap-[11px]">
              {COMPANY.map((item) => (
                <li key={item.label}>
                  <Link
                    className="text-sm text-white/70 hover:text-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[18px] text-xs font-bold uppercase tracking-[.12em] text-white/40">
              Contact
            </h4>
            <ul className="flex flex-col gap-[11px]">
              <li>
                <Link
                  className="text-sm text-white/70 hover:text-white"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  className="text-sm text-white/70 hover:text-white"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <button
                  className="text-sm text-white/70 hover:text-white"
                  type="button"
                  onClick={openModal}
                >
                  Free Lead System Review
                </button>
              </li>
              {siteConfig.links.linkedin && (
                <li>
                  <a
                    className="text-sm text-white/70 hover:text-white"
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
                    className="text-sm text-white/70 hover:text-white"
                    href={siteConfig.links.facebook}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-[26px]">
          <p className="text-[13px] text-white/40">
            &copy; {new Date().getFullYear()} ALL8 WEBWORKS. All rights
            reserved. Based in Ontario, Canada. &nbsp;&middot;&nbsp;{" "}
            <Link className="hover:text-white" href="/privacy">
              Privacy Policy
            </Link>
          </p>
          <div className="flex gap-2.5">
            {siteConfig.links.linkedin && (
              <a
                aria-label="Visit ALL8 Webworks on LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/[0.08] bg-white/[0.036] text-white/40 transition-colors hover:border-white/[0.14] hover:text-white"
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
                className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/[0.08] bg-white/[0.036] text-white/40 transition-colors hover:border-white/[0.14] hover:text-white"
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
