# Lead form reliability patch — November 6, 2026

## Changes in this patch

- `lib/leads/leadSubmission.ts`: fixed-category diagnostics for honeypot and
  schema rejection; explicit `captured:false` on validation failure.
- `lib/leads/submitLead.ts`: structured rejection diagnostics, explicit failed
  capture states, safe rate-limit response instead of exception text, graceful
  handling of an unexpected verifier exception, and no raw error objects in
  this handler's primary/secondary capture diagnostics.
- `lib/email/emailBrevo.ts`: reject missing owner recipient before sending;
  diagnose missing configuration, HTTP status, network error, and timeout without
  logging exception text, provider bodies, payloads or credentials. Owner failure
  still throws; customer acknowledgement failure remains secondary after capture.
  Default Brevo requests now use a 10-second abort signal; the newsletter's
  existing explicit timeout signal remains unchanged. No automatic retry.
- `tests/integration/pipeline.test.ts`: rejection metadata/privacy and failure
  response regressions.
- `tests/integration/email-capture.test.ts`: missing destination, HTTP/network/
  timeout diagnostics, abort propagation, and privacy regressions.
- `tests/integration/lead-delivery.test.ts`: real action/pipeline with stubbed
  Brevo HTTP rejection; no customer acknowledgement or secondary integration.
- This report: `docs/lead-form-reliability.md`.

The prior honeypot field, submission snapshot handling, and client capture guard
are preserved. No UI, CAPTCHA policy, rate-limit policy, packages or configuration
were changed. New diagnostics contain only fixed event/reason/form categories
and numeric HTTP status. Runtime logs supply timestamps; there are no identifiers
or form contents in these records.

## Slack assessment

Existing Slack delivery is in `scripts/monitoring/notify.mjs`, used by GitHub
Actions. It reads a monitor report and maintains filesystem incident state to
suppress duplicate alerts; `SLACK_WEBHOOK_URL` is supplied by workflow secrets.
It is not a request-time application alert helper. Reusing it in this serverless
submission path would require runtime configuration and a decision about alert
volume/deduplication and delivery lifetime. Deferred rather than importing CI
filesystem/retry behavior into form handling. No Slack request was made and no
secret values were inspected. Later work can route the fixed
`owner_notification_failed` event to existing operational alerting.

## Validation

- Pipeline: 19 targeted tests pass.
- Notification helper: 7 targeted tests pass, including timeout/abort behavior.
- Real lead action/delivery: 4 targeted tests pass with providers stubbed.
- Existing form UI: 18 targeted tests pass, including `captured:false` showing an
  error instead of success, retry behavior, and conversion suppression.
- `npm run typecheck`: passes.
- Changed-file lint: zero errors, 14 warnings for intentional server diagnostics.
  The three test files are excluded by the existing ESLint configuration.
- No full build or broad suite run for this patch.

## Limits and manual verification after release approval

No production access, submissions, configuration changes, deployment, commits or
pushes occurred. These are future manual checks, not actions performed here:

1. Confirm required Brevo key/recipient configuration exists without copying
   values into logs or reports. Confirm the hosting request time budget can
   accommodate CAPTCHA plus owner and customer requests.
2. With authorization, submit one designated test lead through each commercial
   form. Expect `ok:true, captured:true`, owner notification acceptance/delivery,
   the customer acknowledgement, and one completed conversion per lead. Check
   the intended HubSpot/Sheets/CRM records.
3. Check production logs for fixed `submission_rejected` and
   `owner_notification_failed` events and verify no personal data appears in
   these new diagnostics. HTTP status identifies provider rejection; timeout
   does not establish whether Brevo accepted a request before disconnecting.
4. On staging only, simulate owner HTTP rejection, missing configuration and
   timeout. Expect a retry error, `captured:false`, no conversion and no
   secondary pipeline. Confirm CAPTCHA/rate-limit/honeypot rejection remains
   effective; do not intentionally break production configuration.

Provider acceptance is not an inbox-delivery guarantee. A timeout can be
ambiguous, and a manual retry can duplicate a previously accepted notification.
There is no durable queue or request deduplication in this patch. Existing
background integration log sites and serverless enrichment lifetime are outside
this focused patch; this is not a claim that all repository logging was audited.
The original production honeypot field writer remains unconfirmed.

## Finalization review — November 6, 2026

The subsequent review includes both this patch and the honeypot fix. Validation
passed: 54 targeted integration tests, 19 targeted unit tests, six Chromium form
scenarios, standalone typecheck, and one `npm run build -- --webpack` build
(55 static pages). Changed application files have zero lint errors. All 14
`no-console` warnings were reviewed and accepted for fixed-category server
diagnostics; no lint rules were disabled. The earlier no-build/no-commit notes
describe the initial patch handoff; the subsequent user request authorizes
committing and a fast-forward push after validation.
