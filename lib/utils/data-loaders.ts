import { SiteSchema, type SiteData } from '@/schemas/site.schema';
import { ServicesSchema, Service } from '@/schemas/services.schema';
import siteJson from '@/data/site.json';
import servicesJson from '@/data/services.json';

const IS_DEV = process.env.NODE_ENV !== 'production';

/** Validates JSON with Zod; throws in dev, logs+fallback in prod */
function parseOrThrow<T>(schema: any, json: unknown, name: string): T {
  const res = schema.safeParse(json);
  if (!res.success) {
    if (IS_DEV) throw new Error(`${name} JSON invalid:\n${res.error}`);
    console.error(`${name} JSON invalid`, res.error);
    // return a minimal safe fallback so the app still boots in prod
    return schema.parse(schema._def.typeName === 'ZodArray' ? [] : ({} as T));
  }
  return res.data as T;
}

/** Site (single object) */
export function loadSite(): SiteData {
  return parseOrThrow<SiteData>(SiteSchema, siteJson, 'site.json');
}

/** Services (array) */
export function loadServices(): Service[] {
  return parseOrThrow<Service[]>(ServicesSchema, servicesJson, 'services.json');
}

export function loadService(slug: string): Service | null {
  const list = loadServices();
  return list.find((s) => s.slug === slug) ?? null;
}
