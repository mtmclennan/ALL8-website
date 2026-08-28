import { z } from "zod";

export const SeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  type: z.string().optional(),
  siteName: z.string().optional(),
});

export const ServiceSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(2),
    short: z.string().min(10).max(600),
    priority: z.number().min(0).max(1).optional(),
    seo: SeoSchema.optional(), // ← this makes your generateMetadata() work
  })
  .passthrough();

export const ServicesSchema = z.array(ServiceSchema);

export type Service = z.infer<typeof ServiceSchema>;
