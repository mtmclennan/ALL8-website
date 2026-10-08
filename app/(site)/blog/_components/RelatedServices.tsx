import type { RelatedService } from "@/lib/relatedServices";

import Link from "next/link";

type RelatedServicesProps = {
  services: RelatedService[];
  limit?: number;
};

const DEFAULT_LIMIT = 3;

export default function RelatedServices({
  services,
  limit = DEFAULT_LIMIT,
}: RelatedServicesProps) {
  const relatedServices = services.slice(0, limit);

  if (!relatedServices.length) return null;

  return (
    <section
      aria-labelledby="related-services-title"
      className="relative z-20 mx-auto max-w-5xl px-6 pb-12"
    >
      <div className="rounded-2xl border border-white/10 bg-content1/50 p-6 sm:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
            Useful Next Steps
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white"
            id="related-services-title"
          >
            Related Services
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {relatedServices.map((service) => (
            <Link
              key={service.slug}
              className="group block h-full rounded-xl border border-foreground/10 bg-background/70 p-5 transition-[border-color,background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-blue/60 hover:bg-content2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue motion-reduce:transform-none"
              href={service.href}
            >
              <h3 className="text-lg font-semibold leading-tight text-white transition-colors group-hover:text-accent-blue group-focus-visible:text-accent-blue">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
