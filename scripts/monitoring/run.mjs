import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { websiteChecks } from "./website.mjs";
import { emailDelivery, emailSecrets } from "./email.mjs";
import { hubspotConfiguration, hubspotSecrets } from "./hubspot.mjs";

export async function runMonitoring(
  mode,
  env = process.env,
  operations = {
    website: websiteChecks,
    email: emailDelivery,
    hubspot: hubspotConfiguration,
  },
) {
  const results = [];
  async function check(name, operation) {
    try {
      const value = await operation();
      results.push({
        name,
        status: "passed",
        reason:
          typeof value === "string" && !value.includes("<")
            ? value.slice(0, 250)
            : "Verified",
      });
      return value;
    } catch (error) {
      results.push({
        name,
        status: "failed",
        reason: error instanceof Error ? error.message : "Check failed",
      });
    }
  }
  async function optional(name, enabled, requirements, operation) {
    if (env[enabled] !== "true") {
      results.push({
        name,
        status: "SKIPPED_DISABLED",
        reason: `${enabled} is not true; coverage not exercised`,
      });
      return;
    }
    const missing = requirements.filter((key) => !env[key]?.trim());
    if (missing.length) {
      results.push({
        name,
        status: "SKIPPED_UNCONFIGURED",
        reason: `Missing configuration: ${missing.join(", ")}; coverage not exercised`,
      });
      return;
    }
    await check(name, () => operation(env));
  }

  if (mode === "website") await operations.website(check);
  else if (mode === "integrations") {
    await optional(
      "email:inbox-delivery",
      "EMAIL_MONITOR_ENABLED",
      emailSecrets,
      operations.email,
    );
    await optional(
      "hubspot:read-only-configuration",
      "HUBSPOT_MONITOR_ENABLED",
      hubspotSecrets,
      operations.hubspot,
    );
  } else throw new Error("Expected website or integrations");

  const report = { timestamp: new Date().toISOString(), results };
  await mkdir(".monitoring", { recursive: true });
  await writeFile(".monitoring/report.json", JSON.stringify(report, null, 2));
  const summary = [
    "ALL8 Webworks monitoring",
    "",
    ...results.map((r) => `${r.status.toUpperCase()} ${r.name}: ${r.reason}`),
  ].join("\n");
  console.log(summary);
  if (env.GITHUB_STEP_SUMMARY)
    await appendFile(
      env.GITHUB_STEP_SUMMARY,
      `\n\`\`\`text\n${summary}\n\`\`\`\n`,
    );
  return report;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const report = await runMonitoring(process.argv[2]);
  if (report.results.some((r) => r.status === "failed")) process.exitCode = 1;
}
