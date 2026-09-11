import Link from "next/link";
import { ArrowRight, LineChart, Search, MapPin } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";
import { Card } from "@/app/(site)/_components/SectionWrapper";
import { proofDisplay } from "@/data/proof";

const SEARCH_PROOF = [
  {
    icon: LineChart,
    value: proofDisplay.searchRange,
    em: true,
    label: `Search clicks per rolling 28 days, ${proofDisplay.searchPeriod}`,
  },
  {
    icon: MapPin,
    value: proofDisplay.profileIncreaseSigned,
    em: true,
    label: "Business Profile website clicks, year over year",
  },
  {
    icon: Search,
    value: proofDisplay.pageOne,
    em: false,
    label: "Captured visibility for a targeted service page",
  },
];

const MEASUREMENT_FRAMEWORK = [
  {
    icon: Search,
    value: "Source",
    em: true,
    label: "Which page, search, ad, call or form produced the opportunity",
  },
  {
    icon: LineChart,
    value: "Response",
    em: false,
    label: "How quickly and consistently the lead moved to a real conversation",
  },
  {
    icon: MapPin,
    value: "Outcome",
    em: true,
    label: "Which qualified opportunities became quoted and won work",
  },
];

const SEARCH_PROOF_SLUGS = new Set([
  "lead-generation-websites",
  "local-seo-google-business-profile",
]);

export default function ServiceProof({ serviceSlug }: { serviceSlug: string }) {
  const hasDirectSearchProof = SEARCH_PROOF_SLUGS.has(serviceSlug);
  const stats = hasDirectSearchProof ? SEARCH_PROOF : MEASUREMENT_FRAMEWORK;

  return (
    <section className="py-20 max-[960px]:py-16" id="proof">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-10 max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            {hasDirectSearchProof ? "Real Client Results" : "Success Measures"}
          </div>
          <h2 className="text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.1] tracking-[-.02em]">
            {hasDirectSearchProof
              ? "Not Hypothetical. Documented."
              : "Measured Beyond Clicks and Impressions."}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} index={i}>
              <Card className="h-full p-7 text-center" variant="lift">
                <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-xl border border-[rgba(0,118,255,.24)] bg-[rgba(0,118,255,.12)] text-accent-blue">
                  <stat.icon size={18} strokeWidth={2.2} />
                </div>
                <div className="mb-1.5 text-[clamp(28px,3vw,36px)] font-black leading-none tracking-[-.03em]">
                  {stat.em ? (
                    <span className="text-accent-blue">{stat.value}</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-[13.5px] leading-relaxed text-white/70">
                  {stat.label}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-[560px] text-center text-[13.5px] leading-relaxed text-white/60">
          {hasDirectSearchProof
            ? "Real anonymized client data — identifying details removed, results documented. Rankings are point-in-time captures."
            : "The exact baseline and targets are agreed before work begins; no result is claimed for this service until it is measured."}
        </p>
        <Link
          className="mx-auto mt-5 flex w-fit items-center gap-2 text-sm font-bold text-accent-blue hover:text-[#8ec5ff]"
          href="/work/service-business-growth-case-study"
        >
          Read the anonymized growth-system case study
          <ArrowRight size={15} strokeWidth={2.4} />
        </Link>
      </div>
    </section>
  );
}
