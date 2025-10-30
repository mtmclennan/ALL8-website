// // lib/integrations/hubspot/client.ts
// export type HSInit = Omit<RequestInit, 'headers'> & {
//   token?: string; // optional override
//   headers?: Record<string, string>;
// };

// export async function HS(path: string, init: HSInit = {}) {
//   const res = await fetch(`https://api.hubspot.com${path}`, {
//     ...init,
//     headers: {
//       Authorization: `Bearer ${init.token ?? process.env.HUBSPOT_TOKEN!}`,
//       'Content-Type': 'application/json',
//       ...(init.headers ?? {}),
//     },
//     cache: 'no-store',
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`[HS] ${res.status} ${res.statusText} ${text}`);
//   }
//   return res;
// }

// // Convenience if you want JSON directly
// export async function HSjson<T = any>(path: string, init: HSInit = {}) {
//   const res = await HS(path, init);
//   return (res.status === 204 ? undefined : await res.json()) as T;
// }
// lib/integrations/hubspot/client.ts

export type HSInit = Omit<RequestInit, 'headers'> & {
  token?: string; // optional override
  headers?: Record<string, string>; // extra headers
  retries?: number; // default 2 (total tries = retries+1)
  timeoutMs?: number; // default 8000
};

/** Typed error for HubSpot API calls */
export class HubSpotError extends Error {
  status: number;
  statusText: string;
  bodyText: string;
  bodyJSON?: any;
  correlationId?: string;
  isRetryable: boolean;

  constructor(init: {
    message: string;
    status: number;
    statusText: string;
    bodyText: string;
    bodyJSON?: any;
  }) {
    // prefer hubspot message if present
    const hsMsg =
      (init.bodyJSON?.message as string) ||
      (init.bodyJSON?.error as string) ||
      init.message;

    super(`[HS] ${init.status} ${init.statusText} ${hsMsg}`.trim());
    this.name = 'HubSpotError';
    this.status = init.status;
    this.statusText = init.statusText;
    this.bodyText = init.bodyText;
    this.bodyJSON = init.bodyJSON;

    // correlationId is very useful for HubSpot support/debugging
    this.correlationId =
      init.bodyJSON?.correlationId ||
      init.bodyJSON?.correlationID ||
      init.bodyJSON?.context?.correlationId;

    // Backoff for 429 and 5xx only
    this.isRetryable = init.status === 429 || init.status >= 500;
  }
}

const BASE = 'https://api.hubapi.com';

/** Sleep helper */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Parse Retry-After header in seconds (int) → ms */
function parseRetryAfterMs(h: Headers): number | undefined {
  const v = h.get('retry-after');
  if (!v) return undefined;
  const secs = Number(v);
  return Number.isFinite(secs) ? Math.max(0, secs * 1000) : undefined;
}

/** Build URL with optional query params */
export function hsUrl(
  path: string,
  query?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(path.startsWith('http') ? path : `${BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Core HubSpot fetch with:
 * - Bearer token from env or override
 * - JSON content-type by default
 * - Retries on 429/5xx with exponential backoff and Retry-After support
 * - Abort timeout
 * - Throws HubSpotError on non-2xx
 */
export async function HS(path: string, init: HSInit = {}) {
  const {
    token = process.env.HUBSPOT_TOKEN!,
    headers,
    retries = 2,
    timeoutMs = 8000,
    ...rest
  } = init;

  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(headers ?? {}),
  };

  let attempt = 0;
  let lastErr: any;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...rest,
        headers: h,
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) return res;

      // Non-OK: parse body text + JSON if possible
      const bodyText = await res.text().catch(() => '');
      let bodyJSON: any | undefined;
      try {
        bodyJSON = bodyText ? JSON.parse(bodyText) : undefined;
      } catch {
        bodyJSON = undefined;
      }

      const err = new HubSpotError({
        message: bodyJSON?.message || bodyText || res.statusText,
        status: res.status,
        statusText: res.statusText,
        bodyText,
        bodyJSON,
      });

      // Retry on 429/5xx
      if (err.isRetryable && attempt < retries) {
        const retryAfter = parseRetryAfterMs(res.headers);
        const backoff = retryAfter ?? 300 * Math.pow(2, attempt); // 300ms, 600ms, 1200ms…
        await delay(backoff);
        attempt++;
        lastErr = err;
        continue;
      }

      // Non-retryable (or out of attempts)
      throw err;
    } catch (e: any) {
      clearTimeout(timeout);

      // If fetch/abort/network error: retry a couple times
      const isAbort = e?.name === 'AbortError';
      const isNetwork =
        e?.code === 'ECONNRESET' ||
        e?.code === 'ENOTFOUND' ||
        e?.code === 'EAI_AGAIN';

      if ((isAbort || isNetwork) && attempt < retries) {
        const backoff = 300 * Math.pow(2, attempt);
        await delay(backoff);
        attempt++;
        lastErr = e;
        continue;
      }

      throw e;
    }
  }

  // Shouldn’t happen but keeps TS happy
  throw lastErr ?? new Error('[HS] Unknown error');
}

/** Convenience: ensure 2xx and return parsed JSON (or undefined on 204) */
export async function HSjson<T = any>(path: string, init: HSInit = {}) {
  const res = await HS(path, init);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Convenience: return boolean (true if 2xx) and swallow errors (logs optional) */
export async function HSok(
  path: string,
  init: HSInit = {},
  logErrors = true
): Promise<boolean> {
  try {
    await HS(path, init);
    return true;
  } catch (e) {
    if (logErrors) console.error('[HSok]', e);
    return false;
  }
}
