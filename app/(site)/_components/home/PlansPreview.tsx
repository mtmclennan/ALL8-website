import { Search } from "lucide-react";

import Button from "../ui/Button";
import LeadReviewButton from "../LeadReviewButton";
import PlanCard from "../../pricing/components/PlanCard";

import { PLANS } from "@/data/plans";

export default function PlansPreview() {
  return (
    <section className="scroll-mt-20 py-24 max-[960px]:py-16" id="plans">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="mb-10 max-w-[720px]">
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
            Plans
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            Start with the free review, fix one priority with a Tune-Up, or let
            us run your website and lead handling every month. Prices, setup
            fees and minimum terms are shown up front, and scope and price are
            agreed before any work starts.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.slice(0, 4).map((plan) => (
            <PlanCard key={plan.id} compact plan={plan} />
          ))}
        </div>

        <p className="mt-6 max-w-[900px] text-sm leading-relaxed text-white/60">
          Growth System and Google Ads Management are also available.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <LeadReviewButton>
            <Search size={16} strokeWidth={2.5} />
            Get My Free Lead Leak Review
          </LeadReviewButton>
          <Button href="/pricing" variant="ghost">
            Compare all plans
          </Button>
        </div>
      </div>
    </section>
  );
}
