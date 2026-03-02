'use server';

import { z } from 'zod';

export type TuneUpReviewActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  website: z
    .string()
    .min(4, 'Website URL is required')
    .transform((v) => v.trim())
    .transform((v) => (v.startsWith('http') ? v : `https://${v}`)),
  issue: z.enum(['slow', 'calls', 'servicePages', 'seoWeak', 'notSure'], {
    required_error: 'Pick the main issue',
  }),
  message: z.string().max(800).optional(),

  // spam/context (optional)
  hp: z.string().optional(),
  token: z.string().optional(),

  hutk: z.string().optional(),
  pageUrl: z.string().optional(),
  pageName: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  leadType: z.string().optional(),
});

function toFieldErrors(err: z.ZodError) {
  const fe: Record<string, string[]> = {};
  for (const i of err.issues) {
    const key = (i.path?.[0] as string) || 'form';
    fe[key] = fe[key] ? [...fe[key], i.message] : [i.message];
  }
  return fe;
}

export async function submitTuneUpReview(
  _prev: TuneUpReviewActionState,
  formData: FormData,
): Promise<TuneUpReviewActionState> {
  const raw = Object.fromEntries(formData.entries());

  // honeypot trap
  if (typeof raw.hp === 'string' && raw.hp.trim().length > 0) {
    return { ok: true };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const data = parsed.data;

  // TODO: Replace with real destination:
  // - HubSpot form submit API
  // - Email (Resend/Postmark)
  // - DB insert
  // - Slack webhook
  console.log('[TUNE-UP REVIEW]', data);

  return { ok: true };
}
