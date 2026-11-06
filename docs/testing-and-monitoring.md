# ALL8 testing and production monitoring

Implemented locally on November 6, 2026. These workflows never deploy, connect to
the server, upload build artifacts, or submit production forms. The owner keeps
control of production builds and deployments. Workflows become active only after
the owner approves and pushes the files to GitHub; scheduled workflows run from
the default branch. No secrets or repository settings were changed for this task.

## Reference review

The originally supplied `mtmclennan/Bellhouse` has no monitoring/workflow files on
its sole branch, `main`. The owner clarified that the reference is
[`mtmclennan/Bellhouse-basic`](https://github.com/mtmclennan/Bellhouse-basic).
Reviewed:

- [bellhouse-daily-check.yml](https://github.com/mtmclennan/Bellhouse-basic/blob/main/.github/workflows/bellhouse-daily-check.yml): scheduled/manual checks, reason capture, Slack incoming webhook and Actions run URL, daily Brevo probe, homepage/form/SSL checks.
- [bellhouse-playwright.yml](https://github.com/mtmclennan/Bellhouse-basic/blob/main/.github/workflows/bellhouse-playwright.yml): daily Chromium smoke tests, npm ci, job timeout, failure-only Slack alert.
- `frontend/src/app/api/monitor/{daily-check,homepage-check,form-check}/route.ts`:
  bearer-authenticated monitor endpoints; Brevo acceptance; HTML status, content
  type, minimum length and business-name checks; synthetic contact flow.
- `frontend/src/lib/monitor/eventLog.ts`: local JSONL integration-failure tripwire.

Reference secret names: `SITE_URL`, `MONITOR_TOKEN`, `MONITOR_TO_EMAIL`,
`SLACK_WEBHOOK_URL`, plus the app's Brevo credentials. No secret values were read.
Its workflows have no explicit HTTP retry or request timeout; the Playwright job
has a 15-minute bound. The daily email check verifies provider acceptance, not
mailbox receipt. ALL8 reuses scheduled/manual workflows, descriptive failure
reasons and the Slack `text` payload/run-link structure. It adds bounded retries,
mailbox verification and incident suppression. It deliberately does not reuse
production synthetic form submissions, server monitor endpoints, server log
changes, or artifact uploads.

## Workflows and schedules

| File | Triggers | Behavior |
| --- | --- | --- |
| `.github/workflows/ci.yml` | PRs, pushes to main, manual | Node 24.11.0, npm ci, Next route type generation, TypeScript, non-fixing lint, unit tests, rendered form/server integration tests, monitoring tests, `npm run build -- --webpack` |
| `.github/workflows/website-monitor.yml` | `7,22,37,52 * * * *`, manual | GET homepage, contact, services, pricing, Blog index and a representative linked article; GET `.ca` redirects for `/` and `/contact` |
| `.github/workflows/integration-monitor.yml` | `17 12 * * *`, manual | Optional direct Brevo-to-Gmail delivery probe and optional read-only HubSpot metadata checks |

Cron is UTC. Daily checks run at 07:17 EST / 08:17 EDT. GitHub scheduling is best
effort, not a 15-minute uptime SLA. Monitor jobs have 10-minute bounds; CI has 25
minutes. Public page and HubSpot reads retry three times with 2s/4s backoff; every
HTTP request has a 10-second timeout covering headers and body. Canonical page
redirects fail explicitly; `.ca` must permanently redirect directly to the same
`.com` path. Checks validate rendered H1 content, HTML, ALL8 content, minimum
length and exact page canonical. Article discovery follows a linked `/blog/slug`
on the Blog index without requesting an arbitrary external URL.

## Repository variables and secrets

Configure under GitHub repository **Settings → Secrets and variables → Actions**.
Use repository-scoped secrets, not environment files committed to git.

| Kind | Name | Purpose |
| --- | --- | --- |
| Variable | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity project ID for CI build/typegen |
| Variable | `NEXT_PUBLIC_SANITY_DATASET` | Public readable dataset, typically `production`; only published public content is read |
| Secret | `SLACK_WEBHOOK_URL` | Slack incoming webhook; same name as Bellhouse |
| Variable | `EMAIL_MONITOR_ENABLED` | Set exactly `true` only after dedicated mailbox and automation exclusions are ready; otherwise `SKIPPED_DISABLED` |
| Secret | `MONITOR_BREVO_API_KEY` | Separate Brevo transactional API key for the intended ALL8 sender/account |
| Secret | `MONITOR_EMAIL_FROM` | Verified sender, normally `no-reply@all8webworks.com`, matching ALL8's email module |
| Secret | `MONITOR_EMAIL_TO` | Dedicated Gmail/Workspace monitoring mailbox, not a customer or sales inbox |
| Secret | `MONITOR_GMAIL_CLIENT_ID` | OAuth client ID for mailbox access |
| Secret | `MONITOR_GMAIL_CLIENT_SECRET` | Matching OAuth client secret |
| Secret | `MONITOR_GMAIL_REFRESH_TOKEN` | Offline refresh token authorized by that dedicated mailbox with Gmail read-only scope |
| Variable | `HUBSPOT_MONITOR_ENABLED` | Exactly `true` to enable; otherwise `SKIPPED_DISABLED` |
| Secret | `MONITOR_HUBSPOT_TOKEN` | Separate private-app token with metadata read permissions only |
| Secret | `MONITOR_HS_PORTAL_ID` | Intended ALL8 HubSpot account ID, matching production `HS_PORTAL_ID` |
| Secret | `MONITOR_HS_FORM_GUID` | Intended server-side integration form ID, matching production `HS_FORM_GUID` |

CI receives **no production secrets**. Its CAPTCHA key/secret are dummy strings;
verification and browser APIs are mocked. Public Sanity IDs are required because
the existing app validates them at import and generates blog content at build
time. CI can read the public content API and build resources such as fonts; it
does not need Sanity write tokens, Brevo, HubSpot, Sheets, Redis or Google service
account credentials. Fork PRs do not run the privileged Slack notification job.
CI failures on main/manual runs alert Slack. PR failures remain visible as GitHub
checks. Monitoring secrets exist only in the relevant trusted scheduled/manual
step. Monitor scripts use Node built-ins and do not install the app dependencies.

## Dedicated monitoring mailbox

1. Create a mailbox used only for delivery probes, with no forwarding into sales
   intake, CRM ingestion, list sync or marketing automation. Confirm Brevo
   automation excludes the `all8-monitor` / `delivery-probe` tags and this
   recipient. The enable variable is the owner's confirmation this is ready.
2. Enable Gmail API in the chosen Google Cloud project and configure OAuth for
   the dedicated account. Grant `https://www.googleapis.com/auth/gmail.readonly`
   with offline access. Store the resulting refresh token and OAuth client
   credentials in the three GitHub secrets. Use an appropriately published or
   internal OAuth app: Google OAuth apps left in Testing can have expiring refresh
   tokens. Revoke/rotate tokens when access changes. Do not grant Gmail send or
   modify scopes. No local credential files are needed.
3. Set `MONITOR_EMAIL_TO` to the authorized account's primary address. The script
   checks Gmail `/users/me/profile` before sending, preventing an unrelated
   mailbox credential from silently monitoring the wrong recipient.
4. Verify the Brevo sender and key belong to the intended delivery account. Keep
   the mailbox in Inbox; do not autoarchive these messages. Use an external
   retention policy if desired: this read-only check never deletes mail.
5. Configure secrets, then enable `EMAIL_MONITOR_ENABLED=true` and manually run
   **ALL8 Daily Integration Monitor**.

Each run generates a UUID subject and sends exactly one direct transactional text
message via Brevo `/v3/smtp/email`, with no template/list/contact API calls.
The script does not import the app's lead pipeline. A Brevo `messageId` means
**accepted**, not delivered. The probe then polls the authorized Gmail Inbox up
to 180 seconds, matching the exact unique subject, sender, recipient and INBOX
label. Poll reads tolerate up to three consecutive errors within the same
deadline. Missing receipt explicitly fails. A message in Spam or All Mail only
does not pass. Provider sends are not retried: an ambiguous timeout could already
have accepted the message. A manual rerun creates a new identifier and email.

Disabled monitors report `SKIPPED_DISABLED`. Enabled monitors with any missing
or whitespace-only required configuration report `SKIPPED_UNCONFIGURED`, listing
only missing configuration names. Neither skip runs provider requests or sends
Slack failure alerts. Fully configured authentication, service or delivery errors
remain genuine failures and alert normally after the existing retries. The same
configuration checks apply to HubSpot. Logs, the JSON report and Actions summaries
show the exact skip status and state that coverage was not exercised.

## HubSpot monitoring

Use metadata read scopes supported by the intended account: `account-info.security.read`,
`forms` (HubSpot's forms scope), and `crm.schemas.contacts.read`. The forms scope
may permit writes at the platform level; the monitor only performs GET requests.
Do not grant CRM object write scopes. Validate available scopes in the account
before enabling, as HubSpot permissions and account features can differ.

The script reads `/account-info/v3/details`, `/marketing/v3/forms/{guid}` and
`/crm/v3/properties/contacts`. It checks the portal identity, nonarchived intended
form, mapped form fields and contact properties used by ALL8, including the
newsletter source property. It never reads customer object records or submits
forms. Its request count is three on a healthy run, at most nine after retries.

This verifies monitor credentials and intended configuration, **not** that the
deployed server has matching credentials, that CRM writes succeed, or that every
deal/pipeline/subscription setting is correct. Automatic HTML-form collection or
a HubSpot tracking script is not evidence of server-side integration success.
Write-path behavior is tested only with mocks. Compare portal/form IDs with the
owner's intended server configuration without changing the production environment.

## Slack setup and incident behavior

Create or reuse a Slack incoming webhook for the desired channel. Store it as
`SLACK_WEBHOOK_URL`; never put its value in code or logs. Failure payloads contain
`ALL8 Webworks`, failed check name, safe failure reason, UTC timestamp and Actions
run URL. Slack POSTs retry three times with bounded request timeouts. A missing
webhook during a failure is itself an explicit notification error.

Scheduled monitors restore `.monitoring/state/incident.json` using Actions cache.
Only a changed set of failing check names alerts. Reasons may change without a
new alert for the same check. A healthy run resets the incident; a recurrence
alerts again. The cache is saved under a unique run/attempt key, with a workflow
restore prefix and serialized monitor runs. State is persisted after Slack
acceptance only. Cache eviction/deletion can cause duplicates; lost Slack
responses can also produce retries of an accepted alert. CI alerts are per failed
main/manual run and have no cross-run suppression. No recovery or periodic
unchanged-status messages are sent. No Slack messages were sent during local QA.

## Tests and local commands

```text
npm test
npm run test:integration
npm run test:monitoring
npm run typecheck
npm run lint:ci
```

`npm run lint:ci` invokes ESLint without `--fix`; the existing developer lint
command remains unchanged. Vitest tests render the actual modal, contact and
newsletter components with mocked server actions and CAPTCHA browser API. They
assert pending state, token failure, server rejection, retry, success messaging,
single conversion events and honeypot suppression. Unit tests cover script
readiness/timeouts, fresh tokens, server verification rejection, schemas and
honeypots. Server integration tests cover real action/pipeline routing with
mocked rate limiting, CAPTCHA and external capture, durable capture failure,
secondary errors and newsletter isolation. Unmocked integration network requests
throw. Monitoring tests mock HTTP and Slack: no emails, customer records or Slack
messages are created.

Regression testing exposed premature newsletter success. `submitLead.ts` now
awaits newsletter persistence, and `runLeadBackgroundTasks.ts` requires the
subscriber upsert before sending confirmation. Primary failure returns retryable
failure; confirmation failure is logged after durable capture. Confirmation has
a documented 10-second deadline at the Brevo request: its AbortSignal cancels
the fetch, and a defensive race bounds a transport that ignores cancellation.
Confirmation errors/timeouts log only a fixed reason (`provider_error` or
`timeout`), never the subscriber, provider body or credentials. Successful capture
still returns success after confirmation failure/timeout. There is one upsert and
at most one confirmation send per accepted invocation, with no automatic resend
or recapture on a confirmation timeout. This avoids prompting the user to retry
an already captured subscription. Cross-request exactly-once delivery is not
claimed: a timeout can occur after provider acceptance. Newsletter
submissions still never create sales deals, tasks, notes or sheet rows. This is
the only app behavior change added in this task. Existing uncommitted CAPTCHA
and component changes were preserved and exercised, not replaced.

The Webpack build is configured **only inside GitHub Actions**, as requested.
Do not run it on the production server. Local build validation was not performed
because builds were explicitly restricted to Actions. Its first actual result
will be available after an approved push; no push was made here.

## Manual execution and diagnosis

After owner approval and push, open repository **Actions**, choose the named
workflow, select the reviewed branch and use **Run workflow**. For CI, supply the
two public Sanity variables first. For integrations, configure and enable each
check independently. Disabled/unconfigured checks show `SKIPPED_DISABLED` or
`SKIPPED_UNCONFIGURED` in the job log/summary even
though the enclosing workflow can be green; green does not imply inbox delivery
or HubSpot was tested. Monitor results are printed in the job summary; local
reports live in ignored `.monitoring/report.json`.

- HTTP/content/canonical failure: inspect the failed route, final status, H1,
  rendered content and canonical. Intentional copy changes may need expectation
  updates; a homepage/soft-404/redirect on a different route should fail.
- Blog discovery failure: verify the Blog index has crawlable article links.
- Legacy redirect failure: inspect the public `Location` and status. Escalate to
  the owner; this task does not change domain/server configuration.
- CI failure: inspect the first failed validation step. Fix missing public Sanity
  variables before interpreting build results. Lint warnings are visible but do
  not fail unless the configured rules make them errors.
- Email acceptance failure: check the Brevo key, sender verification and quota.
  Inbox timeout: inspect the unique subject in the dedicated mailbox and Brevo
  transactional logs, including Spam, delivery delay and filtering. Provider
  acceptance is not proof of receipt. Refresh/re-authorize expired Google access.
- HubSpot 401/403: verify token and read scopes. Portal/form/schema mismatch:
  compare the intended integration and mapped fields with account metadata.
- Missing Slack alert: check the notification step and webhook. GitHub Actions
  check status remains the fallback. Cache reset can allow a fresh incident alert.
- A checkout/setup outage can prevent the notifier from running at all. Review
  Actions failures and scheduling inactivity independently of Slack.

Never diagnose by submitting production leads or creating HubSpot records.

## Cost, API usage and limitations

At 96 website runs/day, healthy checks issue eight public GETs/run: about 768/day
or 23,040 per 30 days; persistent failures can triple this. No browser download or
npm install is needed for scheduled monitoring. Assuming about one billed Linux
runner minute per healthy website run, budget roughly 2,880 minutes/month plus
daily integrations and CI. Actual runtime, included minutes and billing depend
on repository visibility and the owner's current GitHub plan. Set an Actions
budget and review measured usage. CI installs this existing large app dependency
tree and runs a full build for each requested trigger.

Enabled email monitoring uses about 30 transactional emails/month and one OAuth
refresh, one mailbox profile read, normally one or a few Inbox polls and one
metadata read per daily run. An undelivered message normally causes up to 18
polls across three minutes; slow requests reduce that count. HubSpot uses about
90 metadata GETs/month before retries. Provider and mailbox plan costs/quotas
apply; prices were not assumed or changed. Cache state is tiny but a new cache
entry is saved each monitor run; GitHub cache quotas/retention still apply.

These are public HTTP checks and mocked regression tests, not production browser
E2E submissions, real CAPTCHA solving, end-to-end CRM writes, confirmation of
deployed credentials, mailbox delivery to every customer provider, SSL expiry
forecasting or a server-side failure-log tripwire. TLS/network failures are
detected on GETs. Representative article discovery can choose a new post as the
index changes; it does not monitor every article. The monitor cannot identify
server failures that occur only during a real submission. Inbox/HubSpot checks
remain disabled until the owner completes setup. GitHub outages, queue delays,
cache loss or disabled scheduled workflows limit detection and alert delivery.

## Local validation results

- Existing Node tests: 59 passed.
- New rendered form/server integration tests: 32 passed.
- Monitoring tests: 14 passed.
- Read-only production validation: all eight page/article/redirect checks passed.
- Disabled/unconfigured integration execution: explicit skip reasons; no sends/reads or Slack failure notifications.
- TypeScript: passed (`npm run typecheck`).
- Non-fixing lint: passed with 0 errors and 103 warnings (source and generated local files; no automatic fixes applied). Excluding ignored temporary build output with `--ignore-pattern 'tmp/**'` leaves 57 source warnings.
- `git diff --check`: passed.
- Build: configured in CI, not run locally; awaiting approved push.
