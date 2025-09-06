import { z } from 'zod';

export const SiteSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  locale: z.string().min(2), // e.g. "en_CA"
  defaultOgImage: z.string().startsWith('/'),
  social: z
    .object({
      twitter: z.string().optional(),
    })
    .default({}),
});

export type SiteData = z.infer<typeof SiteSchema>;
