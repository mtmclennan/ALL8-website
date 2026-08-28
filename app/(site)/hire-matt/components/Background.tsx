import type { HireMattPageData } from "@/data/pages/hire-matt";

import Reveal from "../../_components/home/Reveal";

import { renderBold } from "@/lib/utils/renderBold";

export default function Background({
  data,
}: {
  data: HireMattPageData["background"];
}) {
  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="background">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-2 lg:gap-[60px]">
          <Reveal>
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              {data.eyebrow}
            </div>
            <h2 className="mb-5 text-[clamp(28px,3.1vw,42px)] font-extrabold leading-[1.07] tracking-[-.026em]">
              {data.title}
            </h2>
            {data.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mb-4 text-[17px] leading-relaxed text-white/70"
              >
                {renderBold(p)}
              </p>
            ))}
            <div className="mt-[26px] border-t border-white/[0.08] pt-6">
              <h4 className="mb-3.5 text-[11px] font-bold uppercase tracking-[.14em] text-white/40">
                {data.sectorsHeading}
              </h4>
              <ul className="flex flex-wrap gap-2.5">
                {data.sectors.map((sector) => (
                  <li
                    key={sector}
                    className="rounded-full border border-[rgba(61,151,255,.22)] bg-[rgba(61,151,255,.09)] px-3.5 py-2 text-[13.5px] font-semibold text-[#cfe4ff]"
                  >
                    {sector}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-3.5" index={1}>
            <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.036] px-7 py-[26px]">
              <h4 className="mb-3 text-[10.5px] font-bold uppercase tracking-[.15em] text-white/40">
                {data.equation.real.heading}
              </h4>
              <p className="text-base leading-relaxed text-white/70">
                {data.equation.real.body}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3.5 font-mono text-xl font-bold text-white/40">
              <span className="h-px flex-1 bg-white/[0.08]" />+
              <span className="h-px flex-1 bg-white/[0.08]" />
            </div>
            <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.036] px-7 py-[26px]">
              <h4 className="mb-3 text-[10.5px] font-bold uppercase tracking-[.15em] text-white/40">
                {data.equation.technical.heading}
              </h4>
              <p className="text-base leading-relaxed text-white/70">
                {data.equation.technical.body}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3.5 font-mono text-xl font-bold text-white/40">
              <span className="h-px flex-1 bg-white/[0.08]" />=
              <span className="h-px flex-1 bg-white/[0.08]" />
            </div>
            <div className="rounded-[20px] border border-[rgba(61,151,255,.34)] bg-gradient-to-b from-[rgba(0,118,255,.14)] to-[rgba(0,118,255,.04)] px-7 py-[26px]">
              <h4 className="mb-3 text-[10.5px] font-bold uppercase tracking-[.15em] text-accent-blue">
                {data.equation.result.heading}
              </h4>
              <p className="text-lg font-bold leading-snug tracking-[-.015em] text-white">
                {data.equation.result.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
