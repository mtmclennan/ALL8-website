export async function verifyCaptcha(token?: string) {
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
