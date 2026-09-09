import type { HireMattPageData } from "@/data/pages/hire-matt";

import refinement from "../../_components/VisualRefinement.module.css";
import Reveal from "../../_components/home/Reveal";

import { renderBold } from "@/lib/utils/renderBold";

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

        <div className={`${refinement.proofGrid} grid gap-5`}>
          {data.cards.map((card, i) => (
            <Reveal key={card.tag} index={i}>
              <div
                className={`${refinement.proofCard} ${card.kind === "insight" ? refinement.proofInsight : ""} relative rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-6`}
              >
                <div
                  className="relative mb-4 text-xs font-bold uppercase tracking-[.14em]"
                  style={{ color: card.color }}
                >
                  {card.tag}
                </div>
                <div
                  className={`${card.kind === "insight" ? refinement.systemMetric : ""} relative mb-[11px] text-[clamp(36px,4vw,48px)] font-black leading-none tracking-[-.04em]`}
                >
                  {card.em ? (
                    <span style={{ color: card.color }}>{card.value}</span>
                  ) : (
                    card.value
                  )}
                </div>
                <div className="relative text-[14.5px] font-medium leading-snug text-white/70">
                  {renderBold(card.label)}
                </div>
                {card.context && (
                  <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                    {card.context}
                  </p>
                )}
                {card.detail && (
                  <p
                    className={`${refinement.proofDetail} relative mt-4 text-sm font-semibold leading-relaxed`}
                  >
                    {card.detail}
                  </p>
                )}
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
          <span className="max-w-[480px] text-sm leading-relaxed text-white/60">
            {data.footNote}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
