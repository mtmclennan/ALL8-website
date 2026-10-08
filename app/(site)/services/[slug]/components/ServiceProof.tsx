import Link from "next/link";
import { ArrowRight, LineChart, MapPin, Search } from "lucide-react";

import ServiceResources, { hasServiceResources } from "./ServiceResources";

import EvidenceTag, {
  type EvidenceKind,
} from "@/app/(site)/_components/EvidenceTag";
import { proofDisplay } from "@/data/proof";

type ProofStat = {
  icon: typeof LineChart;
  value: string;
  label: string;
  evidence: EvidenceKind;
};

const SEARCH_PROOF: ProofStat = {
  icon: LineChart,
  value: proofDisplay.searchRange,
  label: `Google Search clicks per rolling 28 days, ${proofDisplay.searchPeriod}`,
  evidence: "measured",
};

const LOCAL_PROOF: ProofStat[] = [
  SEARCH_PROOF,
  {
    icon: MapPin,
    value: proofDisplay.profileIncreaseSigned,
    label: "Google Business Profile website clicks, year over year",
    evidence: "measured",
  },
  {
    icon: Search,
    value: proofDisplay.pageOne,
    label: "Captured visibility for a targeted service page",
    evidence: "observed",
  },
];

/**
 * Proof only where the evidence is relevant (website and local-search work);
 * otherwise just the related reading row, attached under "How This Gets Set Up".
 */
export default function ServiceProof({ serviceSlug }: { serviceSlug: string }) {
  const isWebsite = serviceSlug === "lead-generation-websites";
  const isLocalSeo = serviceSlug === "local-seo-google-business-profile";
  const hasProof = isWebsite || isLocalSeo;
  const hasResources = hasServiceResources(serviceSlug);

  if (!hasProof && !hasResources) return null;

  if (!hasProof) {
    return (
      <section className="pb-24 max-[960px]:pb-16" id="resources-section">
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <ServiceResources flush serviceSlug={serviceSlug} />
        </div>
      </section>
    );
  }

  const stats = isLocalSeo ? LOCAL_PROOF : [SEARCH_PROOF];

  return (
    <section className="py-24 max-[960px]:py-16" id="proof">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <h2 className="all8-h2 font-extrabold tracking-[-.022em]">
          Measured search visibility
        </h2>
        <p className="mt-3 max-w-[720px] font-body leading-relaxed text-white/70">
          An anonymized service-business client saw these results during
          connected website and local search work. They are acquisition
          measures, not promised lead or revenue outcomes.
        </p>
        <div
          className={`mt-7 grid gap-4 ${stats.length > 1 ? "md:grid-cols-3" : "max-w-[400px]"}`}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.1] bg-white/[0.035] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <stat.icon
                  aria-hidden="true"
                  className="text-accent-blue"
                  size={20}
                />
                <EvidenceTag kind={stat.evidence} />
              </div>
              <p className="mt-4 text-3xl font-black tracking-[-.03em] text-accent-blue">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-[720px] font-body text-sm leading-relaxed text-white/60">
          Search growth compares measured 28-day windows in 2026.
          {isLocalSeo
            ? " Captured page-one visibility is a point-in-time observation, not a permanent ranking."
            : null}
        </p>
        <Link
          className="group mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-accent-blue hover:underline hover:underline-offset-4"
          href="/work/service-business-growth-case-study"
        >
          Read the anonymized service-business case study
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
            size={16}
          />
        </Link>
        {hasResources && <ServiceResources serviceSlug={serviceSlug} />}
      </div>
    </section>
  );
}
