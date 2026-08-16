"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import LeadModal from "./LeadModal";

import { trackCtaClick } from "@/lib/analytics/dataLayer";

type LeadModalContextValue = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);

  if (!ctx) {
    throw new Error("useLeadModal must be used within LeadModalProvider");
  }

  return ctx;
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    if (typeof document !== "undefined") {
      lastFocusedRef.current = document.activeElement as HTMLElement;
    }
    // Every "Get My Free Lead System Review" trigger sitewide (nav, footer,
    // sticky bar, hero/final CTAs, all 9 service pages, blog posts) opens
    // the modal through this one function — instrumenting here covers the
    // primary CTA everywhere without editing each of those ~17 call sites.
    trackCtaClick("lead_system_review");
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    lastFocusedRef.current?.focus?.();
  }, []);

  return (
    <LeadModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <LeadModal open={isOpen} onClose={closeModal} />
    </LeadModalContext.Provider>
  );
}
