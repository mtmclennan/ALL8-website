const DEFAULT_SITE_ORIGIN = "https://all8webworks.com";

function validatedSiteOrigin(configured: string) {
  const value = configured.trim();
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `SITE_URL must be a valid absolute URL. Received: ${value}`,
    );
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin without credentials, a path, query, or hash.",
    );
  }

  if (url.origin !== DEFAULT_SITE_ORIGIN) {
    throw new Error(
      `SITE_URL must use the canonical production origin ${DEFAULT_SITE_ORIGIN}.`,
    );
  }

  return url.origin;
}

export function siteUrl() {
  return validatedSiteOrigin(process.env.SITE_URL ?? DEFAULT_SITE_ORIGIN);
}

export function absoluteSiteUrl(pathOrUrl = "/") {
  const base = siteUrl();
  const url = new URL(pathOrUrl, `${base}/`);

  if (url.origin !== base) {
    throw new Error(`Expected an ALL8 site URL, received: ${pathOrUrl}`);
  }

  return url.toString();
}

export function safeCanonicalUrl(
  candidate: string | undefined,
  fallbackPath: string,
) {
  const fallback = absoluteSiteUrl(fallbackPath);

  if (!candidate) return fallback;

  try {
    const canonical = new URL(absoluteSiteUrl(candidate));

    if (canonical.search || canonical.hash) return fallback;

    return canonical.toString();
  } catch {
    console.warn(`[SEO] Ignoring canonical outside ${siteUrl()}: ${candidate}`);

    return fallback;
  }
}

export function isProductionDeployment() {
  return process.env.DEPLOYMENT_ENV === "production";
}
