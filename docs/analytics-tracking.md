# Analytics & Tracking

GTM is the single tagging layer. The app never loads GA4 or Google Ads scripts
directly — it only pushes typed events to `window.dataLayer`. GA4 and (later)
Google Ads conversions are configured entirely inside the GTM container as
tags that listen for these events. This keeps measurement config out of code
and lets it change without a deploy.

## Code layout

- `lib/analytics/dataLayer.ts` — the only place that calls `dataLayer.push`.
  Every tracked action goes through one of its typed helpers.
- `app/(site)/_components/analytics/AnalyticsBridge.tsx` — mounted once in
  `app/layout.tsx`. Handles SPA route-change page views and a single
  document-level delegated click listener for `tel:`/`sms:`/`mailto:` links
  and any element carrying `data-cta`.
- `app/layout.tsx` — loads GTM via `@next/third-parties/google`'s
  `GoogleTagManager`, gated by `isValidGtmId` logic (see below).

## GTM loading & the placeholder guard

`NEXT_PUBLIC_GTM_ID` is read in `app/layout.tsx`. Before rendering
`<GoogleTagManager>`, the ID must match `GTM-` followed by a mixed-character
suffix — a suffix that's a single character repeated (`XXXXX`, `000000`,
`YYYYYYY`) is rejected. This specifically catches the placeholder that was
previously shipped (`GTM-XXXXX`), which the old code rendered unconditionally
— a real request to Google that silently returned an empty/stub container, so
`dataLayer.push()` calls just queued into an array that nothing ever read.

**Action required in your deployment environment:** set `NEXT_PUBLIC_GTM_ID`
to your real GTM container ID (`GTM-XXXXXXX`, 7 chars, real mix of letters/
digits). Until that's set, GTM does not load at all (no script tag, no
noscript iframe) — this is intentional; it's safer than loading a dead
container that looks configured but isn't.

Google Ads is even further gated: there is no code path that loads a Google
Ads tag at all. `NEXT_PUBLIC_GOOGLE_ADS_ID` is declared but unused by design
(see "Google Ads" below) — nothing needs to change in code to enable it later.

## Fixed alongside this work

- **HubSpot's own tracking script was silently dead.** `app/layout.tsx` was
  reading `NEXT_PUBLIC_HS_PORTAL_ID`, which is never set — only server-only
  `HS_PORTAL_ID` exists in `.env.local`. Since `layout.tsx` is a Server
  Component, it can read the non-`NEXT_PUBLIC_` var directly and pass it down
  as a prop; no client-bundle exposure needed. Fixed to read `HS_PORTAL_ID`.
- **`Button.tsx` didn't special-case `sms:` hrefs.** It special-cased
  `tel:`/`mailto:`/`#`/`http(s)://` to render a plain `<a>`, but fell through
  to Next's `<Link>` for `sms:` — which two live CTAs on `/contact` use
  ("Text Us Now", the FinalCta "Text {phone}" button). Fixed so `sms:` is
  treated the same as `tel:`/`mailto:`.

## Events tracked

| Event | GA4-style name | Fires when | Key parameters |
|---|---|---|---|
| Page view (SPA) | `page_view` | Client-side route change, **not** the initial load (GTM's own container-load / GA4 Config tag already covers page 1) | `page_path`, `page_location`, `page_title` |
| CTA click | `cta_click` | Any "Get My Free Lead System Review" trigger opens the modal — nav, footer, sticky bar, hero/final CTAs sitewide, all 9 service pages, blog posts (~17 call sites, one code path: `LeadModalProvider.openModal`) | `cta_id: "lead_system_review"`, `page_path` |
| Form start | `form_start` | First focus into either lead form (modal or `/contact` inline) | `form_location: "modal"\|"contact_page"`, `lead_type`, `page_path` |
| **Lead conversion** | `generate_lead` | Server action returns success (`state.ok`) for either lead form — **the primary conversion event** | `form_location`, `lead_type`, `page_path`, `utm_source/medium/campaign/content/term`, `page_name` |
| Phone click | `phone_click` | Any `tel:` link, sitewide | `link_url`, `page_path` |
| Email click | `email_click` | Any `mailto:` link, sitewide | `link_url`, `page_path` |
| SMS click | `sms_click` | Any `sms:` link (the `/contact` page's primary channel) | `link_url`, `page_path` |
| "Book a Call" click | `book_call_click` | The `/contact` page's "Book a Call" card | `cta_id: "book-a-call"`, `page_path` |

**Note on "booking completions":** there is no distinct booking/scheduling
flow in the product today — "Book a Call" scrolls to the same lead-review
form as every other secondary CTA on `/contact` (confirmed in code; it isn't
wired to Calendly or similar). `book_call_click` tracks the *click*, which is
the only distinct action that currently exists. If a real scheduler is added
later, its completion event should be added the same way (a new
`trackCustomEvent`/`data-cta-event` pair) — there's no "completion" to
measure yet.

### Why nothing double-fires

- **Route changes** compare the current URL against the *last tracked* URL
  (a ref seeded from the URL at first render), not a "have I run yet" flag —
  see the comment in `AnalyticsBridge.tsx` for why a boolean-flag approach is
  actually unsafe here (React's dev-only Strict Mode double-invokes this
  effect once on mount, and a boolean flipped in the skip branch flips
  true→push on that second invocation).
- **`generate_lead`** is guarded by a ref set at the moment of push, inside
  the same effect that reacts to submission success — safe against Strict
  Mode's double-invoke by construction (the ref is already `true` by the
  second invocation). For the modal specifically, the guard resets when the
  modal closes, so a genuine second submission after reopening is correctly
  tracked as a second conversion — it isn't a permanent one-shot lock.
- **`form_start`** is a `useRef` flag set on first real DOM focus, not tied to
  a React effect at all, so there's no double-invoke exposure.
- **Click events** (`cta_click`, `phone_click`, `email_click`, `sms_click`,
  `book_call_click`) come from one delegated `click` listener attached once
  in `AnalyticsBridge`. `data-cta` elements are checked first and return
  early, so an element can never match both the explicit `data-cta` branch
  and the generic `tel:`/`sms:`/`mailto:` fallback in the same click.

All of the above was verified live against the running dev server (not just
read from source): confirmed a clean initial `dataLayer` (only the consent
default, no spurious `page_view`), then confirmed `cta_click` → `form_start`
→ `phone_click` → `page_view` each appeared exactly once as the corresponding
actions were performed, and that `book_call_click`/`email_click`/`sms_click`
fire with the correct distinct names. `generate_lead` was **not** live-tested
end-to-end — doing so would create a real HubSpot contact/deal and send real
Brevo emails through production credentials configured in `.env.local`. Its
correctness rests on hooking into the exact same `state.ok` success signal
the existing "Request received" UI already relies on.

## UTM / attribution preservation

`hooks/use-hubspotContextFields.ts` already captures `utm_source/medium/
campaign/content/term` from the URL on mount and both lead forms already
thread them into the server action as hidden fields (this existed before this
change — the analytics layer reuses it, doesn't duplicate it). The
`generate_lead` event now carries the same UTM values as GTM/GA4 event
parameters, so the conversion event and the CRM record it produces share one
attribution source instead of two independently-computed ones.

This does **not** fix the separate, pre-existing gaps found in the lead-pipeline
audit — `utm_content`/`utm_term` and referrer are still dropped before reaching
the HubSpot CRM contact record, Google Sheets, and the Brevo alert email (they
only reach HubSpot's Forms API). That's a backend-pipeline issue, out of scope
for the analytics layer itself; flagged separately in the full audit report.

## GTM configuration required (in the GTM UI — not code)

The following needs to be built inside the GTM container once a real
`NEXT_PUBLIC_GTM_ID` is set:

1. **GA4 Configuration tag** — fires on the built-in "Initialization"/"All
   Pages" trigger. This is what covers pageview #1; do not also try to fire
   it from the custom `page_view` event below, or page 1 double-counts.
2. **Custom Event trigger: `page_view` (SPA)** — matches our custom
   `page_view` push. Attach a **GA4 Event tag** (event name `page_view`,
   parameters `page_location`/`page_title` from the dataLayer variables) so
   client-side route changes get counted as additional pageviews.
3. **GA4 Event tag: `generate_lead`** — trigger on custom event `generate_lead`.
   Map `form_location`, `lead_type`, `page_name`, and the five `utm_*`
   parameters as event parameters. **Mark this as the GA4 key/conversion
   event** — see below.
4. **GA4 Event tags for the rest**: `cta_click`, `form_start`, `phone_click`,
   `email_click`, `sms_click`, `book_call_click` — one Custom Event trigger +
   GA4 Event tag per event name, passing through the relevant dataLayer
   variables (`cta_id`, `link_url`, `form_location`, `page_path`).
5. **Variables**: create GTM User-Defined Variables (Data Layer Variable
   type) for each parameter name used above (`cta_id`, `link_url`,
   `form_location`, `lead_type`, `utm_source`, etc.) so they can be mapped
   into GA4 event parameters.

## GA4 key/conversion events

- **Primary conversion: `generate_lead`.** Mark this as a key event in GA4
  Admin → Events. This is the only event that should count as a completed
  lead — `cta_click`/`form_start` are funnel/engagement signals, not
  conversions, and should stay unmarked to avoid inflating conversion counts.
- Optional secondary key event: `book_call_click`, if the business wants to
  track call-booking intent separately in reporting — it's a click, not a
  completion, so treat it as a softer signal than `generate_lead`.

## Google Ads

Deliberately not wired, per instruction: `NEXT_PUBLIC_GOOGLE_ADS_ID` stays an
unused placeholder in code until a real `AW-` conversion ID and conversion
label exist. **No code changes will be needed to enable it later** — once a
real Ads account/conversion action exists:

1. Import the GA4 property as a **Google Ads conversion source** in Google
   Ads (Tools → Conversions → Import from Google Analytics), mapping
   `generate_lead` as the imported conversion action. This requires zero new
   code or GTM tags — GA4-to-Ads import happens entirely in the Ads UI once
   Ads and GA4 are linked, and reuses the exact conversion event this
   implementation already produces.
2. Alternatively (if a separate, direct Ads conversion tag is preferred over
   GA4 import), add a **Google Ads Conversion Tracking tag** in GTM, trigger
   on the same `generate_lead` custom event, using the real `AW-` ID and
   conversion label once assigned.

Either path plugs into the `generate_lead` event that already exists — the
choice is a GTM/Ads-account configuration decision, not a code one.

## GA4 measurement ID: `G-EC1000PEGH` — should it stay?

This ID was **never actually collecting data** before this change (confirmed
in the analytics audit: the `GoogleAnalytics` component was never imported
anywhere in the app; the ID's only prior use was as display text substituted
into the Cookie Policy page body). There is no historical GA4 data tied to it
that would be lost by changing it, which makes this a low-stakes decision
either way:

- **Keep `G-EC1000PEGH`, repoint its Data Stream's default URL** to
  `https://all8webworks.com` in GA4 Admin → Data Streams. Simplest path, one
  fewer ID to manage, and it's about to start collecting real data for the
  first time regardless of which ID is used.
- **Create a new property/stream** instead if the existing property is
  already named/labeled around the `.ca` domain or the old "web design"
  positioning in a way that would be confusing in GA4's UI going forward, or
  if `.ca` and `.com` are meant to report as fully separate businesses long
  term rather than one property with the domain having changed.

This wasn't something I could resolve from the repo — GA4 property naming and
history live in the GA4 admin console, not in code. Whichever is chosen, only
one place needs the ID: the GA4 Configuration tag inside GTM (step 1 above) —
the Next.js app itself no longer needs to read `NEXT_PUBLIC_GA_ID` at all once
GA4 is deployed through GTM rather than loaded independently, per the
"don't double-load GA4" requirement.

One separate, related infrastructure point worth flagging: `all8webworks.com`
currently resolves/redirects to `all8webworks.ca` at the hosting/DNS layer
(confirmed by navigating to the live `.com` URL and observing it load `.ca`
content). If both domains remain simultaneously reachable once the canonical
domain flips in code, GA4's cross-domain measurement should be configured
for both hostnames to avoid session-splitting; if `.ca` is meant to fully
redirect to `.com` going forward, that's a hosting/Cloudflare change, not
something this analytics layer can control.

## Known gap not addressed here

Consent Mode is still effectively non-functional (`analytics_storage:
'granted'` by default, no real consent banner, no `gtag('consent','update',
...)` call anywhere) — this was flagged in the analytics audit as a separate,
pre-existing issue. It's out of scope for "implement the tracking layer" since
it requires a real consent-banner UI and a legal/compliance decision on
default states, not just event wiring. Worth prioritizing before traffic
starts flowing through the now-functional GTM container, since the current
default of `analytics_storage: 'granted'` means analytics cookies would start
being set pre-consent as soon as a real GTM ID is deployed.
