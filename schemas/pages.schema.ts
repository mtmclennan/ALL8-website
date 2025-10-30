import { z } from 'zod';

/**
 * Schema for a single static page metadata file
 * Example: /src/data/pages/about.json
 */
export const PageSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10).max(160),
  ogImage: z.string().optional(), // Path or absolute URL
  noindex: z.boolean().optional(), // Whether to block indexing
});

/**
 * Type for use throughout the app
 */
export type PageMeta = z.infer<typeof PageSchema>;
