import {
  RELATED_SERVICE_SLUGS,
  selectRelatedServiceSlugs,
  type RelatedServiceContext,
  type RelatedServiceSlug,
} from "./relatedServiceSelection";

import { SERVICES } from "@/data/services";

export { RELATED_SERVICE_SLUGS };
export type { RelatedServiceContext, RelatedServiceSlug };

export type RelatedService = {
  slug: RelatedServiceSlug;
  title: string;
  description: string;
  href: string;
};

export const RELATED_SERVICE_METADATA: Record<
  RelatedServiceSlug,
  RelatedService
> = RELATED_SERVICE_SLUGS.reduce(
  (metadata, slug) => {
    const service = SERVICES.find((item) => item.slug === slug);

    metadata[slug] = {
      slug,
      title: service?.title ?? slug,
      description: service?.short ?? "",
      href: `/services/${slug}`,
    };

    return metadata;
  },
  {} as Record<RelatedServiceSlug, RelatedService>,
);

export function selectRelatedServices(
  context: RelatedServiceContext | null,
  limit = 3,
): RelatedService[] {
  return selectRelatedServiceSlugs(context, limit).map(
    (slug) => RELATED_SERVICE_METADATA[slug],
  );
}
