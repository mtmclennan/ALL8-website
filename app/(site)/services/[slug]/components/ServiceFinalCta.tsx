"use client";

import { Search, Phone } from "lucide-react";

import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";
import { siteConfig } from "@/config/site";
import { toTelHref } from "@/lib/utils/phone";

export default function ServiceFinalCta({ title }: { title: string }) {
  const { openModal } = useLeadModal();
  const telHref = toTelHref(siteConfig.phone);

  return (
    <section
      className="relative overflow-hidden py-[120px] text-center max-[960px]:py-20"
      id="cta"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 65% at 50% 50%, rgba(0,70,165,.45) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-[1] mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mb-4 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          Free Lead System Review
        </Reveal>
        <Reveal index={1}>
          <h2 className="mb-[18px] text-[clamp(32px,3.8vw,50px)] font-black leading-[1.05] tracking-[-.03em]">
            Not Sure If {title} Is the Right Place to Start?
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mb-[38px] max-w-[560px] text-lg leading-relaxed text-white/70">
            Spend 15 minutes walking through your whole lead path. We&rsquo;ll
            tell you which stage is actually costing you the most — including if
            it&rsquo;s not this one.
          </p>
        </Reveal>
        <Reveal
          className="flex flex-wrap items-center justify-center gap-3.5"
          index={3}
        >
          <Button pulse size="lg" onClick={openModal}>
            <Search size={18} strokeWidth={2.5} />
            Get My Free Lead System Review
          </Button>
          <Button href={telHref} size="lg" variant="ghost">
            <Phone size={17} strokeWidth={2.2} />
            {siteConfig.phone}
          </Button>
        </Reveal>
        <Reveal index={4}>
          <p className="mt-[22px] text-[13px] text-white/40">
            No long-term commitment · Clear recommendations · Fixed scope before
            work begins
          </p>
        </Reveal>
      </div>
    </section>
  );
}
