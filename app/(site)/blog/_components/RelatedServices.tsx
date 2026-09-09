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
            <article
              key={service.slug}
              className="group rounded-xl border border-foreground/10 bg-background/70 p-5 transition-all duration-300 hover:border-blue-400/50"
            >
              <h3 className="text-lg font-semibold leading-tight text-white">
                <Link
                  className="outline-none transition-colors group-hover:text-blue-300 focus-visible:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  href={service.href}
                >
                  {service.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
