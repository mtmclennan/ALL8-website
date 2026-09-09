import type { HireMattPageData } from "@/data/pages/hire-matt";

import { HelpCircle } from "lucide-react";

import Reveal from "../../_components/home/Reveal";

export default function ValueForYou({
  data,
}: {
  data: HireMattPageData["valueForYou"];
}) {
  return (
    <section className="py-24 max-[960px]:py-16" id="value-you">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-14 max-w-[760px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.024em]">
            {data.title}
          </h2>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="flex max-w-[900px] flex-col gap-3">
          {data.rows.map((row, i) => (
            <Reveal key={row.q} index={i}>
              <div className="grid grid-cols-1 items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-6 py-6 transition-colors hover:border-[rgba(61,151,255,.28)] hover:bg-white/[0.058] sm:grid-cols-[.9fr_1.1fr] sm:gap-7">
                <div className="flex items-start gap-3 text-base font-bold leading-snug tracking-[-.012em] text-white">
                  <HelpCircle
                    className="mt-[3px] flex-shrink-0 text-[#f59e0b]"
                    size={17}
                    strokeWidth={2.4}
                  />
                  {row.q}
                </div>
                <p className="text-[15.5px] leading-relaxed text-white/70">
                  {row.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
