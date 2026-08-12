import Reveal from "./Reveal";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";

type ProcessData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: { stage: Stage; title: string; description: string }[];
};

export default function ProcessSteps({ data }: { data: ProcessData }) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16">
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

        <div className="relative grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-4 lg:gap-y-0">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[37px] hidden h-px bg-gradient-to-r from-transparent via-[rgba(26,124,240,.4)] via-20% to-transparent lg:block" />
          {data.steps.map((step, i) => {
            const hex = STAGE_HEX[step.stage];

            return (
              <Reveal
                key={step.title}
                className="flex flex-col items-center px-5 text-center"
                index={i}
              >
                <div
                  className="relative z-[1] mb-6 grid h-[76px] w-[76px] place-items-center rounded-full border-[1.5px] text-[28px] font-black"
                  style={{ borderColor: hexToRgba(hex, 0.45), color: hex }}
                >
                  <span
                    className="pointer-events-none absolute -inset-[7px] rounded-full border border-dashed"
                    style={{ borderColor: hexToRgba(hex, 0.26) }}
                  />
                  {i + 1}
                </div>
                <h3 className="mb-2.5 text-[17px] font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
