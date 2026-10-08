import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServicesWithIcons, type ServiceWithIcon } from "@/data/services";

const FEATURED_SLUGS = [
  "local-seo-google-business-profile",
  "lead-generation-websites",
  "google-ads-lead-generation",
  "missed-call-recovery",
  "lead-follow-up-automation",
  "crm-sales-pipeline",
] as const;

const MORE_SLUGS = [
  "call-tracking-lead-attribution",
  "website-care-optimization",
  "custom-lead-systems",
] as const;

function selectServices(slugs: readonly string[], services: ServiceWithIcon[]) {
  return slugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is ServiceWithIcon => Boolean(service));
}

export default function ServicesPreview() {
  const services = getServicesWithIcons();
  const featured = selectServices(FEATURED_SLUGS, services);
  const more = selectServices(MORE_SLUGS, services);

  return (
    <section className="scroll-mt-20 py-24 max-[960px]:py-16" id="services">
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="mb-10 max-w-[720px]">
          <h2 className="all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]">
            What We Do
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/70">
            Websites, search visibility, ads, missed-call recovery, follow-up,
            and CRM work together to turn more inquiries into customers. Start
            with the service that solves your biggest gap.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => {
            const Icon = service.Icon;

            return (
              <Link
                key={service.slug}
                className="group flex h-full flex-col rounded-2xl border border-white/[0.09] bg-white/[0.036] p-6 transition-[border-color,background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-blue/60 hover:bg-white/[0.058] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue motion-reduce:transform-none"
                href={`/services/${service.slug}`}
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-accent-blue/25 bg-accent-blue/10 text-accent-blue">
                  <Icon
                    aria-hidden="true"
                    height={20}
                    strokeWidth={2}
                    width={20}
                  />
                </span>
                <h3 className="all8-h3 font-bold tracking-[-.012em] group-hover:text-accent-blue group-focus-visible:text-accent-blue">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {service.short}
                </p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-bold text-accent-blue">
                  Explore service
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                    size={15}
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="text-white/60">Also available:</span>
          {more.map((service) => (
            <Link
              key={service.slug}
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-blue hover:text-[#8ec5ff] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
              href={`/services/${service.slug}`}
            >
              {service.shortTitle || service.title}
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          ))}
        </div>
        <Link
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-white hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue"
          href="/services"
        >
          Browse all services <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
  );
}
