import type {
  ServiceProblem as ServiceProblemData,
  ServiceWhyItMatters as ServiceWhyItMattersData,
} from "@/data/services";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ServiceProblem({
  problem,
  whyItMatters,
}: {
  problem: ServiceProblemData;
  whyItMatters: ServiceWhyItMattersData;
}) {
  if (!problem?.scenarios?.length) return null;

  return (
    <section className="py-24 max-[960px]:py-16" id="problem">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="max-w-[760px]">
          <h2 className="all8-h2 font-extrabold leading-[1.08] tracking-[-.022em]">
            {problem.title}
          </h2>
          {problem.intro && (
            <p className="mt-4 font-body text-[17px] leading-relaxed text-white/70">
              {problem.intro}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="all8-h3 mb-4 font-bold">Where work gets lost</h3>
            <ul className="divide-y divide-white/[0.09] rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 sm:px-6">
              {problem.scenarios.map((scenario) => (
                <li key={scenario} className="flex gap-3 py-4">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-amber-400"
                    size={17}
                  />
                  <span className="font-body text-[15.5px] leading-relaxed text-white/80">
                    {scenario}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {whyItMatters?.points?.length > 0 && (
            <div id="why-it-matters">
              <h3 className="all8-h3 mb-4 font-bold">
                {whyItMatters.title || "What improves when this works"}
              </h3>
              <ul className="divide-y divide-white/[0.09] rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 sm:px-6">
                {whyItMatters.points.map((point) => (
                  <li key={point} className="flex gap-3 py-4">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-accent-blue"
                      size={18}
                    />
                    <span className="font-body text-[15.5px] leading-relaxed text-white/80">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
