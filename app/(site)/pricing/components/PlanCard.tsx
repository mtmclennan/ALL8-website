import type { Plan } from "@/data/plans";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function PlanCard({
  plan,
  compact = false,
}: {
  plan: Plan;
  compact?: boolean;
}) {
  return (
    <article
      className="flex h-full min-w-0 flex-col rounded-2xl border border-white/[0.12] bg-white/[0.036] p-6 sm:p-7"
      id={compact ? undefined : plan.id}
    >
      <h3 className="all8-h3 font-bold leading-tight">{plan.name}</h3>
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[.1em] text-white/60">
          {plan.kind === "entry"
            ? plan.id === "free-review"
              ? "Review"
              : "One-time fee"
            : "Setup fee"}
        </p>
        <p className="text-[25px] font-extrabold leading-tight tracking-[-.02em] text-white">
          {plan.setup}
        </p>
        {plan.monthly && (
          <p className="mt-2 text-sm font-semibold text-accent-blue">
            Monthly fee: {plan.monthly}
          </p>
        )}
        <p className="mt-2 text-sm font-semibold text-white/70">{plan.term}</p>
      </div>
      <p className="mt-5 border-t border-white/[0.09] pt-4 text-sm leading-relaxed text-white/70">
        <span className="font-bold text-white">Best for: </span>
        {plan.bestFor}
      </p>
      {!compact && (
        <>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
            {plan.inclusions.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-accent-blue"
                  size={16}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {plan.note && (
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              {plan.note}
            </p>
          )}
          <Link
            className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-lg pt-6 text-sm font-bold text-accent-blue underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            href="/contact"
          >
            {plan.id === "free-review"
              ? "Get My Free Lead Leak Review"
              : `Discuss ${plan.name}`}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </>
      )}
    </article>
  );
}
