"use client";

import type { ServiceHero as ServiceHeroData } from "@/data/services";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

import { STAGE_HEX, STAGE_LABEL, type Stage } from "@/lib/utils/stage";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";

type ServiceHeroProps = {
  hero: ServiceHeroData;
  stage: Stage;
  audience: string;
};

export default function ServiceHero({
  hero,
  stage,
  audience,
}: ServiceHeroProps) {
  const { openModal } = useLeadModal();
  const hex = STAGE_HEX[stage];

  return (
    <section className="relative overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,118,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,118,255,.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[70%]"
        style={{
          background:
            "radial-gradient(62% 72% at 78% 30%, rgba(0,64,150,.5) 0%, rgba(11,15,26,0) 68%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1160px] px-6 py-20 sm:px-10 sm:py-[84px]">
        <div className="max-w-[820px]">
          <Reveal>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[.12em]"
              style={{
                borderColor: `${hex}38`,
                backgroundColor: `${hex}1a`,
                color: hex,
              }}
            >
              <span
                className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                style={{ backgroundColor: hex }}
              />
              {hero.eyebrow || STAGE_LABEL[stage]}
            </div>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mb-[22px] all8-h1 font-black leading-[1.04] tracking-[-.03em]">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="mb-[30px] max-w-[660px] text-lg leading-relaxed text-white/70">
              {hero.subtitle}
            </p>
            <p className="mb-7 max-w-[660px] font-body text-sm leading-relaxed text-white/70">
              <span className="font-bold text-white">Best for: </span>
              {audience}
            </p>
          </Reveal>

          <Reveal className="flex flex-wrap items-center gap-3.5" index={3}>
            <Button onClick={openModal}>
              <Search size={16} strokeWidth={2.5} />
              {hero.ctaLabel || "Get My Free Lead Leak Review"}
            </Button>
            {hero.secondary && (
              <Link
                className="group inline-flex min-h-11 items-center gap-[7px] rounded-lg px-1 py-3.5 text-[15px] font-bold text-accent-blue hover:text-[#8ec5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                href={hero.secondary.href}
              >
                {hero.secondary.label}
                <ArrowRight
                  className="transition-transform group-hover:translate-x-[3px]"
                  size={15}
                  strokeWidth={2.5}
                />
              </Link>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
