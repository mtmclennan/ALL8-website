import type { HireMattPageData } from "@/data/pages/hire-matt";

import { Code2, Search, LineChart, Share2, Sparkles } from "lucide-react";

import Reveal from "../../_components/home/Reveal";

import { renderBold } from "@/lib/utils/renderBold";
import { hexToRgba } from "@/lib/utils/stage";

const ICONS: Record<string, typeof Code2> = {
  build: Code2,
  grow: Search,
  measure: LineChart,
  connect: Share2,
  improve: Sparkles,
};

export default function MoreThanDeveloper({
  data,
}: {
  data: HireMattPageData["capability"];
}) {
  return (
    <section className="py-24 max-[960px]:py-16" id="value">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-14 max-w-[760px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.024em]">
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[17.5px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-9 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[18px]">
          <div className="pointer-events-none absolute left-[9%] right-[9%] top-[29px] hidden h-0.5 overflow-hidden rounded-full bg-gradient-to-r from-[rgba(61,151,255,.14)] via-[rgba(61,151,255,.5)] via-[12%] via-[rgba(34,211,238,.5)] via-[33%] via-[rgba(245,158,11,.5)] via-[52%] via-[rgba(34,197,94,.5)] via-[72%] via-[rgba(167,139,250,.5)] via-[90%] to-[rgba(167,139,250,.14)] lg:block" />

          {data.columns.map((col, i) => {
            const Icon = ICONS[col.icon] ?? Code2;

            return (
              <Reveal
                key={col.title}
                className="relative flex flex-col items-center text-center"
                index={i}
              >
                <div
                  className="relative z-[1] mb-[18px] grid h-[58px] w-[58px] place-items-center rounded-2xl bg-background ring-8 ring-background"
                  style={{
                    border: `1.5px solid ${hexToRgba(col.color, 0.44)}`,
                    color: col.color,
                  }}
                >
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="mb-3.5 text-lg font-extrabold tracking-[-.015em]">
                  {col.title}
                </h3>
                <ul className="flex w-full flex-col gap-2">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[9px] px-2.5 py-2 text-[13px] font-semibold leading-[1.35] text-[#cfe0f0]"
                      style={{
                        backgroundColor: hexToRgba(col.color, 0.07),
                        border: `1px solid ${hexToRgba(col.color, 0.18)}`,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Reveal
          className="mx-auto mt-12 max-w-[820px] rounded-[20px] border border-white/[0.08] bg-white/[0.036] px-[30px] py-[26px] text-center text-[17.5px] leading-relaxed text-white/70"
          index={0}
        >
          {renderBold(data.note)}
        </Reveal>
      </div>
    </section>
  );
}
