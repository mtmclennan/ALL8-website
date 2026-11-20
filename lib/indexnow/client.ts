import { env } from "node:process";

import { canonicalInternalPath } from "../../config/permanent-redirects.mjs";

export const indexNowOrigin = "https://all8webworks.com";

export function validIndexNowKey(key: string | undefined): key is string {
  return typeof key === "string" && /^[A-Za-z0-9-]{8,128}$/.test(key);
}

export function normalizeIndexNowUrl(input: string) {
  // Public routes use ASCII slugs. Reject alternate hosts and ambiguous paths.
  const match =
    /^https:\/\/all8webworks\.com(\/[A-Za-z0-9/_-]*)?(?:[?#][^\s]*)?$/.exec(
      input,
    );
  const path = match?.[1] ?? "/";

  if (!match || path.includes("//")) throw new Error("Invalid IndexNow URL");

  return `${indexNowOrigin}${canonicalInternalPath(path.replace(/\/$/, "") || "/")}`;
}

export function indexNowEnabled() {
  return env.INDEXNOW_ENABLED === "true";
}

export function indexNowKeyResponse(requested: string) {
  const key = env.INDEXNOW_KEY;

  if (
    env.DEPLOYMENT_ENV !== "production" ||
    !validIndexNowKey(key) ||
    key !== requested
  ) {
    return new Response(null, {
      status: 404,
      headers: { "cache-control": "no-store" },
    });
  }

  return new Response(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

export function readIndexNowConfig() {
  const key = env.INDEXNOW_KEY;

  if (!validIndexNowKey(key))
    throw new Error("Invalid IndexNow key configuration");
  const endpoint = URL.parse(
    env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow",
  );

  if (
    !endpoint ||
    endpoint.protocol !== "https:" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.port ||
    endpoint.pathname !== "/indexnow" ||
    endpoint.search ||
    endpoint.hash
  ) {
    throw new Error("Invalid IndexNow endpoint configuration");
  }

  return { key, endpoint: endpoint.href };
}

export async function submitIndexNow(urls: string[]) {
  const { key, endpoint } = readIndexNowConfig();
  const urlList = [...new Set(urls.map(normalizeIndexNowUrl))];

  if (urlList.length < 1 || urlList.length > 10_000) {
    throw new Error("Invalid IndexNow batch size");
  }

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(indexNowOrigin).hostname,
        key,
        keyLocation: `${indexNowOrigin}/${key}.txt`,
        urlList,
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    console.warn("[IndexNow] Request failed", { count: urlList.length });
    throw new Error("IndexNow request failed");
  }

  await response.body?.cancel().catch(() => {});
  if (response.status !== 200 && response.status !== 202) {
    console.warn("[IndexNow] Request rejected", {
      status: response.status,
      count: urlList.length,
    });
    throw new Error(`IndexNow returned HTTP ${response.status}`);
  }

  console.info("[IndexNow] Notification received", {
    status: response.status,
    count: urlList.length,
    keyValidationPending: response.status === 202,
  });

  return response.status;
}
