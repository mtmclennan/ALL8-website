import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServicesWithIcons, type ServiceWithIcon } from "@/data/services";
import { STAGE_HEX, STAGE_LABEL, type Stage } from "@/lib/utils/stage";
import Reveal from "@/app/(site)/_components/home/Reveal";
import { Card } from "@/app/(site)/_components/SectionWrapper";

const GROUPS: { key: Stage | "support"; label: string; hex: string }[] = [
  { key: "found", label: STAGE_LABEL.found, hex: STAGE_HEX.found },
  { key: "contacted", label: STAGE_LABEL.contacted, hex: STAGE_HEX.contacted },
  { key: "follow", label: STAGE_LABEL.follow, hex: STAGE_HEX.follow },
  { key: "win", label: STAGE_LABEL.win, hex: STAGE_HEX.win },
  { key: "support", label: "Keep It Running", hex: "#8b94a8" },
];

export default function CurrentServices() {
  const services = getServicesWithIcons();

  if (!services.length) return null;

  return (
    <section className="py-24 max-[960px]:py-16" id="current-services">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Browse by Service
          </div>
          <h2 className="text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]">
            Every Page, In One Place
          </h2>
          <p className="mx-auto mt-3.5 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            The four outcomes above are how we think about the work. These are
            the actual pages — pricing, process and specifics for each, grouped
            by what they move.
          </p>
        </Reveal>

        <div className="flex flex-col gap-16">
          {GROUPS.map((group) => {
            const groupServices = services.filter(
              (s) => s.category === group.key,
            );

            if (!groupServices.length) return null;

            return (
              <div key={group.key}>
                <Reveal className="mb-6 flex items-center gap-3">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: group.hex,
                      boxShadow: `0 0 8px ${group.hex}`,
                    }}
                  />
                  <h3
                    className="text-[13px] font-bold uppercase tracking-[.13em]"
                    style={{ color: group.hex }}
                  >
                    {group.label}
                  </h3>
                </Reveal>

                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
                  {groupServices.map((service, i) => (
                    <ServiceCard
                      key={service.slug}
                      index={i}
                      service={service}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceWithIcon;
  index: number;
}) {
  const Icon = service.Icon;

  return (
    <Reveal index={index}>
      <Card className="h-full p-7" variant="lift">
        <Link
          className="group flex h-full flex-col"
          href={`/services/${service.slug}`}
        >
          <div className="mb-4 grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.12)] text-accent-blue">
            <Icon height={20} strokeWidth={2} width={20} />
          </div>
          <h3 className="mb-2 text-lg font-bold tracking-[-.012em] group-hover:text-accent-blue">
            {service.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {service.short}
          </p>
          <ul
            aria-label={`${service.title} lead journey stages`}
            className="mb-5 flex flex-wrap gap-2"
          >
            {service.journeyStages.map((stage) => (
              <li
                key={stage}
                className="rounded-full border border-white/[0.09] bg-white/[0.035] px-2.5 py-1 text-[11px] font-semibold text-white/60"
              >
                {STAGE_LABEL[stage]}
              </li>
            ))}
          </ul>
          <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent-blue">
            Explore {service.shortTitle || service.title}
            <ArrowRight
              className="transition-transform group-hover:translate-x-[3px]"
              size={13}
              strokeWidth={2.5}
            />
          </span>
        </Link>
      </Card>
    </Reveal>
  );
}
