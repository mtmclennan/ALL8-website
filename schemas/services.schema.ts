import { z } from 'zod';

export const ServiceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(10).max(160),
  image: z.string().optional(), // path or external URL
  priority: z.number().min(0).max(1).optional(),
});

export const ServicesSchema = z.array(ServiceSchema);

export type Service = z.infer<typeof ServiceSchema>;
