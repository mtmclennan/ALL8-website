# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owner-operators of small to midsize contracting businesses: excavation and sitework, plumbing, HVAC, electrical, landscaping and property maintenance, roofing, and other residential and commercial service contractors. They run crews, equipment, jobs and estimates, know their operations well, and neither know nor care about marketing terminology.

They come to the site on phone and desktop with no dominant pattern, so neither context is privileged. Their job on the site is to decide whether ALL8 can get them more qualified calls and quote requests, and whether it is worth starting with the free review.

`/hire-matt` exists for employers but is out of scope for this product record. AGENTS.md governs it.

## Product Purpose

ALL8 Webworks is a small, owner-led business that helps contractors turn more leads into paying customers. Success for the visitor is requesting the **Free Lead Leak Review** (primary CTA: "Get My Free Lead Leak Review"), and later buying one of the approved plans.

## Positioning

ALL8 helps contractors get found, get contacted, respond and follow up, and win more work. It is not a website-design shop. It connects the website, local search visibility, inquiry handling, and follow-up into one system, and it diagnoses before proposing. The customer hears the business outcome before the technology.

The journey is Get Found → Get Contacted → Respond & Follow Up → Win More Work. Explain it in full no more than once per page.

## Operating Context

- Site layers: **The System** (why plans are shaped as they are), **Capabilities** (`/services`, `/services/[slug]`, never priced), **Plans** (what customers buy, the only priced cards).
- Approved plans and prices live in AGENTS.md → Approved Plans and Pricing. AGENTS.md is the authority for offer names, pricing, terms and copy rules.
- Lead capture: forms with reCAPTCHA and a honeypot; success is shown only after durable capture.
- Content: Sanity-backed blog, a missed-call revenue calculator tool, an anonymized case study.

## Capabilities and Constraints

- Next.js App Router, TypeScript, Tailwind, HeroUI-style components. Dark visual system only.
- Preserve public routes, slugs and canonical URLs (`https://all8webworks.com`).
- All primary content must be in the initial HTML (no `ssr: false` on content).
- Capability/service cards never show package pricing. No currency or tax commentary in marketing copy. "No obligation" only beside the free review.

## Brand Commitments

- Name: ALL8 Webworks; Orbitron is reserved for the wordmark.
- Voice: plain English for contractors, speaking to the owner, outcomes before features, confident without hype, no guarantees, short mobile-friendly paragraphs. Avoid jargon such as "lead pipeline architecture", "attribution", "conversion infrastructure".
- Brand colours and stage-colour semantics are fixed in AGENTS.md → Brand and stage colors.

## Evidence on Hand

`docs/proof-inventory.md` is the source of truth for public proof wording.

- Primary: Google organic Search clicks grew from about 40 to 100 per rolling 28 days (March–September 2026); Google Business Profile website clicks up 76% year over year.
- Supporting, point-in-time only: page-one visibility for a targeted service page, strong local visibility for a high-intent search, appearance in a Google AI-generated result.
- The client stays anonymized. There are no testimonials, named clients, or CRM/Ads/missed-call outcome metrics yet; do not fabricate them, and do not use SEO results as proof for those services.
- System status labels: `LIVE`, `TESTED`, `IN VALIDATION`, `PLANNED`; never present planned capability as shipped.

## Product Principles

1. Diagnosis before proposal: the free review delivers real findings without requiring a sales call.
2. Outcomes before mechanisms: show more calls and won work, and explain the technology only when it helps the decision.
3. Measured, not asserted: every public claim traces to the proof inventory, with its scope intact.
4. The customer owns their accounts and data.
5. Honest scope: plans list concrete inclusions; nothing implies a capability ships with every plan.

## Accessibility & Inclusion

WCAG 2.2 AA is the required standard for all public pages, including 4.5:1 text contrast, visible keyboard focus, and the 24px minimum target size.
