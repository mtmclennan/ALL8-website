'use server';

import { z } from 'zod';
import { headers } from 'next/headers';

import { limitContact } from '@/lib/rate-limit';

const IntakeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  projectType: z.enum(['new', 'redesign', 'ecom', 'webapp']),
  goal: z.enum(['leads', 'sell', 'seo', 'other']),
  timeline: z.enum(['asap', '1-2m', '3m+', 'exploring']),
  budget: z.enum(['3-5k', '5-10k', '10k+']),
  notes: z.string().min(10),
  consent: z.literal('on'), // checkbox posts "on" when checked
  // Honeypot (must be empty):
  hp: z.string().max(0).optional(),
  // Optional reCAPTCHA (v3) token:
  token: z.string().optional(),
});

export type IntakeActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

async function verifyCaptcha(token?: string) {
  if (!process.env.RECAPTCHA_SECRET || !token) return true;
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET!,
      response: token,
    }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { success: boolean; score?: number };
  return data.success && (data.score ?? 0.9) >= 0.3;
}

function sendEmail(payload: Record<string, any>) {
  console.log('SEND Email');
  //   const nodemailer = await import('nodemailer');
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     port: Number(process.env.SMTP_PORT || 587),
  //     secure: false,
  //     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  //   });

  //   await transporter.sendMail({
  //     from: `"ALL8 Website" <${process.env.SMTP_FROM}>`,
  //     to: process.env.CONTACT_TO,
  //     subject: `New project intake: ${payload.name}`,
  //     text: `Name: ${payload.name}
  // Email: ${payload.email}
  // Company: ${payload.company ?? '-'}
  // Website: ${payload.website ?? '-'}
  // Project: ${payload.projectType}
  // Goal: ${payload.goal}
  // Timeline: ${payload.timeline}
  // Budget: ${payload.budget}

  // Notes:
  // ${payload.notes}
  // `,
  //   });
}

export async function submitIntake(
  _prev: IntakeActionState | null,
  formData: FormData
): Promise<IntakeActionState> {
  // Convert FormData to a plain object
  const raw: Record<string, any> = {};
  formData.forEach((v, k) => (raw[k] = v));

  // Coerce HeroUI Select values (we’ll ensure they’re plain inputs below)

  const parsed = IntakeSchema.safeParse(raw);
  if (!parsed.success) {
    const zerr = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: zerr.fieldErrors,
      message: 'Please fix the highlighted fields.',
    };
  }

  console.log(parsed);
  // Honeypot
  if (parsed.data.hp && parsed.data.hp.length > 0) {
    return { ok: true, message: 'Thanks!' }; // pretend success, drop quietly
  }

  const h = await headers();
  const ip =
    (h.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim() || 'unknown';

  const { ok, resetSeconds } = await limitContact(`contact:${ip}`);
  if (!ok) {
    return {
      ok: false,
      message: `Too many requests. Please wait ~${Math.max(resetSeconds, 5)}s and try again.`,
    };
  }

  // Optional CAPTCHA
  const human = await verifyCaptcha(parsed.data.token);
  if (!human) {
    return { ok: false, message: 'Verification failed. Please try again.' };
  }

  // Send email (and/or append to Google Sheet here)
  await sendEmail(parsed.data);

  return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
}
