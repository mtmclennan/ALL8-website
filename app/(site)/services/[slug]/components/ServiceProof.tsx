import { LineChart, Search, MapPin } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";
import { Card } from "@/app/(site)/_components/SectionWrapper";

const PROOF_STATS = [
  {
    icon: LineChart,
    value: "+76%",
    em: true,
    label: "Business Profile website clicks, year over year",
  },
  {
    icon: Search,
    value: "Page One",
    em: false,
    label: "Visibility for a dedicated service page",
  },
  {
    icon: MapPin,
    value: "#1 Local",
    em: true,
    label: "Ranking for a high-intent local search",
  },
];

export default function ServiceProof() {
  return (
    <section className="py-20 max-[960px]:py-16" id="proof">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-10 max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Real Client Results
          </div>
          <h2 className="text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.1] tracking-[-.02em]">
            Not Hypothetical. Documented.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PROOF_STATS.map((stat, i) => (
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
          Real anonymized client data — identifying details removed, results
          documented.
        </p>
      </div>
    </section>
  );
}
