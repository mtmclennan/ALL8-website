import type { HireMattPageData } from "@/data/pages/hire-matt";

import Reveal from "../../_components/home/Reveal";

export default function SkillsGrid({
  data,
}: {
  data: HireMattPageData["skills"];
}) {
  return (
    <section className="bg-content3 py-[76px] max-[960px]:py-16" id="skills">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-11 max-w-[640px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-[18px]">
          {data.columns.map((col, i) => (
            <Reveal key={col.title} index={i}>
              <h3
                className="mb-4 flex items-center gap-2.5 border-b-2 pb-3 text-[15px] font-extrabold tracking-[-.01em]"
                style={{ borderColor: `${col.color}73` }}
              >
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: col.color,
                    boxShadow: `0 0 8px ${col.color}`,
                  }}
                />
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="text-[14.5px] leading-snug text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
