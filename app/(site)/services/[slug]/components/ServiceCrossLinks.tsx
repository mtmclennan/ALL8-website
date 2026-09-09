import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "@/app/(site)/_components/home/Reveal";
import { Card } from "@/app/(site)/_components/SectionWrapper";
import { getServiceBySlug } from "@/data/services";

export default function ServiceCrossLinks({ slugs }: { slugs: string[] }) {
  const services = slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => !!s);

  if (!services.length) return null;

  return (
    <section className="bg-content3 py-24 max-[960px]:py-16" id="related">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <Reveal className="mb-11">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
            Related Services
          </div>
          <h2 className="text-[clamp(26px,2.8vw,36px)] font-extrabold leading-[1.08] tracking-[-.022em]">
            Often Paired With This
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.Icon;

            return (
              <Reveal key={service.slug} index={i}>
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
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent-blue">
                      View service
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
          })}
        </div>
      </div>
    </section>
  );
}
