import type { RelatedService } from "@/lib/relatedServices";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServiceBySlug } from "@/data/services";

type RelatedServicesProps = {
  services: RelatedService[];
  limit?: number;
};

const DEFAULT_LIMIT = 3;

/**
 * Service links shown after an article. Deliberately image-free icon rows so
 * they read as "where ALL8 can help", distinct from the article cards below.
 */
export default function RelatedServices({
  services,
  limit = DEFAULT_LIMIT,
}: RelatedServicesProps) {
  const relatedServices = services.slice(0, limit);

  if (!relatedServices.length) return null;

  return (
    <section
      aria-labelledby="related-services-title"
      className="mx-auto max-w-[1160px] px-6 pb-12 sm:px-10"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-content3 p-6 sm:p-8">
        <h2
          className="text-[clamp(22px,2.4vw,28px)] font-extrabold tracking-[-.02em]"
          id="related-services-title"
        >
          Related services
        </h2>
        <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-white/70">
          If this article describes a problem in your business, these are the
          parts of the lead system that address it.
        </p>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {relatedServices.map((service) => {
            const Icon = getServiceBySlug(service.slug)?.Icon;

            return (
              <li key={service.slug}>
                <Link
                  className="group flex h-full items-start gap-4 rounded-xl border border-white/[0.08] bg-white/[0.036] p-4 transition-[border-color,background-color] duration-200 hover:border-[rgba(0,118,255,.35)] hover:bg-white/[0.058] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                  href={service.href}
                >
                  {Icon ? (
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[10px] border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.12)] text-accent-blue">
                      <Icon
                        aria-hidden="true"
                        height={20}
                        strokeWidth={2}
                        width={20}
                      />
                    </span>
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[16px] font-bold leading-snug text-white transition-colors group-hover:text-accent-blue">
                      {service.title}
                    </span>
                    {service.description ? (
                      <span className="mt-1.5 text-sm leading-relaxed text-white/70">
                        {service.description}
                      </span>
                    ) : null}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-accent-blue">
                      Explore service
                      <ArrowRight
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
                        size={13}
                        strokeWidth={2.5}
                      />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
