import {
  Search,
  MousePointerClick,
  Phone,
  Repeat,
  CheckCircle2,
} from "lucide-react";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";
import Reveal from "@/app/(site)/_components/home/Reveal";

type JourneyData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: {
    stage: Stage;
    icon: "search" | "click" | "phone" | "follow" | "check";
    title: string;
    description: string;
  }[];
  note: string;
};

const ICONS = {
  search: Search,
  click: MousePointerClick,
  phone: Phone,
  follow: Repeat,
  check: CheckCircle2,
};

export default function LeadJourney({ data }: { data: JourneyData }) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="journey">
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

        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {data.steps.map((step, i) => {
            const hex = STAGE_HEX[step.stage];
            const Icon = ICONS[step.icon];
            const isLast = i === data.steps.length - 1;

            return (
              <Reveal key={step.title} className="relative" index={i}>
                <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.036] p-[26px_16px] text-center transition-colors hover:bg-white/[0.058]">
                  <div
                    className="mx-auto mb-3.5 grid h-10 w-10 place-items-center rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(hex, 0.12),
                      border: `1px solid ${hexToRgba(hex, 0.24)}`,
                      color: hex,
                    }}
                  >
                    <Icon size={19} strokeWidth={2.2} />
                  </div>
                  <h3 className="mb-1.5 text-[15.5px] font-bold tracking-[-.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white/70">
                    {step.description}
                  </p>
                </div>
                {!isLast && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-[9px] top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r-[1.5px] border-t-[1.5px] border-white/40 lg:block"
                  />
                )}
              </Reveal>
            );
          })}
        </div>

        <p className="mt-[26px] text-center text-[15px] text-white/40">
          {data.note}
        </p>
      </div>
    </section>
  );
}
