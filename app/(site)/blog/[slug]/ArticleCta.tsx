"use client";

import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Button from "@/app/(site)/_components/ui/Button";

export default function ArticleCta() {
  const { openModal } = useLeadModal();

  return (
    <div className="mt-8 rounded-[20px] border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.07)] p-[30px]">
      <h3 className="mb-2 text-xl font-extrabold tracking-[-.02em]">
        Not sure which stage is yours?
      </h3>
      <p className="mb-5 text-[15.5px] leading-relaxed text-white/70">
        Send your business and website details for a free Lead Leak Review. Matt
        will send specific findings and what to fix first. A short call
        afterward is optional.
      </p>
      <Button onClick={openModal}>Get My Free Lead Leak Review</Button>
    </div>
  );
}
