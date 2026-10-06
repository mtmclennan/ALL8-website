"use client";

import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";

export default function ArticleCta() {
  const { openModal } = useLeadModal();

  return (
    <div className="mt-8 rounded-[20px] border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.07)] p-[30px]">
      <h3 className="mb-2 text-xl font-extrabold tracking-[-.02em]">
        Not sure which stage is yours?
      </h3>
      <p className="mb-5 text-[15.5px] leading-relaxed text-white/70">
        That&apos;s the whole point of the free Lead System Review. Fifteen
        minutes, we walk the path a customer takes to reach you, and you get the
        findings in writing either way.
      </p>
      <button
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#1e8bff] to-[#0060d6] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_28px_-6px_rgba(0,118,255,.45)] transition-all hover:-translate-y-0.5"
        type="button"
        onClick={openModal}
      >
        Get My Free Lead System Review
      </button>
    </div>
  );
}
