import type { Plan } from "@/data/plans";

import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Check } from "lucide-react";

import PlanPrice from "./PlanPrice";

export default function PlanCard({
  plan,
  compact = false,
  horizontal = false,
}: {
  plan: Plan;
  compact?: boolean;
  /** Full-width layout: price and fit on the left, inclusions on the right. */
  horizontal?: boolean;
}) {
  const summary = (
    <>
      <h3 className="all8-h3 font-bold">{plan.name}</h3>
      <PlanPrice className="mt-4" plan={plan} />
      <p className="mt-5 border-t border-white/[0.09] pt-4 text-sm leading-relaxed text-white/70">
        <span className="font-bold text-white">Best for: </span>
        {plan.bestFor}
      </p>
    </>
  );

  const details = (
    <>
      <ul className="space-y-3 text-sm leading-relaxed text-white/70">
        {plan.adds && (
          <li className="flex gap-2.5 font-bold text-white">
            <Check
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent-blue"
              size={16}
            />
            <span>{plan.adds}</span>
          </li>
        )}
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
        className="group mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-6 text-sm font-bold text-accent-blue hover:underline hover:underline-offset-4"
        href="/contact"
      >
        {plan.id === "free-review"
          ? "Get My Free Lead Leak Review"
          : `Discuss ${plan.name}`}
        <ArrowRight
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
          size={16}
        />
      </Link>
    </>
  );

  return (
    <article
      className={clsx(
        "h-full min-w-0 rounded-2xl border border-white/[0.12] bg-white/[0.036] p-6 sm:p-7",
        horizontal
          ? "grid gap-6 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:gap-10"
          : "flex flex-col",
      )}
      id={compact ? undefined : plan.id}
    >
      {horizontal ? (
        <>
          <div>{summary}</div>
          {!compact && <div className="flex flex-col">{details}</div>}
        </>
      ) : (
        <>
          {summary}
          {!compact && (
            <div className="mt-5 flex flex-1 flex-col">{details}</div>
          )}
        </>
      )}
    </article>
  );
}
