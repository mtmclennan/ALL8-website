import { indexNowOrigin, normalizeIndexNowUrl } from "./client.ts";

export const articleRevisionMeta = "all8-article-revision";

function attribute(tag: string, name: string) {
  return new RegExp(`\\s${name}=["']([^"']*)["']`, "i").exec(tag)?.[1];
}

function meta(name: string, markup: string[]) {
  return markup
    .filter((tag) => attribute(tag, "name")?.toLowerCase() === name)
    .map((tag) => attribute(tag, "content") ?? "");
}

export async function readPublicPage(path: string) {
  const url = normalizeIndexNowUrl(`${indexNowOrigin}${path}`);
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(5000),
  });
  const status = response.status;

  if (
    status !== 200 ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    await response.body?.cancel();

    return { status, indexable: false };
  }

  const html = await response.text();
  const head = /<head(?:\s[^>]*)?>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? "";
  const metaTags = head.match(/<meta\b[^>]*>/gi) ?? [];
  const canonicals = (head.match(/<link\b[^>]*>/gi) ?? [])
    .filter((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical")
    .map((tag) => URL.parse(attribute(tag, "href") ?? "")?.href);
  const directives = [
    response.headers.get("x-robots-tag"),
    ...meta("robots", metaTags),
    ...meta("bingbot", metaTags),
    ...meta("googlebot", metaTags),
  ].join(" ");

  return {
    status,
    indexable:
      canonicals.length === 1 &&
      canonicals[0] === url &&
      !/\b(?:noindex|none)\b/i.test(directives),
    revision: meta(articleRevisionMeta, metaTags)[0],
  };
}
