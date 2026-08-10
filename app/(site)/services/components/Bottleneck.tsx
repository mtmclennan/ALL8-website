"use client";

import { ArrowRight } from "lucide-react";

import { renderBold } from "@/lib/utils/renderBold";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";

type BottleneckData = {
  eyebrow: string;
  title: string;
  lead: string;
  rows: { if: string; then: string }[];
  kicker: string;
  ctaLabel: string;
};

export default function Bottleneck({ data }: { data: BottleneckData }) {
  const { openModal } = useLeadModal();
  const [kickerPlain, kickerEm] = data.kicker.split("*").filter(Boolean);

  return (
    <section className="py-[132px] max-[960px]:py-20" id="bottleneck">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <Reveal className="mb-11 max-w-[640px] text-lg leading-relaxed text-white/70">
          {renderBold(data.lead)}
        </Reveal>

        <div className="flex max-w-[920px] flex-col gap-2.5">
          {data.rows.map((row, i) => (
            <Reveal key={row.if} index={i}>
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-6 py-5 transition-colors hover:border-[rgba(0,118,255,.26)] hover:bg-white/[0.058] sm:grid-cols-[1fr_auto_1fr]">
                <div className="text-[15.5px] leading-relaxed text-white/70 sm:text-right">
                  {row.if}
                </div>
                <ArrowRight
                  className="text-accent-blue max-[580px]:rotate-90"
                  size={20}
                  strokeWidth={2.4}
                />
                <div className="text-[15.5px] font-bold leading-relaxed text-white">
                  {row.then}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 max-w-[920px] rounded-[20px] border border-[rgba(0,118,255,.2)] bg-[rgba(0,118,255,.07)] px-8 py-7">
          <p className="text-[clamp(19px,2.1vw,25px)] font-extrabold leading-[1.35] tracking-[-.02em]">
            {kickerPlain}
            <span className="text-accent-blue">{kickerEm}</span>
          </p>
        </Reveal>

        <div className="mt-9">
          <Button onClick={openModal}>{data.ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
}
