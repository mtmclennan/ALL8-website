import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';
import { request, retry } from '../../scripts/monitoring/http.mjs';
import { checkPage, checkLegacyRedirect, representativeArticle } from '../../scripts/monitoring/website.mjs';
import { emailDelivery, emailSecrets } from '../../scripts/monitoring/email.mjs';
import { hubspotConfiguration, hubspotSecrets } from '../../scripts/monitoring/hubspot.mjs';
import { incidentKey, notify } from '../../scripts/monitoring/notify.mjs';
import { runMonitoring } from '../../scripts/monitoring/run.mjs';

const html = '<html><link rel="canonical" href="https://all8webworks.com/contact"><h1>Contact ALL8</h1>' + '<p>Useful business information</p>'.repeat(100) + '</html>';
const options = (body, status = 200, headers = { 'content-type': 'text/html' }) => ({ fetchImpl: async () => new Response(body, { status, headers }) });

test('website check validates rendered page, status, canonical and redirects', async () => {
  const page = { path: '/contact', heading: /Contact/ };
  assert.equal(await checkPage(page, options(html)), html);
  for (const config of [options(html, 503), options(html, 302), options(html.replace('<h1>Contact ALL8</h1>', '<script><h1>Contact ALL8</h1></script>')),
    options(html.replace('https://all8webworks.com/contact', 'https://example.com/contact')), options(html, 200, {})]) {
    await assert.rejects(checkPage(page, config));
  }
  await checkLegacyRedirect('/contact', options('', 301, { location: 'https://all8webworks.com/contact' }));
  await assert.rejects(checkLegacyRedirect('/contact', options('', 301, { location: 'https://all8webworks.com/' })));
  await assert.rejects(checkLegacyRedirect('/contact', options('', 302, { location: 'https://all8webworks.com/contact' })));
  assert.equal(representativeArticle('<a href="/blog/category">Skip</a><a href="/blog/useful-post">Post</a>').path, '/blog/useful-post');
  assert.throws(() => representativeArticle('no posts'));
});

test('retry is bounded and transient failures recover', async () => {
  let calls = 0;
  const wait = async () => {};
  assert.equal(await retry(async () => { if (++calls < 3) throw new Error('transient'); return 'ok'; }, { wait }), 'ok');
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(retry(async () => { calls++; throw new Error('persistent'); }, { wait }));
  assert.equal(calls, 3);
});

test('request timeout covers body consumption and strips private network details', async () => {
  const fetchImpl = async (_url, { signal }) => ({ text: () => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('private-secret')));
  }) });
  const keepAlive = setTimeout(() => {}, 100);
  try {
    await assert.rejects(request('https://example.invalid', {}, { fetchImpl, timeoutMs: 5 }), { message: 'Network request failed or timed out' });
  } finally { clearTimeout(keepAlive); }
});

const emailEnv = Object.fromEntries(emailSecrets.map((name) => [name, 'test-only']));
emailEnv.MONITOR_EMAIL_FROM = 'sender@example.invalid';
emailEnv.MONITOR_EMAIL_TO = 'inbox@example.invalid';

function mailbox({ delivered = true, wrongMailbox = false, sendError = false, wrongSubject = false } = {}) {
  const calls = [];
  let subject;
  const json = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.endsWith('/token')) return { access_token: 'mock-access' };
    if (url.endsWith('/profile')) return { emailAddress: wrongMailbox ? 'wrong@example.invalid' : emailEnv.MONITOR_EMAIL_TO };
    if (url.includes('api.brevo.com')) {
      if (sendError) throw new Error('Provider returned HTTP 401');
      subject = JSON.parse(init.body).subject;
      return { messageId: 'provider-acceptance' };
    }
    if (url.includes('/messages?')) return { messages: delivered ? [{ id: 'inbox-id' }] : [] };
    return { labelIds: ['INBOX'], payload: { headers: [
      { name: 'Subject', value: wrongSubject ? 'old probe' : subject },
      { name: 'From', value: emailEnv.MONITOR_EMAIL_FROM }, { name: 'To', value: emailEnv.MONITOR_EMAIL_TO },
    ] } };
  };
  return { calls, json };
}

test('email checks config and authorized mailbox before sending; sends exactly once and confirms matching inbox receipt', async () => {
  const b = mailbox();
  await assert.rejects(emailDelivery({}, { json: b.json }), /Missing configuration/);
  assert.equal(b.calls.length, 0);
  const result = await emailDelivery(emailEnv, { json: b.json });
  assert.match(result, /Confirmed dedicated inbox receipt/);
  const sends = b.calls.filter(({ url }) => url.includes('api.brevo.com'));
  assert.equal(sends.length, 1);
  const payload = JSON.parse(sends[0].init.body);
  assert.match(payload.subject, /all8-monitor-[a-f0-9-]+/);
  assert.deepEqual(payload.to, [{ email: emailEnv.MONITOR_EMAIL_TO }]);
  assert.equal(payload.templateId, undefined);
  assert.ok(b.calls.findIndex(({ url }) => url.endsWith('/profile')) < b.calls.findIndex(({ url }) => url.includes('brevo')));
});

test('provider acceptance alone and unrelated messages never pass email delivery', async () => {
  for (const config of [{ delivered: false }, { wrongSubject: true }]) {
    const b = mailbox(config);
    let time = 0;
    await assert.rejects(emailDelivery(emailEnv, { json: b.json, now: () => time, wait: async (ms) => { time += ms; }, deliveryTimeoutMs: 20_000 }), /receipt was NOT confirmed/);
    assert.equal(b.calls.filter(({ url }) => url.includes('api.brevo.com')).length, 1);
  }
});

test('wrong mailbox prevents sending and rejected provider acceptance fails explicitly without a resend', async () => {
  const wrong = mailbox({ wrongMailbox: true });
  await assert.rejects(emailDelivery(emailEnv, { json: wrong.json }), /does not match/);
  assert.equal(wrong.calls.filter(({ url }) => url.includes('brevo')).length, 0);
  const failed = mailbox({ sendError: true });
  await assert.rejects(emailDelivery(emailEnv, { json: failed.json }), /HTTP 401/);
  assert.equal(failed.calls.filter(({ url }) => url.includes('brevo')).length, 1);
});

test('mailbox transient reads retry within deadline and persistent read failures fail explicitly', async () => {
  for (const persistent of [false, true]) {
    const b = mailbox();
    let reads = 0;
    let time = 0;
    const json = async (url, init, options) => {
      if (url.includes('/messages?') && (++reads === 1 || persistent)) throw new Error('Temporary mailbox failure');
      return b.json(url, init, options);
    };
    const result = emailDelivery(emailEnv, { json, now: () => time, wait: async (ms) => { time += ms; } });
    if (persistent) await assert.rejects(result, /Mailbox read failed after 3 attempts/);
    else assert.match(await result, /Confirmed/);
    assert.equal(reads, persistent ? 3 : 2);
  }
});

test('disabled and unconfigured integrations expose distinct skips in logs, reports and Actions summaries', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'all8-monitor-disabled-'));
  const script = fileURLToPath(new URL('../../scripts/monitoring/run.mjs', import.meta.url));
  try {
    const summary = join(directory, 'summary.txt');
    const run = (enabled) => spawnSync(process.execPath, [script, 'integrations'], {
      cwd: directory, encoding: 'utf8', env: { EMAIL_MONITOR_ENABLED: enabled, HUBSPOT_MONITOR_ENABLED: enabled, GITHUB_STEP_SUMMARY: summary }, timeout: 10_000,
    });
    const disabled = run('false');
    assert.equal(disabled.status, 0, disabled.stderr);
    assert.match(disabled.stdout, /SKIPPED_DISABLED email:inbox-delivery/);
    assert.match(disabled.stdout, /SKIPPED_DISABLED hubspot:read-only-configuration/);
    const enabled = run('true');
    assert.equal(enabled.status, 0, enabled.stderr);
    assert.match(enabled.stdout, /SKIPPED_UNCONFIGURED email:inbox-delivery: Missing configuration/);
    assert.match(enabled.stdout, /SKIPPED_UNCONFIGURED hubspot:read-only-configuration: Missing configuration/);
    assert.match(enabled.stdout, /coverage not exercised/);
    const report = JSON.parse(await readFile(join(directory, '.monitoring/report.json'), 'utf8'));
    assert.ok(report.results.every((r) => r.status === 'SKIPPED_UNCONFIGURED'));
    const rendered = await readFile(summary, 'utf8');
    assert.match(rendered, /SKIPPED_DISABLED/);
    assert.match(rendered, /SKIPPED_UNCONFIGURED/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('optional monitors skip before any provider access and Slack never alerts for either skip status', async () => {
  const cwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'all8-monitor-skip-'));
  const previousFetch = globalThis.fetch;
  try {
    process.chdir(directory);
    globalThis.fetch = async () => { assert.fail('Skipped monitors must not call providers or Slack'); };
    const operations = { email: async () => assert.fail('Skipped email ran'), hubspot: async () => assert.fail('Skipped HubSpot ran') };
    for (const enabled of ['false', 'true']) {
      const report = await runMonitoring('integrations', { EMAIL_MONITOR_ENABLED: enabled, HUBSPOT_MONITOR_ENABLED: enabled, MONITOR_BREVO_API_KEY: 'private-value', MONITOR_HUBSPOT_TOKEN: '   ' }, operations);
      assert.ok(report.results.every((r) => r.status === (enabled === 'true' ? 'SKIPPED_UNCONFIGURED' : 'SKIPPED_DISABLED')));
      assert.doesNotMatch(JSON.stringify(report), /private-value/);
      await notify({ JOB_STATUS: 'success', SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/mock-only' });
    }
  } finally {
    globalThis.fetch = previousFetch;
    process.chdir(cwd);
    await rm(directory, { recursive: true, force: true });
  }
});

test('fully configured optional monitors pass or fail genuinely, and invalid credentials alert without leaking values', async () => {
  const cwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'all8-monitor-configured-'));
  const previousFetch = globalThis.fetch;
  try {
    process.chdir(directory);
    const env = { ...emailEnv, ...Object.fromEntries(hubspotSecrets.map((key) => [key, 'private-credential-value'])), EMAIL_MONITOR_ENABLED: 'true', HUBSPOT_MONITOR_ENABLED: 'true' };
    const alerts = [];
    globalThis.fetch = async (_url, init) => { alerts.push(JSON.parse(init.body)); return new Response('ok'); };
    const notifier = { JOB_STATUS: 'success', SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/mock-only' };
    const success = await runMonitoring('integrations', env, { email: async () => 'Confirmed inbox', hubspot: async () => 'Verified configuration' });
    assert.ok(success.results.every((r) => r.status === 'passed'));
    await notify(notifier);
    assert.equal(alerts.length, 0);
    for (const status of [503, 401]) {
      // Recover between incidents so invalid credentials must produce their own alert.
      await runMonitoring('integrations', env, { email: async () => 'Confirmed inbox', hubspot: async () => 'Verified configuration' });
      await notify(notifier);
      const json = async () => { throw new Error(`Provider returned HTTP ${status}`); };
      const failed = await runMonitoring('integrations', env, {
        email: (config) => emailDelivery(config, { json }),
        hubspot: (config) => hubspotConfiguration(config, { json, wait: async () => {} }),
      });
      assert.ok(failed.results.every((r) => r.status === 'failed' && r.reason.includes(String(status))));
      assert.doesNotMatch(JSON.stringify(failed), /private-credential-value/);
      await notify({ ...notifier, JOB_STATUS: 'failure' });
      const expectedAlerts = status === 503 ? 1 : 2;
      assert.equal(alerts.length, expectedAlerts);
      await notify({ ...notifier, JOB_STATUS: 'failure' });
      assert.equal(alerts.length, expectedAlerts); // Unchanged incidents remain suppressed.
    }
    assert.doesNotMatch(JSON.stringify(alerts), /private-credential-value/);
  } finally {
    globalThis.fetch = previousFetch;
    process.chdir(cwd);
    await rm(directory, { recursive: true, force: true });
  }
});

test('Slack delivery retains bounded retries and only saves accepted alerts', async (t) => {
  const cwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'all8-slack-retry-'));
  const previousFetch = globalThis.fetch;
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const flush = async () => { for (let i = 0; i < 40; i++) await Promise.resolve(); };
  try {
    process.chdir(directory);
    const env = { JOB_STATUS: 'failure', CHECK_NAME: 'ALL8 CI', SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/mock-only' };
    for (const accepted of [true, false]) {
      let calls = 0;
      globalThis.fetch = async () => {
        calls++;
        return new Response(accepted && calls === 3 ? 'ok' : 'failure', { status: accepted && calls === 3 ? 200 : 503 });
      };
      // File I/O precedes the retry timers; wait for the first attempted POST.
      const pending = notify(env);
      const outcome = pending.then(() => 'accepted', () => 'rejected');
      while (calls === 0) await new Promise((resolve) => setImmediate(resolve));
      await flush();
      assert.equal(calls, 1);
      t.mock.timers.tick(1_999);
      await flush();
      assert.equal(calls, 1);
      t.mock.timers.tick(1);
      await flush();
      assert.equal(calls, 2);
      t.mock.timers.tick(3_999);
      await flush();
      assert.equal(calls, 2);
      t.mock.timers.tick(1);
      assert.equal(await outcome, accepted ? 'accepted' : 'rejected');
      assert.equal(calls, 3);
      if (accepted) {
        assert.ok(JSON.parse(await readFile('.monitoring/state/incident.json', 'utf8')).key);
        await rm('.monitoring/state', { recursive: true });
      } else await assert.rejects(readFile('.monitoring/state/incident.json'));
    }
  } finally {
    globalThis.fetch = previousFetch;
    process.chdir(cwd);
    await rm(directory, { recursive: true, force: true });
  }
});

test('HubSpot checks only metadata GETs and rejects portal, form and schema mismatches', async () => {
  const env = Object.fromEntries(hubspotSecrets.map((name) => [name, 'test-only']));
  env.MONITOR_HS_PORTAL_ID = '123';
  env.MONITOR_HS_FORM_GUID = 'abc';
  const names = ['email', 'firstname', 'company', 'website', 'all8_project_type', 'all8_primary_goal', 'all8_timeline', 'all8_budget_range', 'all8_notes', 'all8_lead_source'];
  for (const mode of ['valid', 'portal', 'form', 'fields', 'schema']) {
    const calls = [];
    const json = async (url, init) => {
      calls.push({ url, init });
      assert.equal(init.method, 'GET');
      assert.doesNotMatch(url, /objects|submissions|subscriptions/);
      if (url.includes('account-info')) return { portalId: mode === 'portal' ? 999 : 123 };
      if (url.includes('/forms/')) return { id: 'abc', archived: mode === 'form', fieldGroups: [{ fields: mode === 'fields' ? [] : names.map((name) => ({ name })) }] };
      return { results: mode === 'schema' ? [] : names.map((name) => ({ name })) };
    };
    const operation = hubspotConfiguration(env, { json, wait: async () => {} });
    if (mode === 'valid') assert.match(await operation, /Read-only/);
    else await assert.rejects(operation);
    assert.ok(calls.length <= 3);
  }
});

test('Slack alerts on incident transition; deduplicates unchanged failures; recovery resets state', async () => {
  const cwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'all8-monitor-test-'));
  const previousFetch = globalThis.fetch;
  const messages = [];
  try {
    process.chdir(directory);
    await mkdir('.monitoring');
    const failure = { name: 'website:/contact', status: 'failed', reason: 'HTTP 503' };
    const report = async (results) => writeFile('.monitoring/report.json', JSON.stringify({ results }));
    globalThis.fetch = async (_url, init) => { messages.push(JSON.parse(init.body)); return new Response('ok'); };
    const env = { JOB_STATUS: 'failure', SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/test', GITHUB_SERVER_URL: 'https://github.com', GITHUB_REPOSITORY: 'mtmclennan/ALL8-website', GITHUB_RUN_ID: '1' };
    await report([failure]);
    await notify(env);
    await notify(env);
    assert.equal(messages.length, 1);
    assert.match(messages[0].text, /ALL8 Webworks.*MONITOR FAILED/);
    assert.match(messages[0].text, /Timestamp: .*Z/);
    assert.match(messages[0].text, /actions\/runs\/1/);
    await report([]);
    await notify({ ...env, JOB_STATUS: 'success' });
    await report([failure]);
    await notify(env);
    assert.equal(messages.length, 2);
    await rm('.monitoring/state', { recursive: true });
    await assert.rejects(notify({ ...env, SLACK_WEBHOOK_URL: '' }), /missing/);
    await assert.rejects(readFile('.monitoring/state/incident.json'));
  } finally {
    globalThis.fetch = previousFetch;
    process.chdir(cwd);
    await rm(directory, { recursive: true, force: true });
  }
  assert.equal(incidentKey([{ name: 'b' }, { name: 'a' }]), 'a|b');
});

test('workflows parse and preserve deployment and secret isolation boundaries', async () => {
  const root = new URL('../../.github/workflows/', import.meta.url);
  const workflows = {};
  for (const name of ['ci', 'website-monitor', 'integration-monitor']) {
    const source = await readFile(new URL(`${name}.yml`, root), 'utf8');
    workflows[name] = parse(source);
    assert.doesNotMatch(source, /pull_request_target|ssh |scp |rsync |pm2|upload-artifact|digitalocean|droplet|nginx|cloudflare/i);
    assert.equal(workflows[name].permissions.contents, 'read');
  }
  const ci = workflows.ci;
  assert.ok('pull_request' in ci.on && 'workflow_dispatch' in ci.on);
  assert.deepEqual(ci.on.push.branches, ['main']);
  const steps = ci.jobs.validate.steps.map((step) => step.run ?? '').join('\n');
  assert.match(steps, /npm run build -- --webpack/);
  assert.match(steps, /npm run lint:ci/);
  assert.doesNotMatch(JSON.stringify(ci.jobs.validate), /secrets\./);
  assert.equal(workflows['website-monitor'].on.schedule[0].cron, '7,22,37,52 * * * *');
});
