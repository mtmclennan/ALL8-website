import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { request, retry } from './http.mjs';

export function incidentKey(failures) {
  // Reasons may contain variable HTTP errors. Stable names prevent alert storms.
  return failures.map((result) => result.name).sort().join('|');
}

export async function notify(env = process.env) {
  let report;
  try { report = JSON.parse(await readFile('.monitoring/report.json', 'utf8')); } catch { /* CI/setup failures have no report. */ }
  const failures = report?.results.filter((result) => result.status === 'failed') ?? [];
  if (env.JOB_STATUS === 'failure' && failures.length === 0) failures.push({ name: env.CHECK_NAME ?? 'workflow', reason: 'Workflow setup or validation failed; inspect Actions logs' });
  const key = incidentKey(failures);
  let previous;
  try { previous = JSON.parse(await readFile('.monitoring/state/incident.json', 'utf8')); } catch { /* First run or cache eviction. */ }
  if (key && key !== previous?.key) {
    if (!env.SLACK_WEBHOOK_URL) throw new Error('SLACK_WEBHOOK_URL is missing; failure remains unnotified');
    const url = new URL(env.SLACK_WEBHOOK_URL);
    if (url.protocol !== 'https:' || !['hooks.slack.com', 'hooks.slack-gov.com'].includes(url.hostname)) throw new Error('Invalid Slack webhook URL');
    const timestamp = new Date().toISOString();
    const runUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
    const reason = failures.map((f) => `${f.name}: ${f.reason}`).join('\n').slice(0, 2000);
    await retry(async () => {
      const { response, body } = await request(url, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: `🚨 ALL8 Webworks MONITOR FAILED\n${reason}\nTimestamp: ${timestamp}\nRun: ${runUrl}` }),
      });
      if (!response.ok || body.trim() !== 'ok') throw new Error(`Slack delivery failed (HTTP ${response.status})`);
    });
  } else if (key) console.log('Incident unchanged; suppressing duplicate Slack alert.');
  // Only persist an incident after Slack accepted it. A healthy run resets it.
  await mkdir('.monitoring/state', { recursive: true });
  await writeFile('.monitoring/state/incident.json', JSON.stringify({ key }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await notify();
