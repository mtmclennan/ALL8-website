import { ArrowRight } from "lucide-react";

import Reveal from "./Reveal";

type FlowData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  rows: { a: string; b: string }[];
  note: string;
};

export default function IntegrationsFlow({ data }: { data: FlowData }) {
  return (
    <section className="py-20 max-[960px]:py-16" id="connected">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-11 max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.1] tracking-[-.026em]">
            {data.title}
          </h2>
          <p className="mt-3.5 max-w-[620px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="mx-auto flex max-w-[840px] flex-col gap-3">
          {data.rows.map((row, i) => (
            <Reveal key={row.a} index={i}>
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-6 py-5 transition-colors hover:border-[rgba(26,124,240,.26)] hover:bg-white/[0.058] sm:grid-cols-[1fr_auto_1fr]">
                <div className="text-[15px] font-bold text-white sm:text-right">
                  {row.a}
                </div>
                <ArrowRight
                  className="text-accent-blue max-[580px]:rotate-90"
                  size={20}
                  strokeWidth={2.4}
                />
                <div className="text-[15px] leading-relaxed text-white/70">
                  {row.b}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-[30px] text-center text-[15px] text-white/40">
          {data.note}
        </p>
      </div>
    </section>
  );
}
