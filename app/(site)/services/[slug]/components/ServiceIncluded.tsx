import type { ServiceIncluded as ServiceIncludedData } from "@/data/services";

import { Check, Plus } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";
import { Card } from "@/app/(site)/_components/SectionWrapper";

export default function ServiceIncluded({
  included,
}: {
  included: ServiceIncludedData;
}) {
  if (!included?.standard?.length) return null;

  const hasAddOns = !!included.addOns?.length;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="included">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            What&rsquo;s Included
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {included.title || "Standard Scope"}
          </h2>
        </Reveal>

        <div
          className={`mx-auto grid max-w-[960px] grid-cols-1 gap-6 ${hasAddOns ? "lg:grid-cols-2" : ""}`}
        >
          <Reveal>
            <Card className="h-full p-8" variant="lift">
              <h3 className="mb-5 text-lg font-bold">Standard</h3>
              <ul className="flex flex-col gap-3.5">
                {included.standard.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 flex-shrink-0 text-stage-win"
                      size={17}
                      strokeWidth={3}
                    />
                    <span className="text-[15px] leading-relaxed text-white/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {hasAddOns && (
            <Reveal index={1}>
              <Card className="h-full p-8" variant="lift">
                <h3 className="mb-5 text-lg font-bold">Optional Add-Ons</h3>
                <ul className="flex flex-col gap-3.5">
                  {included.addOns!.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Plus
                        className="mt-0.5 flex-shrink-0 text-accent-blue"
                        size={17}
                        strokeWidth={3}
                      />
                      <span className="text-[15px] leading-relaxed text-white/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
