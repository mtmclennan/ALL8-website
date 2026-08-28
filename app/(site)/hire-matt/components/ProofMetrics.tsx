import type { HireMattPageData } from "@/data/pages/hire-matt";

import Reveal from "../../_components/home/Reveal";

import { renderBold } from "@/lib/utils/renderBold";
import { hexToRgba } from "@/lib/utils/stage";

export default function ProofMetrics({
  data,
}: {
  data: HireMattPageData["proofMetrics"];
}) {
  return (
    <section
      className="border-y border-white/[0.08] bg-content3 pb-11 pt-14"
      id="proof"
    >
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[22px] text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
          {data.eyebrow}
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((card, i) => (
            <Reveal key={card.tag} index={i}>
              <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-6 transition-all duration-200 hover:-translate-y-[3px] hover:bg-white/[0.058]">
                <div
                  className="pointer-events-none absolute -right-[32%] -top-[40%] h-[80%] w-[75%]"
                  style={{
                    background: `radial-gradient(circle, ${hexToRgba(card.color, 0.16)} 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="relative mb-4 text-[10px] font-bold uppercase tracking-[.14em]"
                  style={{ color: card.color }}
                >
                  {card.tag}
                </div>
                <div className="relative mb-[11px] text-[clamp(36px,4vw,48px)] font-black leading-none tracking-[-.04em]">
                  {card.em ? (
                    <span style={{ color: card.color }}>{card.value}</span>
                  ) : (
                    card.value
                  )}
                </div>
                <div className="relative text-[14.5px] font-medium leading-snug text-white/70">
                  {renderBold(card.label)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-8 flex flex-wrap items-center justify-between gap-3.5"
          index={0}
        >
          <p className="text-[17px] font-semibold leading-relaxed tracking-[-.01em] text-[#dce8f5]">
            {data.footLine}
          </p>
          <span className="max-w-[400px] text-[11px] uppercase leading-relaxed tracking-[.09em] text-white/40">
            {data.footNote}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
