import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const project = fileURLToPath(new URL("../../", import.meta.url));
const browser = process.env.HONEYPOT_TEST_BROWSER || [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
].find(existsSync);

test("real Chromium: legitimate and bot submissions across all three forms", { skip: !browser }, async () => {
  const bundle = await build({
    absWorkingDir: project,
    entryPoints: ["tests/browser/honeypot-fixture.tsx"],
    bundle: true, write: false, outfile: "tmp/honeypot-browser.js", jsx: "automatic", loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY": '"browser-test-key"' },
    plugins: [{ name: "local-only-actions", setup(builder) {
      builder.onResolve({ filter: /^(next\/(link|navigation)|@\/app\/actions\/submit-|@\/hooks\/use-hubspotContextFields)/ }, ({ path: id }) => ({ path: id, namespace: "test-stub" }));
      builder.onLoad({ filter: /.*/, namespace: "test-stub" }, ({ path: id }) => ({ loader: "jsx", resolveDir: project, contents:
        id === "next/link" ? 'export default function Link(props) { return <a {...props} />; }' :
        id === "next/navigation" ? 'export const usePathname = () => "/";' :
        id.includes("use-hubspot") ? 'export const useHubSpotContextFields = () => ({hutk:"",pageUrl:"http://localhost/",pageName:"Test",utm:{}});' :
        `async function submit(previous, data) {
          window.submissions.push(Object.fromEntries(data));
          return {ok:true,captured:!String(data.get("hp") || "").trim()};
        }
        export {submit as submitLeadReview, submit as submitNewsletter};`,
      }));
    } }],
  });
  const server = createServer((request, response) => {
    response.setHeader("Content-Type", request.url === "/test.js" ? "text/javascript" : "text/html");
    response.end(request.url === "/test.js" ? bundle.outputFiles[0].text : '<!doctype html><body><script src="/test.js"></script></body>');
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const profile = await mkdtemp(path.join(tmpdir(), "all8-honeypot-"));
  try {
    const output = await new Promise((resolve, reject) => {
      const child = spawn(browser, ["--headless", "--disable-gpu", "--disable-background-networking", "--no-first-run", "--no-default-browser-check", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1", `--user-data-dir=${profile}`, "--dump-dom", "--virtual-time-budget=10000", `http://127.0.0.1:${server.address().port}`], { windowsHide: true });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (data) => { stdout += data; });
      child.stderr.on("data", (data) => { stderr += data; });
      const timer = setTimeout(() => { child.kill(); reject(new Error("Browser timed out")); }, 30000);
      child.once("error", reject);
      child.once("close", () => { clearTimeout(timer); resolve(stdout || stderr); });
    });
    assert.match(output, /data-result="PASS: 6 real-browser form scenarios"/, output);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
});
