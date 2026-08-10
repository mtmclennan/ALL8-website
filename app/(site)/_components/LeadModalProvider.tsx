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
