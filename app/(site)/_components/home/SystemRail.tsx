"use client";

import { useLeadModal } from "../LeadModalProvider";
import Button from "../ui/Button";

import Reveal from "./Reveal";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";
import { renderBold } from "@/lib/utils/renderBold";

type SystemData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stages: {
    stage: Stage;
    step: string;
    title: string;
    description: string;
    tags: string[];
  }[];
  footNote: string;
  ctaLabel: string;
};

export default function SystemRail({ data }: { data: SystemData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="bg-content3 py-[132px] max-[960px]:py-20" id="system">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[60px] max-w-[640px] text-center">
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

        <div className="relative grid grid-cols-1 gap-x-[22px] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[11%] right-[11%] top-[31px] hidden h-0.5 overflow-hidden rounded-full bg-gradient-to-r from-[rgba(66,152,255,.15)] via-[rgba(66,152,255,.5)] via-[14%] to-[rgba(34,197,94,.15)] lg:block">
            <div className="animate-rail-travel absolute left-[-16%] top-0 h-full w-[16%] bg-gradient-to-r from-transparent via-white/90 to-transparent" />
          </div>

          {data.stages.map((s, i) => {
            const hex = STAGE_HEX[s.stage];
            const isLast = i === data.stages.length - 1;

            return (
              <Reveal
                key={s.stage}
                className="relative flex flex-col items-center text-center"
                index={i}
              >
                <div
                  className="relative z-[1] mb-5 grid h-16 w-16 place-items-center rounded-[18px] border-[1.5px]"
                  style={{
                    borderColor: hexToRgba(hex, isLast ? 0.68 : 0.42),
                    backgroundColor: isLast ? hexToRgba(hex, 0.14) : undefined,
                    boxShadow: isLast
                      ? `0 0 28px -4px ${hexToRgba(hex, 0.55)}`
                      : undefined,
                  }}
                >
                  <StageIcon hex={hex} stage={s.stage} />
                </div>
                <div
                  className="mb-1.5 text-[11px] font-bold uppercase tracking-[.14em]"
                  style={{ color: hex }}
                >
                  {s.step}
                </div>
                <h3 className="mb-2 text-[19px] font-extrabold tracking-[-.015em]">
                  {s.title}
                </h3>
                <p className="mb-4 text-[14.5px] leading-relaxed text-white/70">
                  {s.description}
                </p>
                <div className="flex flex-wrap justify-center gap-[7px]">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-[11px] py-[5px] text-xs font-semibold"
                      style={{
                        backgroundColor: `${hex}17`,
                        border: `1px solid ${hex}38`,
                        color: hex,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-[52px] flex flex-wrap items-center justify-center gap-5 rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-7 text-center">
          <p className="max-w-[620px] text-base leading-relaxed text-white/70">
            {renderBold(data.footNote)}
          </p>
          <Button onClick={openModal}>{data.ctaLabel}</Button>
        </Reveal>
      </div>
    </section>
  );
}

function StageIcon({ stage, hex }: { stage: Stage; hex: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: hex,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (stage) {
    case "found":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.35-4.35" />
        </svg>
      );
    case "contacted":
      return (
        <svg {...common}>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      );
    case "follow":
      return (
        <svg {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "win":
      return (
        <svg {...common} strokeWidth={2.2}>
          <path d="M3 3v18h18" />
          <path d="m7 15 4-4 3 3 5-6" />
        </svg>
      );
  }
}
