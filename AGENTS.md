# AGENTS.md

## Project

ALL8 Webworks is a Next.js App Router + TypeScript website using Tailwind CSS and HeroUI-style components. ALL8 is a small, owner-led business that builds and connects lead-generation systems for U.S. (and Canadian) service businesses and contractors — get found, get contacted, get a response, win the work. It is not a web design shop: websites, local SEO, ads, missed-call recovery, follow-up automation, CRM, and attribution tracking are all sold as pieces of that outcome, not as standalone deliverables. Positioning is outcome-first and U.S.-first; "Get My Free Lead System Review" is the sitewide CTA.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- HeroUI / NextUI-style components where used
- Sanity for blog content
- lucide-react for icons if needed

## Coding Rules

- Keep TypeScript strict.
- Avoid `any` unless there is a clear reason.
- Prefer small reusable components.
- Use server components by default.
- Use client components only when interactivity requires it.
- Keep diffs focused on the requested task.
- Do not redesign unrelated sections.
- Do not rename existing public routes unless explicitly asked.
- Preserve existing slugs and SEO URLs.

## Design Rules

- Mobile-first.
- Use clean spacing, rounded cards, strong headings, and clear CTAs.
- Keep focus states visible.
- Use semantic HTML.
- Keep one H1 per page.
- Use descriptive link text.

## SEO Rules

- `https://all8webworks.com` is the only canonical origin. `.ca` is a legacy domain and must redirect to the same `.com` path in one hop.
- Never wrap the public site, navigation or primary page content in `ssr: false`; titles, headings, copy and internal links must exist in the initial HTML.
- Preserve canonical URLs.
- Use crawlable internal links.
- Avoid generic anchor text like "click here" or standalone "read more".
- Blog posts should link to related articles and relevant service pages.
- Service pages should link to relevant blog articles.
- Sitemap entries should use real updated dates when available.
- Do not add noindex unless explicitly requested.
- New blog content should target one of the 9 service pages' own search intent as little as possible — write to feed a service page traffic, not to compete with it for the same query. Check `lib/relatedServices.ts` before publishing: if a post's topic has no keyword rule mapping it to a service slug, add one rather than letting it go unlinked.
- Currency and positioning: primary pricing on all pages is USD, U.S.-first framing. Canadian pricing/details, if shown, belong on a dedicated page, not mixed into the primary USD pages.
- Thin blog categories use `noindex,follow` and stay out of the sitemap until they contain at least three useful posts.

## Proof and Privacy

- `docs/proof-inventory.md` is the source of truth for public result wording.
- Approved primary proof: Google Search clicks grew from 40 to 100 per rolling 28 days from March to September 2026; Google Business Profile website clicks increased 76% year over year.
- Page-one, local and AI-result visibility are point-in-time supporting evidence, never permanent ranking claims.
- Keep the service-business client anonymized unless written naming permission is supplied. Exact missed-call rates and sensitive operational details are private.
- Use acquisition evidence only where it is relevant. Do not use SEO results as proof of CRM, Ads, follow-up or missed-call outcomes.
- Label systems honestly as `LIVE`, `TESTED`, `IN VALIDATION` or `PLANNED`; do not turn planned capability into a shipped claim.

## Hire Matt

- Preserve the exact H1: `Developer. Marketer. Business Problem Solver.`
- Position Matt primarily as `Web Developer · Growth Engineer`; supporting role families are Marketing Web Developer, Web Growth Engineer and Marketing Technology / Technical Marketing.
- Keep `/hire-matt` out of commercial navigation and do not show the Lead System Review modal/sticky CTA there.
- A mailto link is `Request Resume`, never `Download Resume`. Use `Download Resume` only after a real PDF exists.
- Employer analytics use distinct `hire_*` events; customer lead-review clicks and starts are not completed leads.

## Lead Capture

- Return success only after at least one durable primary capture succeeds. `generate_lead` fires only after that success.
- HubSpot, Sheets and CRM enrichment may be secondary, but failures must be logged and must not silently convert an uncaptured lead into a success message.
- Keep reCAPTCHA and all integration credentials server-side except documented public site keys/IDs.

## Pricing Model

- Lead Generation Websites is a subscription product ($1,500 USD setup + $299/month), not a one-time build. Do not reintroduce one-time "From $X" website pricing, a Tune-Up/Full Build tier split, or copy implying a client pays once and owns a finished project outright. Ownership terms live in that service's FAQs (`data/services.json`) — read them before touching this page's copy.
- Website Care & Optimization ($149/month) is only for sites ALL8 didn't build. For ALL8-built sites, hosting/security/backups/edits are already included in the Lead Generation Website subscription — never present Website Care as an extra charge for those clients.
- Avoid language that makes ALL8 sound like a traditional website-design shop (e.g. "get a website built," project quotes framed as the end goal). The website is the foundation of a broader lead system; CRM, missed-call recovery, follow-up automation, call tracking/attribution, SEO/content, and ads management are separate recurring/custom services, not included add-ons.
- `data/services.ts`'s `ServicePricing` type carries `currency` (defaults to USD in structured data if omitted) and an optional `billing: { setupFee, monthly }` for subscription services — set both on any new subscription-priced service so the JSON-LD `Offer` in `app/(site)/services/[slug]/page.tsx` represents it correctly.

## Commands

Use the actual project commands if different:

- npm run build
- npm run lint
- npx tsc --noEmit

## Done Means

A task is complete only when:

- The requested behavior is implemented.
- The diff is focused.
- Existing routes still work.
- Build passes.
- Lint/typecheck passes if configured.
- A concise summary of changed files and reasoning is provided.
