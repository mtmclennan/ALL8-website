import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Single Redis client (edge-safe)
const redis = Redis.fromEnv();

/**
 * Two-tier limiter:
 *  - 5 requests per 60 seconds
 *  - 50 requests per 24 hours
 */
const shortWindow = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: false,
  prefix: 'rl:contact:short',
});

const dayWindow = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '24 h'),
  analytics: false,
  prefix: 'rl:contact:day',
});

export async function limitContact(ipOrKey: string) {
  // Evaluate both windows
  const [shortRes, dayRes] = await Promise.all([
    shortWindow.limit(ipOrKey),
    dayWindow.limit(ipOrKey),
  ]);

  // If either fails, block
  const ok = shortRes.success && dayRes.success;

  // Choose the stricter reset (longest wait)
  const resetSeconds = Math.max(
    Math.ceil(shortRes.reset / 1000),
    Math.ceil(dayRes.reset / 1000)
  );

  // Remaining for the *short* window is most actionable
  const remaining = Math.min(shortRes.remaining, dayRes.remaining);

  return { ok, remaining, resetSeconds };
}
