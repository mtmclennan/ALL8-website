"use client";

import { AlertTriangle } from "lucide-react";

import { useLeadModal } from "../LeadModalProvider";
import Button from "../ui/Button";

import Reveal from "./Reveal";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";
import { renderBold } from "@/lib/utils/renderBold";

type CaseStudyData = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lede: string;
  steps: { tag: string; text: string }[];
  ctaLabel: string;
  visual: {
    title: string;
    metrics: { value: string; label: string; stage: Stage }[];
    rows: { label: string; stage: Stage; status: string }[];
    flag: string;
  };
};

export default function CaseStudy({ data }: { data: CaseStudyData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="proof">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-[70px]">
          <Reveal>
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              {data.eyebrow}
            </div>
            <h2 className="mb-4 text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.025em]">
              {data.title}
              <br />
              <span className="bg-gradient-to-br from-[#7ec8ff] to-[#1a7cf0] bg-clip-text text-transparent">
                {data.titleAccent}
              </span>
            </h2>
            <p className="mb-[34px] text-lg leading-relaxed text-white/70">
              {data.lede}
            </p>
            <div className="flex flex-col gap-6">
              {data.steps.map((step) => (
                <div key={step.tag} className="flex items-start gap-4">
                  <div className="w-[88px] flex-shrink-0 pt-[5px] text-[11px] font-bold uppercase tracking-[.1em] text-white/40">
                    {step.tag}
                  </div>
                  <p className="flex-1 text-[16.5px] leading-relaxed text-white/70">
                    {renderBold(step.text)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-9">
              <Button onClick={openModal}>{data.ctaLabel}</Button>
            </div>
          </Reveal>

          <Reveal index={1}>
            <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.036]">
              <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.04] px-[18px] py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D00000]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                <span className="ml-2 text-xs text-white/60">
                  {data.visual.title}
                </span>
              </div>
              <div className="p-[26px]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                  {data.visual.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="flex-1 rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-4 text-center"
                    >
                      <div
                        className="text-[22px] font-black leading-[1.1] tracking-[-.02em]"
                        style={{ color: STAGE_HEX[m.stage] }}
                      >
                        {m.value}
                      </div>
                      <div className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[.05em] text-white/60">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {data.visual.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 text-[12.5px] text-white/70"
                    >
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: STAGE_HEX[row.stage] }}
                      />
                      <span className="flex-1">{row.label}</span>
                      <span
                        className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.04em]"
                        style={{
                          color: STAGE_HEX[row.stage],
                          backgroundColor: hexToRgba(
                            STAGE_HEX[row.stage],
                            0.14,
                          ),
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-[22px] flex items-start gap-3 rounded-[10px] p-4"
                  style={{
                    backgroundColor: hexToRgba("#f59e0b", 0.08),
                    border: `1px solid ${hexToRgba("#f59e0b", 0.2)}`,
                  }}
                >
                  <AlertTriangle
                    className="flex-shrink-0 text-[#f59e0b]"
                    size={20}
                    strokeWidth={2.2}
                  />
                  <span className="text-[13px] font-semibold leading-relaxed text-[#fcd34d]">
                    {data.visual.flag}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
