import {
  indexNowEnabled,
  indexNowOrigin,
  normalizeIndexNowUrl,
  readIndexNowConfig,
  submitIndexNow,
} from "../lib/indexnow/client.ts";
import { readPublicPage } from "../lib/indexnow/publicPage.ts";

const staticPaths = new Set([
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/privacy",
  "/services",
  "/tools",
  "/tools/missed-call-revenue-calculator",
  "/work",
  "/work/service-business-growth-case-study",
]);
const args = process.argv.slice(2);

async function main() {
  const send = args[0] === "--send";
  const paths = args.slice(send ? 1 : 0);

  if (
    paths.length < 1 ||
    paths.length > 25 ||
    paths.some(
      (path) =>
        !staticPaths.has(path) &&
        !/^\/services\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path),
    )
  ) {
    throw new Error(
      "Usage: npm run indexnow:submit -- [--send] /changed-path [...] (1–25 static or service paths)",
    );
  }

  const changed = [...new Set(paths)];
  const urls = changed.map((path) => indexNowOrigin + path);

  if (urls.some((url) => normalizeIndexNowUrl(url) !== url)) {
    throw new Error(
      "Pass final canonical paths. Redirected paths are excluded.",
    );
  }
  if (!send) {
    console.log("Dry run. Candidate URLs:");
    for (const url of urls) console.log(url);
    return;
  }
  if (!indexNowEnabled())
    throw new Error("Set INDEXNOW_ENABLED=true to send notifications");
  const { key } = readIndexNowConfig();
  const keyFile = await fetch(`${indexNowOrigin}/${key}.txt`, {
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  }).catch(() => {
    throw new Error("Could not verify the public IndexNow key file");
  });

  if (
    keyFile.status !== 200 ||
    !keyFile.headers.get("content-type")?.startsWith("text/plain") ||
    (await keyFile.text()) !== key
  ) {
    throw new Error("Public IndexNow key file did not match the configuration");
  }
  for (const path of changed) {
    const page = await readPublicPage(path).catch(() => {
      throw new Error(`Could not verify ${path}`);
    });

    if (!page.indexable)
      throw new Error(`${path} did not return indexable, self-canonical HTML`);
  }

  await submitIndexNow(urls);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "IndexNow command failed",
  );
  process.exitCode = 1;
});
