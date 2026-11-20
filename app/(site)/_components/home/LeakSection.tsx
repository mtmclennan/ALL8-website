import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "./Reveal";

import { STAGE_HEX, type Stage } from "@/lib/utils/stage";
import { renderBold } from "@/lib/utils/renderBold";

type LeakData = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  columns: { label: string; stage: Stage; items: string[] }[];
  note: string;
  link?: { prefix: string; label: string; href: string };
};

export default function LeakSection({ data }: { data: LeakData }) {
  return (
    <section className="py-24 max-[960px]:py-16" id="leak">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-[52px] max-w-[720px]">
          {data.eyebrow ? (
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              {data.eyebrow}
            </div>
          ) : null}
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
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
          {data.link && (
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/70">
              {data.link.prefix}{" "}
              <Link
                className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-accent-blue underline underline-offset-4 hover:text-[#8ec5ff]"
                href={data.link.href}
              >
                {data.link.label}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                  size={15}
                />
              </Link>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
