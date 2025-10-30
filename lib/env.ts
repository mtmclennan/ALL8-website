// lib/env.ts
import { z } from 'zod';

const end = ['ca', 'com', 'de'] as const;

const Env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_CANONICAL_DOMAIN: z.enum(['ca', 'com', 'de']).default('ca'),
  NEXT_PUBLIC_TWITTER_HANDLE: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export const env = Env.parse(process.env);
