import { z } from 'zod';

export const PageMetaSchema = z.object({
  path: z.string().min(1), // e.g. "/about"
  title: z.string().min(2),
  description: z.string().min(10).max(160),
  ogImage: z.string().optional(), // path or external URL
  noindex: z.boolean().optional(),
});

export const PagesSchema = z.array(PageMetaSchema);
export type PageMeta = z.infer<typeof PageMetaSchema>;
