import Reveal from "./Reveal";

import { STAGE_HEX, type Stage } from "@/lib/utils/stage";
import { renderBold } from "@/lib/utils/renderBold";

type LeakData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  columns: { label: string; stage: Stage; items: string[] }[];
  note: string;
};

export default function LeakSection({ data }: { data: LeakData }) {
  return (
    <section className="py-[132px] max-[960px]:py-20" id="leak">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
          <p className="mt-3.5 max-w-[620px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-[34px] lg:grid-cols-3 lg:gap-11">
          {data.columns.map((col, i) => {
            const hex = STAGE_HEX[col.stage];

            return (
              <Reveal key={col.label} index={i}>
                <div
                  className="border-l pl-5"
                  style={{ borderColor: `${hex}42` }}
                >
                  <div
                    className="mb-[22px] text-[11.5px] font-bold uppercase tracking-[.13em]"
                    style={{ color: hex }}
                  >
                    {col.label}
                  </div>
                  <ul className="flex flex-col gap-[19px]">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-[13px] text-[16.5px] leading-[1.72] text-white/70"
                      >
                        <span
                          className="mt-[10px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{
                            backgroundColor: hex,
                            boxShadow: `0 0 8px ${hex}8c`,
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-[52px] max-w-[660px] text-[19px] leading-relaxed text-white/70">
            {renderBold(data.note)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
