import type { HireMattPageData } from "@/data/pages/hire-matt";

import Reveal from "../../_components/home/Reveal";
import { Card } from "../../_components/SectionWrapper";

import { renderBold } from "@/lib/utils/renderBold";

export default function HowIThink({
  data,
}: {
  data: HireMattPageData["process"];
}) {
  return (
    <section className="py-24 max-[960px]:py-16" id="process">
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.steps.map((step, i) => (
            <Reveal key={step.title} index={i}>
              <Card className="h-full p-[26px]" variant="lift">
                <div
                  className="mb-4 flex items-center gap-2.5 font-mono text-[13px] font-bold tracking-[.06em]"
                  style={{ color: step.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                  <span
                    className="h-px flex-1"
                    style={{
                      backgroundColor: step.color,
                      opacity: 0.24,
                    }}
                  />
                </div>
                <h3 className="mb-2.5 text-xl font-extrabold tracking-[-.018em]">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-white/70">
                  {step.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-11 max-w-[760px] text-lg leading-relaxed text-white/70">
          {renderBold(data.note)}
        </Reveal>
      </div>
    </section>
  );
}
