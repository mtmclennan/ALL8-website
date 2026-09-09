"use client";

import type { ServicePricing as ServicePricingData } from "@/data/services";

import { Search } from "lucide-react";

import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";
import { Card } from "@/app/(site)/_components/SectionWrapper";

export default function ServicePricing({
  pricing,
}: {
  pricing: ServicePricingData;
}) {
  const { openModal } = useLeadModal();

  if (!pricing?.label) return null;

  const hasTiers = !!pricing.tiers?.length;

  return (
    <section className="py-24 max-[960px]:py-16" id="pricing">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-11 max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Pricing
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {pricing.label}
          </h2>
          {pricing.note && (
            <p className="mx-auto mt-3.5 max-w-[560px] text-[15.5px] leading-relaxed text-white/60">
              {pricing.note}
            </p>
          )}
        </Reveal>

        {hasTiers && (
          <div className="mb-11 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pricing.tiers!.map((tier, i) => (
              <Reveal key={tier.label} index={i}>
                <Card className="h-full p-7" variant="lift">
                  <div className="mb-1.5 text-[13px] font-bold uppercase tracking-[.1em] text-accent-blue">
                    {tier.label}
                  </div>
                  <div className="mb-2.5 text-2xl font-black tracking-[-.02em]">
                    {tier.price}
                  </div>
                  {tier.description && (
                    <p className="text-sm leading-relaxed text-white/70">
                      {tier.description}
                    </p>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="text-center" index={hasTiers ? 2 : 0}>
          <Button size="lg" onClick={openModal}>
            <Search size={16} strokeWidth={2.5} />
            Get My Free Lead System Review
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
