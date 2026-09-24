# Portfolio screenshots

Real captures of the running site, for GitHub READMEs, the portfolio and case studies. Files live in `/screenshots`.

This is a public marketing/lead-generation site: no login, no dashboard, no database-backed demo state. The screenshots show public pages exactly as served by a production build. The only "demo state" is the fictional numbers typed into the missed-call calculator.

| File | Route | Viewport | Role |
| --- | --- | --- | --- |
| `home-hero.png` | `/` | 1440 × 900 | Primary |
| `missed-call-calculator.png` | `/tools/missed-call-revenue-calculator` | 1440 wide, clipped to the calculator card (1440 × 1290) | Supporting |
| `case-study-results.png` | `/work/service-business-growth-case-study` | 1440 × 900, scrolled to "Captured results" | Supporting |
| `services-overview.png` | `/services` | 1440 × 900, scrolled to "Five Steps Between a Search and a Customer" | Supporting |
| `home-mobile.png` | `/` | 390 × 844 at 2× (780 × 1688) | Supporting (mobile) |

## What each shows, seed state and caption

**`home-hero.png`** (primary): the positioning and the offer: lead systems for service businesses, with a clear sitewide CTA. No seed state.
Caption: _ALL8 Webworks: a Next.js lead-generation site for service businesses, built around get found, get contacted, respond faster, win the work._

**`missed-call-calculator.png`**: a working, client-side tool with Zod-validated inputs and a tested calculation module (`lib/calculators/missedCall.ts`, `tests/missed-call-calculator.test.ts`).
Seed state: missed calls/week `8`, genuine-lead rate `60%`, average job value `$4500`, close rate `35%`, recovery rate `10%`, then "Calculate My Estimate". Nothing is saved or sent.
Caption: _Interactive missed-call revenue calculator: validated inputs, instant results, all computed in the browser._

**`case-study-results.png`**: the case study with approved proof metrics, and honest status labels (`IN VALIDATION`) that separate validated work from planned capability, per `docs/proof-inventory.md`. The client is anonymized.
Caption: _Case study with sourced results and explicit validation status instead of unsupported claims._

**`services-overview.png`**: the lead-journey model (search → click → call/lead → follow-up → customer) that organizes all nine service pages.
Caption: _The lead-journey model that structures the site's service pages and content._

**`home-mobile.png`**: the mobile-first layout and navigation.
Caption: _Mobile-first layout with the same hierarchy and CTA as desktop._

## Recommended README order

1. `home-hero.png` (primary)
2. `missed-call-calculator.png`
3. `case-study-results.png`
4. `services-overview.png`
5. `home-mobile.png`

## How they are captured

`scripts/capture-portfolio-screenshots.mjs` (Playwright, Chromium, reduced motion, dark scheme). It only accepts a `localhost`/`127.0.0.1` origin, submits no forms and needs no authentication, so no production auth or data is involved.

Use a production build so no Next.js dev overlay appears, and blank the third-party keys so no reCAPTCHA/analytics widgets render:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= NEXT_PUBLIC_GTM_ID= NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_GOOGLE_ADS_ID= npm run build
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= NEXT_PUBLIC_GTM_ID= NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_GOOGLE_ADS_ID= npx next start -p 3187 -H 127.0.0.1
node scripts/capture-portfolio-screenshots.mjs
```

Playwright is not a project dependency: run `npm i -D playwright` first, or set `PLAYWRIGHT_MODULE` to an existing install directory.

## Known issues seen while capturing (not fixed)

- Service detail pages (`/services/[slug]`): the breadcrumb bar renders underneath the fixed header at scroll 0, so it overlaps the logo. These pages were not used for screenshots.
- A React hydration mismatch (error #418) logs in the browser console on `/` and the calculator page in the production build. It is invisible on screen but worth tracing.
