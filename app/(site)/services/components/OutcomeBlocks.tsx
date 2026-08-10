"use client";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";

type OutcomesData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  blocks: {
    stage: Stage;
    num: string;
    label: string;
    title: string;
    description: string;
    capabilities: string[];
  }[];
  winBand: { title: string; subtitle: string; ctaLabel: string };
};

export default function OutcomeBlocks({ data }: { data: OutcomesData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="outcomes">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        {data.blocks.map((block, i) => {
          const hex = STAGE_HEX[block.stage];

          return (
            <Reveal
              key={block.label}
              className={`grid grid-cols-1 gap-8 border-white/[0.08] py-11 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 ${i === 0 ? "border-t-0 pt-0" : "border-t"}`}
              index={i}
            >
              <div>
                <div className="mb-[18px] flex items-center gap-3">
                  <div
                    className="grid h-[34px] w-[34px] place-items-center rounded-[10px] text-sm font-black"
                    style={{
                      backgroundColor: hexToRgba(hex, 0.14),
                      border: `1px solid ${hexToRgba(hex, 0.3)}`,
                      color: hex,
                    }}
                  >
                    {block.num}
                  </div>
                  <div
                    className="text-[11.5px] font-bold uppercase tracking-[.13em]"
                    style={{ color: hex }}
                  >
                    {block.label}
                  </div>
                </div>
                <h3 className="mb-3.5 text-[clamp(27px,2.9vw,38px)] font-extrabold leading-[1.08] tracking-[-.025em]">
                  {block.title}
                </h3>
                <p className="text-[16.5px] leading-relaxed text-white/70">
                  {block.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {block.capabilities.map((cap) => (
                  <div
                    key={cap}
                    className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-[18px] py-[15px] text-[14.5px] font-semibold text-white/70"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: hex }}
                    />
                    {cap}
                  </div>
                ))}
              </div>
            </Reveal>
          );
        })}

        <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-7 rounded-[20px] border border-[rgba(0,118,255,.24)] bg-gradient-to-br from-[rgba(0,118,255,.13)] to-[rgba(34,197,94,.08)] px-10 py-11 max-[960px]:px-7 max-[960px]:py-8">
          <div>
            <h3 className="text-[clamp(25px,2.7vw,34px)] font-black leading-[1.1] tracking-[-.025em]">
              {data.winBand.title}
            </h3>
            <p className="mt-2 max-w-[520px] text-base leading-relaxed text-white/70">
              {data.winBand.subtitle}
            </p>
          </div>
          <Button onClick={openModal}>{data.winBand.ctaLabel}</Button>
        </Reveal>
      </div>
    </section>
  );
}
