"use client";

import { Search } from "lucide-react";

import { STAGE_HEX, type Stage } from "@/lib/utils/stage";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Button from "@/app/(site)/_components/ui/Button";

type ServicesHeroData = {
  pill: string;
  titlePrefix: string;
  titleEm: string;
  subtitle: string;
  subtitleStrong: string;
  secondaryLabel: string;
  secondaryHref: string;
  micro: string;
  geo: string;
  badges: { label: string; stage: Stage }[];
};

export default function ServicesHero({ data }: { data: ServicesHeroData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="relative overflow-hidden pt-[68px]" id="hero">
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

      <div className="relative z-[2] mx-auto max-w-[1160px] px-6 py-24 sm:px-10 sm:py-[96px]">
        <div className="max-w-[820px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.1)] py-1.5 pl-2.5 pr-3.5 text-[12.5px] font-semibold tracking-[.05em] text-accent-blue">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-stage-win shadow-[0_0_8px_#22c55e]" />
            {data.pill}
          </div>

          <h1 className="mb-[22px] text-[clamp(40px,4.6vw,66px)] font-black leading-[1] tracking-[-.03em]">
            {data.titlePrefix}
            <span className="text-accent-blue">{data.titleEm}</span>
          </h1>

          <p className="mb-[30px] max-w-[660px] text-lg leading-relaxed text-white/70">
            {data.subtitle}
            <strong className="font-bold text-white">
              {data.subtitleStrong}
            </strong>
          </p>

          <div className="mb-[22px] flex flex-wrap items-center gap-3.5">
            <Button onClick={openModal}>
              <Search size={16} strokeWidth={2.5} />
              Get My Free Lead System Review
            </Button>
            <a
              className="group inline-flex items-center gap-[7px] px-1 py-3.5 text-[15px] font-bold text-accent-blue hover:text-[#8ec5ff]"
              href={data.secondaryHref}
            >
              {data.secondaryLabel}
            </a>
          </div>

          <p className="text-[13px] text-white/40">{data.micro}</p>
          <p className="mb-9 mt-[9px] flex items-center gap-[7px] text-[12.5px] text-white/40">
            <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40" />
            {data.geo}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {data.badges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-[15px] py-2 text-[13px] font-semibold text-white/70"
              >
                <span
                  className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: STAGE_HEX[b.stage],
                    boxShadow: `0 0 7px ${STAGE_HEX[b.stage]}`,
                  }}
                />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
