"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, Menu, X } from "lucide-react";

import { useLeadModal } from "./LeadModalProvider";
import refinement from "./VisualRefinement.module.css";
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

  const panelRef = useRef<HTMLDivElement>(null);

  // Full-screen mobile sheet: lock page scroll, move focus inside, Escape closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  if (pathname.startsWith("/hire-matt")) {
    return (
      <header
        className={clsx(
          "fixed left-0 right-0 top-0 z-[200] border-b border-white/[0.08] transition-colors",
          refinement.surface,
          scrolled ? "bg-background/92 backdrop-blur-2xl" : "bg-background/75",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-5 px-6 sm:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              aria-label="Visit the ALL8 Webworks homepage"
              className="flex min-h-11 flex-shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/"
            >
              <Logo showMark={false} size="nav" variant="horizontal" />
            </Link>
            <span className="hidden border-l border-white/[0.14] pl-3 text-sm font-bold text-white/70 sm:inline">
              Matt McLennan
            </span>
          </div>
          <nav aria-label="Hire Matt" className="ml-auto">
            <ul className="flex items-center gap-4 text-sm font-semibold sm:gap-6">
              <li className="max-[520px]:hidden">
                <Link
                  className="inline-flex min-h-11 items-center rounded-lg text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                  href="/hire-matt#projects"
                >
                  Work
                </Link>
              </li>
              <li className="max-[520px]:hidden">
                <Link
                  className="inline-flex min-h-11 items-center rounded-lg text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
                  href="/work/service-business-growth-case-study"
                >
                  Case study
                </Link>
              </li>
              <li>
                <Button
                  className="px-4"
                  data-cta="hire-nav-contact"
                  data-cta-event="hire_contact_click"
                  href="mailto:hello@all8webworks.com?subject=Opportunity%20for%20Matt"
                >
                  Contact
                </Button>
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
        pathname === "/" && refinement.surface,
        // backdrop-filter would trap the fixed menu sheet inside the header box.
        scrolled &&
          !menuOpen &&
          "bg-background/90 shadow-[0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl",
        menuOpen && "bg-background",
      )}
      id="nav"
    >
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-2 px-6 sm:gap-5 xl:gap-8 sm:px-10">
        <Link
          className="flex h-full flex-shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
          href="/"
        >
          <Logo size="sm" variant="horizontal" />
        </Link>

        <nav aria-label="Primary" className="ml-2 max-[1100px]:hidden">
          <ul className="flex items-center gap-5">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link
                  aria-current={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                      ? "page"
                      : undefined
                  }
                  className={clsx(
                    "inline-flex min-h-11 items-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "text-white"
                      : "text-white/70",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 max-[1100px]:hidden">
          <a
            className="inline-flex min-h-11 items-center whitespace-nowrap gap-[7px] text-sm font-bold text-white hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue max-[1500px]:hidden"
            href={telHref}
          >
            <Phone className="text-accent-blue" size={15} />
            {siteConfig.phone}
          </a>
          <Button className="whitespace-nowrap" size="md" onClick={openModal}>
            Get My Free Lead Leak Review
          </Button>
        </div>

        <a
          aria-label={`Call ${siteConfig.phone}`}
          className="ml-auto hidden min-h-11 min-w-11 justify-center items-center rounded-lg px-1.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue max-[1100px]:flex"
          href={telHref}
        >
          <Phone className="text-accent-blue" size={17} />
        </a>

        <button
          aria-controls="navPanel"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue max-[1100px]:flex"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        ref={panelRef}
        className={clsx(
          "fixed inset-x-0 bottom-0 top-[68px] overflow-y-auto overscroll-contain border-t border-white/[0.08] bg-background min-[1101px]:hidden",
          !menuOpen && "hidden",
        )}
        id="navPanel"
        inert={!menuOpen}
      >
        <div className="mx-auto flex max-w-[640px] flex-col gap-0.5 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
          {siteConfig.navMenuItems.map((item) => (
            <Link
              key={item.href}
              aria-current={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "page"
                  : undefined
              }
              className="block min-h-11 border-b border-white/[0.08] px-1 py-3.5 text-[17px] font-semibold text-white/70 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue aria-[current=page]:text-white"
              href={item.href}
              onClick={() => setMenuOpen(false)}
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
            Get My Free Lead Leak Review
          </Button>
          <a
            className="mt-2.5 flex min-h-11 items-center justify-center gap-2 rounded-lg text-[15px] font-bold text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
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
