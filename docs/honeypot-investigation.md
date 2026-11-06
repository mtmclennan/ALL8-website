# Honeypot false-positive investigation — November 6, 2026

## Findings and confidence

The supplied production response identifies the server's honeypot short-circuit:
`ok:true, captured:false`. A nonempty string in `hp` returns before schema
validation, rate limiting, CAPTCHA, Brevo, or secondary enrichment. No provider
request is expected on that path. The pipeline also checks `hp` independently.

All three forms (lead modal, contact, newsletter) used a text input concealed
with `sr-only`, `autocomplete="off"`, and `tabIndex=-1`. The modal and contact
wrapped it in `aria-hidden`; the newsletter applied that attribute directly.
These accessibility attributes do not suppress browser autofill. A clipped text
input still participates in layout and can receive programmatic focus. There
was no password-manager suppression hint.

Each enhanced action replaced the browser's submitted `FormData.hp` with a
fresh read of `hpRef.current.value`. This adds an unnecessary DOM read after
the submission snapshot. A real-browser regression now reproduces that timing
condition by changing the DOM field during the `formdata` event, after the
browser captures its value. The fixed forms preserve the submitted snapshot.
Filled traps present at submission are preserved and rejected.

The client also treated `ok:true, captured:false` as a completed request, hiding
the form and displaying a success message. It correctly suppressed conversions,
but hid the capture failure from legitimate visitors.

**The production field writer is not confirmed.** The supplied response proves
that the trap was nonempty, but does not distinguish browser autofill, a password
manager, another script, or a DOM change around submission. The timing regression
is a controlled reproduction, not evidence that this was the exact production
trigger. No production server, form submission, or configuration was accessed.

## HubSpot investigation

`HubspotLoader` appends the tracking script after three seconds. The local code
does not write to `hp`. The context hook reads the tracking cookie and context;
it does not populate form inputs.

[HubSpot's non-HubSpot form documentation](https://knowledge.hubspot.com/forms/use-non-hubspot-forms)
describes collecting submissions, retaining data in localStorage, and mapping
fields into CRM properties. It excludes hidden fields and lists limitations for
JavaScript submission handlers and single-page apps. It does not establish that
the collector writes to honeypot inputs. Whether automatic collection is enabled
for this account, and whether the loaded script contributes to this incident,
remain unverified. Tracking and production settings are unchanged. The intended
server-side Forms API/CRM integration remains in place.

## Implemented changes

- `HoneypotField.tsx`: one shared neutral-name `hp` text control, hidden with the
  HTML `hidden` attribute and explicit `display:none`, excluded from accessibility
  and keyboard navigation, with autocomplete off and 1Password/LastPass ignore
  hints. It remains enabled and included in native `FormData`.
- All three forms: use that field and remove the live `hpRef` overwrite. No trap
  value is cleared or ignored, and the server predicate is unchanged.
- `clientCaptcha.ts`: turn an uncaptured success response into a visible retry
  error without automatic retry or changing the server's silent bot response.
  Successful UI now requires an explicit durable-capture confirmation.
- `submitLead.ts`: return `captured:true` after durable primary capture. Customer
  conversion guards also require that explicit confirmation.

CAPTCHA verification, rate limiting, schema validation, and both server-side
honeypot checks remain intact. No timing exemptions, CAPTCHA-based trap bypasses,
or client-side clearing were introduced. Browser extensions can override page
autofill hints; this change cannot guarantee their behavior. Such failures are
now visible instead of appearing as saved requests.

## Regression verification

- `npm test`: 60 unit tests pass.
- `npm run test:integration`: 45 tests pass. These include real server actions,
  validation, pipeline and background orchestration, with provider boundaries
  stubbed. Legitimate modal/contact submissions reach the Brevo request adapter,
  HubSpot Forms, Sheets, and CRM steps. Filled traps reach none. CAPTCHA, rate
  limiting, capture failures, retry behavior, and conversion suppression pass.
- `node --test tests/browser/honeypot.test.mjs`: six scenarios pass in local
  headless Chromium: legitimate and bot submissions for all three rendered React
  forms. Checks cover layout/focus exclusion, native `FormData`, preserved bot
  values, simulated post-snapshot DOM writes, CAPTCHA token attachment, visible
  failure, success, and conversion counts. Server actions and CAPTCHA are stubbed;
  the fixture is loopback-only and makes no vendor submissions. Requires an
  installed Edge/Chrome, or `HONEYPOT_TEST_BROWSER` pointing to Chromium; skips
  when neither is available. Uses esbuild from the existing Vitest toolchain.
- `npm run typecheck`: passes.
- `npm run lint:ci`: zero errors; existing repository warnings remain. Focused
  lint of changed application files reports only three existing console warnings
  in `submitLead.ts`.

- `npm run build`: fails with a Turbopack CSS-worker process-startup panic, both
  inside and outside the sandbox. The reported CSS module was not modified.
- `npm run build -- --webpack`: passes, including TypeScript, all 55 static pages,
  and build tracing. This is a command-line fallback only; the default build
  configuration is unchanged. The default Turbopack failure remains unresolved.

## Remaining verification before release

1. Reproduce on an isolated staging environment with the affected browser/profile
   and saved autofill details, including browser back/restore, modal reopen and
   client navigation. Test relevant password managers and real keyboard/AT use.
2. Compare tracking-script enabled/blocked cases on staging. Inspect only whether
   the trap becomes nonempty and when; do not log trap contents or contact data.
   Establish the production field writer before claiming an exact causal trigger.
3. Using staging credentials and designated test destinations, verify real CAPTCHA,
   rate limiting, durable provider acceptance, HubSpot/Sheets/CRM delivery, and a
   single completed conversion. Automated tests prove orchestration, not live
   provider acceptance or production runtime delivery.

No production submissions, configuration changes, deployments, commits, or pushes
were performed. Changes are left for review.
