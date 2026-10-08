import Link from "next/link";
import { ArrowRight, LineChart, MapPin, Search } from "lucide-react";

import ServiceResources, { hasServiceResources } from "./ServiceResources";

import { proofDisplay } from "@/data/proof";

const SEARCH_PROOF = {
  icon: LineChart,
  value: proofDisplay.searchRange,
  label: `Google Search clicks per rolling 28 days, ${proofDisplay.searchPeriod}`,
};

const LOCAL_PROOF = [
  SEARCH_PROOF,
  {
    icon: MapPin,
    value: proofDisplay.profileIncreaseSigned,
    label: "Google Business Profile website clicks, year over year",
  },
  {
    icon: Search,
    value: proofDisplay.pageOne,
    label: "Captured visibility for a targeted service page",
  },
];

export default function ServiceProof({
  serviceSlug,
  serviceTitle,
}: {
  serviceSlug: string;
  serviceTitle: string;
}) {
  const isWebsite = serviceSlug === "lead-generation-websites";
  const isLocalSeo = serviceSlug === "local-seo-google-business-profile";
  const hasProof = isWebsite || isLocalSeo;
  const hasResources = hasServiceResources(serviceSlug);

  if (!hasProof && !hasResources) return null;

  const stats = isLocalSeo ? LOCAL_PROOF : [SEARCH_PROOF];

  return (
    <section className="py-24 max-[960px]:py-16" id="proof">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <h2 className="all8-h2 font-extrabold">
          {hasProof ? "Measured search visibility" : `Explore ${serviceTitle}`}
        </h2>
        {hasProof && (
          <>
            <p className="mt-3 max-w-[720px] font-body leading-relaxed text-white/70">
              An anonymized service-business client saw these results during
              connected website and local search work. They are acquisition
              measures, not promised lead or revenue outcomes.
            </p>
            <div
              className={`mt-7 grid gap-4 ${stats.length > 1 ? "sm:grid-cols-3" : ""}`}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.1] bg-white/[0.035] p-6"
                >
                  <stat.icon
                    aria-hidden="true"
                    className="text-accent-blue"
                    size={20}
                  />
                  <p className="mt-4 text-3xl font-black tracking-[-.03em] text-accent-blue">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 font-body text-sm leading-relaxed text-white/60">
              Search growth compares measured 28-day windows in 2026. Captured
              page-one visibility is a point-in-time observation.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg font-bold text-accent-blue underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href="/work/service-business-growth-case-study"
            >
              Read the anonymized service-business case study
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </>
        )}
        {hasResources && <ServiceResources serviceSlug={serviceSlug} />}
      </div>
    </section>
  );
}
