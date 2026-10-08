import type { Plan } from "@/data/plans";

import clsx from "clsx";

import { getPlanPriceDisplay } from "@/data/plans";

/** Monthly-first price block shared by pricing, homepage and service-page plan cards. */
export default function PlanPrice({
  plan,
  size = "lg",
  className,
}: {
  plan: Plan;
  size?: "lg" | "sm";
  className?: string;
}) {
  const price = getPlanPriceDisplay(plan);

  return (
    <div className={className}>
      <p
        className={clsx(
          "font-extrabold leading-tight tracking-[-.02em] text-white",
          size === "lg" ? "text-[28px]" : "text-[21px]",
        )}
      >
        {price.amount}
        {price.unit && (
          <span
            className={clsx(
              "ml-0.5 font-bold tracking-normal text-white/70",
              size === "lg" ? "text-base" : "text-sm",
            )}
          >
            {price.unit}
          </span>
        )}
      </p>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-white/70">
        {price.detail}
      </p>
    </div>
  );
}
