import type { ServiceWhyItMatters as ServiceWhyItMattersData } from "@/data/services";

import { CheckCircle2 } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";

export default function ServiceWhyItMatters({
  whyItMatters,
}: {
  whyItMatters: ServiceWhyItMattersData;
}) {
  if (!whyItMatters?.points?.length) return null;

  return (
    <section className="py-24 max-[960px]:py-16" id="why-it-matters">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Why It Matters
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {whyItMatters.title || "What This Actually Changes"}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {whyItMatters.points.map((point, i) => (
            <Reveal key={point} index={i}>
              <div className="flex h-full items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-6 py-5">
                <CheckCircle2
                  className="mt-0.5 flex-shrink-0 text-stage-win"
                  size={19}
                  strokeWidth={2.2}
                />
                <p className="text-[15.5px] leading-relaxed text-white/80">
                  {point}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
