'use server';
import { IntakeSchema, IntakeData } from '@/lib/intake/schema';
import { verifyCaptcha } from '@/lib/intake/verifyCaptcha';
import { checkRateLimit } from '@/lib/intake/rateLimit';
import { runBackgroundTasks } from '@/lib/intake/backgroundTasks';

export type IntakeActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitIntake(
  _prev: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = IntakeSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    consent: formData.has('consent'),
    marketingOptIn: formData.has('marketingOptIn'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors,
      message: 'Please fix the highlighted fields.',
    };
  }

  const data = parsed.data as IntakeData;

  if (data.hp)
    return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };

  try {
    await checkRateLimit();
  } catch (e) {
    return { ok: false, message: String(e) };
  }

  const human = await verifyCaptcha(data.token);
  if (!human)
    return { ok: false, message: 'Verification failed. Please try again.' };

  // fire and forget
  runBackgroundTasks(data);

  return { ok: true, message: 'Thanks! We’ll review and follow up shortly.' };
}
