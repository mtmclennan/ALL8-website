import Button from "../ui/Button";
import PlanCard from "../../pricing/components/PlanCard";

import { PLANS } from "@/data/plans";

export default function PlansPreview() {
  return (
    <section
      className="scroll-mt-20 bg-content3 py-24 max-[960px]:py-16"
      id="plans"
    >
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="mb-10 max-w-[720px]">
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
            Plans
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            The review finds the gap. A focused Tune-Up or an ongoing plan puts
            the right pieces in place. These are four common starting points.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.slice(0, 4).map((plan) => (
            <PlanCard key={plan.id} compact plan={plan} />
          ))}
        </div>

        <p className="mt-6 max-w-[900px] text-sm leading-relaxed text-white/60">
          U.S. prices are in USD. Canadian clients pay the same numeric prices
          in CAD plus applicable HST. Growth System and Google Ads Management
          are also available.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Button href="/contact">Get My Free Lead Leak Review</Button>
          <Button href="/pricing" variant="ghost">
            Compare all plans
          </Button>
        </div>
      </div>
    </section>
  );
}
