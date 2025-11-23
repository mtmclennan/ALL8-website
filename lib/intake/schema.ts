import { z } from 'zod';
export const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const IntakeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  website: z.union([z.string().regex(domainRegex), z.literal('')]).optional(),
  projectType: z.enum([
    'website',
    'gmb',
    'ads',
    'integrations',
    'maintenance',
    'seo',
  ]),
  goal: z.enum(['leads', 'sell', 'seo', 'other']),
  timeline: z.enum(['asap', '1-2m', '3m+', 'exploring']),
  budget: z.enum(['planning', '2-3k', '3-5k', '5k+']),
  notes: z.string().min(10),
  consent: z.boolean().refine(Boolean),
  hp: z.string().max(0).optional(),
  token: z.string().optional(),
  hutk: z.string().optional(),
  pageUrl: z.string().url().optional(),
  pageName: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  marketingOptIn: z.boolean().optional(),
});

export type IntakeData = z.infer<typeof IntakeSchema>;
