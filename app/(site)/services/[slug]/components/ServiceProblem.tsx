import type { ServiceProblem as ServiceProblemData } from "@/data/services";

import { AlertTriangle } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";

export default function ServiceProblem({
  problem,
}: {
  problem: ServiceProblemData;
}) {
  if (!problem?.scenarios?.length) return null;

  return (
    <section className="py-24 max-[960px]:py-16" id="problem">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mb-11">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            The Problem
          </div>
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.08] tracking-[-.022em]">
            {problem.title}
          </h2>
          {problem.intro && (
            <p className="mt-3.5 max-w-[640px] text-[17px] leading-relaxed text-white/70">
              {problem.intro}
            </p>
          )}
        </Reveal>

        <div className="flex flex-col gap-2.5">
          {problem.scenarios.map((s, i) => (
            <Reveal key={s} index={i}>
              <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-6 py-4.5">
                <AlertTriangle
                  className="mt-0.5 flex-shrink-0 text-[#f59e0b]"
                  size={17}
                  strokeWidth={2.3}
                />
                <p className="text-[15.5px] leading-relaxed text-white/80">
                  {s}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
