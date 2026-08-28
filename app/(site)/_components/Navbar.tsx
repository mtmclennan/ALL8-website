"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, Menu, X } from "lucide-react";

import { useLeadModal } from "./LeadModalProvider";
import Logo from "./Logo";
import Button from "./ui/Button";

import { toTelHref } from "@/lib/utils/phone";
import { siteConfig } from "@/config/site";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openModal } = useLeadModal();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  if (pathname.startsWith("/hire-matt")) {
    return (
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-[200] border-b border-white/[0.08] transition-colors",
          scrolled ? "bg-background/92 backdrop-blur-2xl" : "bg-background/75",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-5 px-6 sm:px-10">
          <Link className="flex items-center gap-3" href="/hire-matt">
            <Logo size="sm" variant="horizontal" />
            <span className="hidden border-l border-white/[0.14] pl-3 text-sm font-bold text-white/70 sm:inline">
              Matt McLennan
            </span>
          </Link>
          <nav aria-label="Hire Matt" className="ml-auto">
            <ul className="flex items-center gap-4 text-sm font-semibold sm:gap-6">
              <li className="max-[520px]:hidden">
                <Link
                  className="text-white/70 hover:text-white"
                  href="/hire-matt#projects"
                >
                  Work
                </Link>
              </li>
              <li className="max-[520px]:hidden">
                <Link
                  className="text-white/70 hover:text-white"
                  href="/work/service-business-growth-case-study"
                >
                  Case study
                </Link>
              </li>
              <li>
                <a
                  className="inline-flex min-h-11 items-center rounded-full bg-accent-blue px-4 py-2 font-bold text-white hover:bg-[#1e8bff]"
                  data-cta="hire-nav-contact"
                  data-cta-event="hire_contact_click"
                  href="mailto:hello@all8webworks.com?subject=Opportunity%20for%20Matt"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  const telHref = toTelHref(siteConfig.phone);

  return (
    <header
      className={clsx(
        "fixed left-0 right-0 top-0 z-[200] transition-[background,box-shadow] duration-300",
        scrolled &&
          "bg-background/90 shadow-[0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl",
        menuOpen && !scrolled && "bg-background/95 backdrop-blur-2xl",
      )}
      id="nav"
    >
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-8 px-6 sm:px-10">
        <Link className="flex h-full flex-shrink-0 items-center" href="/">
          <Logo size="sm" variant="horizontal" />
        </Link>

        <ul className="ml-2 flex items-center gap-7 max-[960px]:hidden">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-4 max-[960px]:hidden">
          <a
            className="inline-flex items-center gap-[7px] text-sm font-bold text-white hover:text-accent-blue"
            href={telHref}
          >
            <Phone className="text-accent-blue" size={15} />
            {siteConfig.phone}
          </a>
          <Button size="md" onClick={openModal}>
            Get My Free Lead System Review
          </Button>
        </div>

        <a
          aria-label={`Call ${siteConfig.phone}`}
          className="ml-auto hidden min-h-11 items-center px-1.5 max-[960px]:flex"
          href={telHref}
        >
          <Phone className="text-accent-blue" size={17} />
        </a>

        <button
          aria-controls="navPanel"
          aria-expanded={menuOpen}
          aria-label="Menu"
          className="hidden min-h-11 min-w-11 items-center justify-center max-[960px]:flex"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={clsx(
          "hidden overflow-hidden border-t border-white/[0.08] bg-background transition-[max-height] duration-300 ease-out max-[960px]:block",
          menuOpen ? "max-h-[520px]" : "max-h-0 border-t-0",
        )}
        id="navPanel"
      >
        <div className="flex flex-col gap-0.5 px-6 pb-6 pt-4">
          {siteConfig.navMenuItems.map((item) => (
            <Link
              key={item.href}
              className="block border-b border-white/[0.08] px-1 py-3.5 text-[17px] font-semibold text-white/70 hover:text-white"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Button
            className="mt-5 justify-center"
            onClick={() => {
              setMenuOpen(false);
              openModal();
            }}
          >
            Get My Free Lead System Review
          </Button>
          <a
            className="mt-2.5 flex min-h-11 items-center justify-center gap-2 text-[15px] font-bold text-white/70"
            href={telHref}
          >
            <Phone className="text-accent-blue" size={15} />
            {siteConfig.phone}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
