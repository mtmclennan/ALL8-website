export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Consume the body inside the timeout as well as waiting for response headers.
export async function request(url, init = {}, { timeoutMs = 10_000, fetchImpl = fetch } = {}) {
  try {
    const response = await fetchImpl(url, {
      ...init,
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.text();
    return { response, body };
  } catch {
    // Never include provider bodies, credentials, or submitted fields in logs.
    throw new Error('Network request failed or timed out');
  }
}

export async function retry(check, { attempts = 3, wait = sleep } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await check();
    } catch (error) {
      if (attempt === attempts) throw error;
      await wait(attempt * 2_000);
    }
  }
}

export async function jsonRequest(url, init = {}, options) {
  const { response, body } = await request(url, init, options);
  if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}`);
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Provider returned invalid JSON');
  }
}

export function required(env, names) {
  const missing = names.filter((name) => !env[name]?.trim());
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(', ')}`);
}
