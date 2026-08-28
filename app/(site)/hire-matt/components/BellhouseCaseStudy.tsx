import type { HireMattPageData } from "@/data/pages/hire-matt";

import { AlertTriangle, ArrowRight, CheckCircle2, ScanEye } from "lucide-react";

import Reveal from "../../_components/home/Reveal";
import Button from "../../_components/ui/Button";

import { renderBold } from "@/lib/utils/renderBold";

export default function BellhouseCaseStudy({
  data,
}: {
  data: HireMattPageData["caseStudy"];
}) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="case">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.05fr_.95fr] lg:gap-[62px]">
          <Reveal>
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              {data.eyebrow}
            </div>
            <h2 className="mb-[18px] text-[clamp(29px,3.3vw,44px)] font-extrabold leading-[1.06] tracking-[-.026em]">
              {data.title}
              <br />
              <span className="bg-gradient-to-br from-[#7ec8ff] to-[#1a7cf0] bg-clip-text text-transparent">
                {data.titleAccent}
              </span>
            </h2>
            <p className="mb-[34px] text-lg leading-relaxed text-white/70">
              {data.lede}
            </p>

            {data.blocks.map((block) => (
              <div key={block.heading} className="mb-8">
                <h4 className="mb-3.5 text-[11px] font-bold uppercase tracking-[.14em] text-white/40">
                  {block.heading}
                </h4>
                {block.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mt-[13px] text-[16.5px] leading-relaxed text-white/70 first:mt-0"
                  >
                    {renderBold(p)}
                  </p>
                ))}
                {block.chips && (
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {block.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full border border-white/[0.08] bg-white/[0.045] px-3.5 py-2 text-[13.5px] font-semibold text-white/70"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-2 rounded-[20px] border border-[rgba(245,158,11,.2)] bg-[rgba(245,158,11,.06)] px-[26px] py-6">
              <div className="mb-3.5 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[.13em] text-[#fcd34d]">
                <AlertTriangle size={17} strokeWidth={2.3} />
                {data.pivot.heading}
              </div>
              <p className="text-[16.5px] leading-relaxed text-[#e4dcc9]">
                {renderBold(data.pivot.text)}
              </p>
              <div className="mt-5 grid grid-cols-1 items-center gap-2.5 sm:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-xl border border-white/[0.08] bg-black/[0.22] px-4 py-3.5 text-[14.5px] font-semibold leading-snug text-white/70">
                  {data.pivot.from}
                </div>
                <ArrowRight
                  className="mx-auto flex-shrink-0 text-[#fcd34d] max-sm:rotate-90"
                  size={20}
                  strokeWidth={2.6}
                />
                <div className="rounded-xl border border-[rgba(245,158,11,.32)] bg-black/[0.22] px-4 py-3.5 text-[14.5px] font-semibold leading-snug text-white">
                  {data.pivot.to}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="mb-3.5 text-[11px] font-bold uppercase tracking-[.14em] text-white/40">
                {data.afterBlock.heading}
              </h4>
              {data.afterBlock.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-[13px] text-[16.5px] leading-relaxed text-white/70 first:mt-0"
                >
                  {renderBold(p)}
                </p>
              ))}
            </div>

            <div className="mt-[34px] flex flex-wrap gap-3.5">
              <Button
                data-cta="hire-featured-case-study"
                data-cta-event="hire_case_study_click"
                href={data.ctaHref}
              >
                {data.ctaLabel}
              </Button>
              <Button
                data-cta="hire-evidence-request"
                data-cta-event="hire_contact_click"
                href={data.secondaryCtaHref}
                variant="ghost"
              >
                {data.secondaryCtaLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal index={1}>
            <aside className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.036] lg:sticky lg:top-[92px]">
              <div className="flex items-center gap-2.5 border-b border-white/[0.08] bg-white/[0.04] px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                <span className="h-2.5 w-2.5 rounded-full bg-stage-win" />
                <span className="ml-1.5 text-[11.5px] tracking-[.05em] text-white/70">
                  {data.chain.title}
                </span>
              </div>
              <div className="p-[22px]">
                <div className="flex flex-col">
                  {data.chain.steps.map((step, i) => (
                    <div key={step.label}>
                      <div className="flex items-center gap-3.5 py-[11px]">
                        <span className="w-[26px] flex-shrink-0 font-mono text-[11px] font-bold text-white/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{
                            backgroundColor: step.color,
                            boxShadow: `0 0 9px ${step.color}`,
                          }}
                        />
                        <span className="text-[14.5px] font-semibold leading-snug text-[#dce8f5]">
                          {step.label}
                        </span>
                      </div>
                      {i < data.chain.steps.length - 1 && (
                        <div className="ml-[39px] h-[9px] w-px bg-white/[0.14]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-[11px] border-t border-white/[0.08] pt-5">
                  <h5 className="mb-[3px] text-[10.5px] font-bold uppercase tracking-[.14em] text-white/40">
                    {data.chain.resultsHeading}
                  </h5>
                  {data.chain.results.map((result) => (
                    <div
                      key={result}
                      className="flex items-start gap-2.5 text-sm leading-snug text-white/70"
                    >
                      <CheckCircle2
                        className="mt-[3px] flex-shrink-0 text-stage-win"
                        size={15}
                        strokeWidth={2.6}
                      />
                      <span>{renderBold(result)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[14px] border border-dashed border-white/[0.14] bg-white/[0.018] px-4 py-[18px] text-center">
                  <ScanEye
                    className="mx-auto mb-2.5 text-white/40"
                    size={22}
                    strokeWidth={1.8}
                  />
                  <h6 className="mb-[5px] text-[13px] font-bold text-white/70">
                    {data.chain.evidenceHeading}
                  </h6>
                  <p className="text-[12.5px] leading-relaxed text-white/40">
                    {data.chain.evidenceNote}
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
