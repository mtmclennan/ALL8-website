"use client";

import Link from "next/link";

import { STAGE_HEX, hexToRgba, type Stage } from "@/lib/utils/stage";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import Reveal from "@/app/(site)/_components/home/Reveal";
import Button from "@/app/(site)/_components/ui/Button";

const CAPABILITY_SERVICE_LINKS: Record<string, string> = {
  "Local SEO": "local-seo-google-business-profile",
  "Google Business Profile": "local-seo-google-business-profile",
  "Service & location pages": "lead-generation-websites",
  "Google Ads": "google-ads-lead-generation",
  "AI & generative search visibility": "local-seo-google-business-profile",
  "Technical SEO": "lead-generation-websites",
  "Conversion-focused websites": "lead-generation-websites",
  "Landing pages": "lead-generation-websites",
  "Quote & contact forms": "lead-generation-websites",
  "Call tracking": "call-tracking-lead-attribution",
  "Business phone / VoIP": "missed-call-recovery",
  "Missed-call text-back": "missed-call-recovery",
  "Lead intake & answering": "missed-call-recovery",
  "CRM setup": "crm-sales-pipeline",
  "Sales pipeline setup": "crm-sales-pipeline",
  "Email follow-up": "lead-follow-up-automation",
  "SMS follow-up": "lead-follow-up-automation",
  "Lead notifications": "lead-follow-up-automation",
  "Estimate & appointment workflows": "lead-follow-up-automation",
  "Lead routing": "crm-sales-pipeline",
  "Tool integrations": "custom-lead-systems",
  Analytics: "call-tracking-lead-attribution",
  "Conversion tracking": "call-tracking-lead-attribution",
  "Call attribution": "call-tracking-lead-attribution",
  "Form attribution": "call-tracking-lead-attribution",
  "Search performance": "local-seo-google-business-profile",
  "Lead-source tracking": "call-tracking-lead-attribution",
  "Pipeline visibility": "crm-sales-pipeline",
  Reporting: "call-tracking-lead-attribution",
};

type OutcomesData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  blocks: {
    stage: Stage;
    num: string;
    label: string;
    title: string;
    description: string;
    capabilities: string[];
  }[];
  winBand: { title: string; subtitle: string; ctaLabel: string };
};

export default function OutcomeBlocks({ data }: { data: OutcomesData }) {
  const { openModal } = useLeadModal();

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="outcomes">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {data.eyebrow}
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            {data.title}
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            {data.subtitle}
          </p>
        </Reveal>

        {data.blocks.map((block, i) => {
          const hex = STAGE_HEX[block.stage];

          return (
            <Reveal
              key={block.label}
              className={`grid grid-cols-1 gap-8 border-white/[0.08] py-11 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 ${i === 0 ? "border-t-0 pt-0" : "border-t"}`}
              index={i}
            >
              <div>
                <div className="mb-[18px] flex items-center gap-3">
                  <div
                    className="grid h-[34px] w-[34px] place-items-center rounded-[10px] text-sm font-black"
                    style={{
                      backgroundColor: hexToRgba(hex, 0.14),
                      border: `1px solid ${hexToRgba(hex, 0.3)}`,
                      color: hex,
                    }}
                  >
                    {block.num}
                  </div>
                  <div
                    className="text-[11.5px] font-bold uppercase tracking-[.13em]"
                    style={{ color: hex }}
                  >
                    {block.label}
                  </div>
                </div>
                <h3 className="mb-3.5 text-[clamp(27px,2.9vw,38px)] font-extrabold leading-[1.08] tracking-[-.025em]">
                  {block.title}
                </h3>
                <p className="text-[16.5px] leading-relaxed text-white/70">
                  {block.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {block.capabilities.map((cap) => {
                  const slug = CAPABILITY_SERVICE_LINKS[cap];
                  const chipClasses =
                    "flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.036] px-[18px] py-[15px] text-[14.5px] font-semibold text-white/70 transition-colors";
                  const dot = (
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: hex }}
                    />
                  );

                  if (slug) {
                    return (
                      <Link
                        key={cap}
                        className={`${chipClasses} hover:border-[rgba(0,118,255,.26)] hover:bg-white/[0.058] hover:text-white`}
                        href={`/services/${slug}`}
                      >
                        {dot}
                        {cap}
                      </Link>
                    );
                  }

                  return (
                    <div key={cap} className={chipClasses}>
                      {dot}
                      {cap}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          );
        })}

        <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-7 rounded-[20px] border border-[rgba(0,118,255,.24)] bg-gradient-to-br from-[rgba(0,118,255,.13)] to-[rgba(34,197,94,.08)] px-10 py-11 max-[960px]:px-7 max-[960px]:py-8">
          <div>
            <h3 className="text-[clamp(25px,2.7vw,34px)] font-black leading-[1.1] tracking-[-.025em]">
              {data.winBand.title}
            </h3>
            <p className="mt-2 max-w-[520px] text-base leading-relaxed text-white/70">
              {data.winBand.subtitle}
            </p>
          </div>
          <Button onClick={openModal}>{data.winBand.ctaLabel}</Button>
        </Reveal>
      </div>
    </section>
  );
}
