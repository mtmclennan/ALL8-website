# AGENTS.md

## Project

ALL8 Webworks is a Next.js App Router + TypeScript website using Tailwind CSS and HeroUI-style components. ALL8 is a small, owner-led business that helps service businesses turn more leads into paying customers. The customer journey is **Get Found → Get Contacted → Respond & Follow Up → Win More Work**. ALL8 works across search visibility, websites, contact and lead capture, response, CRM and pipeline, follow-up, estimate follow-up, reviews, analytics, automation, and paid ads. Keep positioning outcome-first. The preferred primary CTA is **Get My Free Lead Leak Review**.

## Current Source of Truth

- This file governs future implementation. Historical audits, trackers, screenshots, and existing production copy describe earlier states; do not treat their old offer names, prices, or page structure as current instructions.
- This instruction update does not authorize website UI, route, content, schema, token, or deployment changes. Implement the phases below in later tasks.
- Preserve existing public routes and SEO URLs until a separate implementation request changes them.

## Information Architecture

The site has three layers:

1. **The System** explains why plans are structured as they are: Get Found → Get Contacted → Respond & Follow Up → Win More Work. Introduce the full framework generally no more than once per page. Later references may use short stage labels or tags without explaining the framework again.
2. **Capabilities** describe what ALL8 can do: Local SEO, Google Business Profile, Google Ads, websites, lead capture, missed-call recovery, lead follow-up, CRM, automation, analytics, and tracking. They primarily live on `/services` and `/services/[slug]`. Capability and service cards do not display package pricing.
3. **Plans** describe what the customer buys: Free Lead Leak Review, Lead System Tune-Up, Managed Website, Lead System, Growth System, and Google Ads Management. Plan cards are the primary card type allowed to show pricing.

**Capabilities are what we do; plans are what you buy; the system is why the plans are shaped the way they are.**

Do not infer package inclusions from a plan name. Favor concrete services, plans, proof, and useful information over repeated stage explanations.

## Offer Naming

- The approved free offer name is **Free Lead Leak Review**. The preferred primary CTA label is **Get My Free Lead Leak Review**.
- Older labels such as Lead System Review, Free Review, Lead Review, See Where I'm Losing Leads, See What I Should Fix First, and Review My Website & Lead Flow are not separate offers. Existing site copy may still contain them pending implementation.
- The review covers the website, search visibility, Google Business Profile where relevant, contact and response processes, follow-up, and obvious lead leaks. Give the customer useful findings about the main problems and what to fix first. A later call may be offered; receiving value must not require booking a sales call first.

## Approved Plans and Pricing

| Plan | Setup or one-time price | Recurring price | Minimum term |
| --- | --- | --- | --- |
| Free Lead Leak Review | Free | None | None |
| Lead System Tune-Up | $1,250 one-time | None | One-time engagement |
| Managed Website | $1,995 setup | $299/month | 12 months |
| Lead System | $2,495 setup | $995/month | 6 months |
| Growth System | Quoted setup | From $1,500/month | 6 months |
| Google Ads Management | $500 setup | $600/month + ad spend | 3 months |

- Additional work is $110/hour.
- Canadian clients: CAD + applicable HST. U.S. clients: the same numeric prices in USD. Make the market/currency clear in future public pricing; do not mechanically convert amounts or mix currency labels ambiguously.
- Google Ads clients pay Google directly for ad spend.
- Do not expose internal negotiation floors or internal pricing notes publicly.
- Plan pricing belongs on plan cards and the future pricing experience, not on capability/service cards. Existing service data and structured offers may still reflect the previous model; review them during the pricing implementation phase.
- The existing `ServicePricing` type in `data/services.ts` supports `currency` and subscription `billing: { setupFee, monthly }`. When implementing the new plan model, keep structured offers accurate for the approved setup and recurring charges; do not carry old service-level amounts into plan JSON-LD.

### Approved package scope

- **Lead System Tune-Up:** A focused engagement fixing the highest-priority lead-system problems. Potential work: website/conversion and Google Business Profile reviews, contact-form testing and routing, missed-call review or text-back setup, lead notifications, simple pipeline setup, estimate follow-up, review-request process, GA4, Search Console, conversion tracking, and before-and-after recommendations. Prioritize the business's biggest problems; never imply every item is included in every Tune-Up.
- **Managed Website:** Custom website design and development; hosting, SSL, security, backups, uptime and form monitoring; technical SEO foundation and schema; GA4 and Search Console; minor content updates, approximately one hour of changes per month, monthly performance check, and priority support.
- **Lead System:** Everything in Managed Website, plus Google Business Profile optimization, local SEO, source-level lead tracking, CRM/pipeline setup, missed-call text-back, instant lead alerts, automated new-lead and open-estimate follow-up, review-request workflow, monthly reporting on leads, response times, estimates and won/lost work, and a one-page Lead Handling Agreement. Software costs are included subject to current pricing assumptions.
- **Growth System:** Everything in Lead System, plus ongoing growth work scoped to client goals. Potential work includes SEO strategy, new service and landing pages, conversion optimization, content strategy, advanced automation, lead-flow improvements, and a monthly growth review.
- **Google Ads Management:** Campaign setup, ad copy, keyword and negative-keyword management, conversion tracking, landing-page alignment, ongoing optimization, and monthly reporting. The client pays Google directly for ad spend.

Do not present package scope as standalone service pricing or imply that a named capability always includes the full plan. Avoid framing ALL8 as a traditional website-design shop: the website supports the broader lead-to-customer outcome.

### Ownership and cancellation

Do not invent or change setup-fee payment, ownership, minimum-term enforcement, early-cancellation, post-term transfer, buyout, or transfer-fee terms without approval. Existing FAQs in `data/services.json` contain older terms; read them, but do not propagate them into the new pricing experience until deliberately reviewed. The approved minimum terms above are pricing facts, not approval of other contract terms.

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

### Brand and stage colors

- Keep the current dark ALL8 visual system. Primary values: `surface` `#0B0F1A`, `surface-alt` `#141B27`, `surface-footer` `#070A12`, `blue` `#0076FF`, `blue-light` `#3D97FF`, and `red` `#D00000`.
- Existing Tailwind stage colors are semantic labels for Get Found, Get Contacted, Respond & Follow Up, and Win More Work. Do not use them for generic decoration, primary button fills, or arbitrary card backgrounds.
- Red is primarily a logo accent and destructive/error color, never the primary CTA color.

### Text and typography

- Use three text strengths: **strong** for headings/primary text, **muted** for normal supporting/body text (approximately the current `ink-muted` treatment), and **faint** for metadata/captions/tertiary information. Prefer this hierarchy over one-off `/40`, `/50`, `/60`, or `/65` opacity variants. Do not refactor all CSS merely to enforce it.
- Use **Archivo** for headings and UI, **DM Sans** for long-form body copy including articles and longer FAQ answers, and **Orbitron** for the wordmark only.
- Future heading scale: **Display** for the homepage H1 only (about 40px → 66px responsive); **H1** for other page titles (about 36px → 56px); **H2** for section headings (about 28px → 42px); **H3** for cards/subsections (about 18px → 20px). Avoid new one-off `clamp()` values without a strong reason.
- Use an uppercase eyebrow only when it adds context, such as Case Study, Get Found, Lead System, or Resources. Avoid stacking eyebrow, slogan H2, and subtitle in nearly every section. Prefer clear headings such as Plans, Results, How We Work, Services, and What's Included. As a guideline, use roughly three or fewer two-part slogan headings per page.

### Layout and page length

- Keep the existing layout language: site container around 1160px, mobile gutters around 24px, wider established tablet gutters, article column around 680px, and generous section spacing (about 64px mobile and 96px desktop).
- Reduce long pages by removing duplicate concepts, combining repetitive sections, and placing proof/content where useful. Do not simply reduce all padding.
- Explain the full four-stage journey generally no more than once per page; short stage tags may recur afterward.

### Interaction and card types

- **Interactive elements must clearly look interactive.** Every clickable element needs visible hover and keyboard-focus states. Motion is optional. Cursor style alone is insufficient. Static elements must not behave like controls.
- If a whole card navigates, make it a semantic link where practical. Give it visible hover/focus treatment; a slight lift, blue border shift, and arrow affordance are allowed. Static cards do not lift, glow, show navigation arrows, or use a pointer cursor.
- Inline text links must visibly read as links. Body-copy links stay underlined and have obvious hover treatment.
- Primary buttons use ALL8 blue for the dominant conversion action, generally **Get My Free Lead Leak Review**. Aim for one clearly dominant primary CTA per section/context; this does not impose a literal one-blue-button-per-viewport limit. Secondary buttons use the established outline treatment (for example View Pricing, Explore Services, Text Us, See How It Works).
- Stage chips are flat semantic labels, not primary buttons. If linked, their interaction treatment must remain distinct from the primary CTA.
- **Capability/service cards** show what ALL8 can do: icon, title, short explanation, and a clear link/arrow if clickable. They do not show package pricing.
- **Plan cards** show what customers buy. They may include plan name, price, setup/monthly fees, best-for statement, short included list, relevant stage indicators, and CTA. They are the primary pricing card type.
- **Static information cards** present proof, included scope, process, or explanation. Do not give them clickable-card styling unless they actually navigate.

### Public labels

- Use **Blog** as the preferred public-facing label. If Field Notes is deliberately retained as an editorial brand, use it consistently rather than interchangeably. Flag current inconsistency for the implementation phase; do not rename routes as part of instruction cleanup.
- **Work** is the navigation/content category for case studies and projects. **Results** is a proof section showing measurable outcomes. Keep the labels distinct and preserve existing routes.

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
- Pricing currency and market presentation follow **Approved Plans and Pricing** above. Keep the U.S. audience in mind without contradicting the approved CAD + applicable HST terms for Canadian clients.
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
- Keep `/hire-matt` out of commercial navigation and do not show the customer Free Lead Leak Review modal/sticky CTA there.
- A mailto link is `Request Resume`, never `Download Resume`. Use `Download Resume` only after a real PDF exists.
- Employer analytics use distinct `hire_*` events; customer lead-review clicks and starts are not completed leads.

## Lead Capture

- Return success only after at least one durable primary capture succeeds. `generate_lead` fires only after that success.
- HubSpot, Sheets and CRM enrichment may be secondary, but failures must be logged and must not silently convert an uncaptured lead into a success message.
- Keep reCAPTCHA and all integration credentials server-side except documented public site keys/IDs.

## Implementation Order (future tasks)

1. **Global system cleanup:** buttons, links, hover/focus, static versus clickable cards, typography tokens, heading scale, navigation/footer consistency, and interaction behavior.
2. **Homepage and `/services`:** remove repeated stage explanations, surface concrete services and proof earlier, introduce plan preview, and reduce unnecessary mobile page length.
3. **`/pricing`:** build the approved plans and pricing experience.
4. **Service-page template:** clarify capability, where it fits, plans that include it, and next step.
5. **Blog and case studies:** improve cards, cover-image consistency, article presentation, proof hierarchy, and storytelling.
6. **Responsive and visual QA:** check 360px, 390px, tablet, desktop, interactions, accessibility, and page finish.

Do not start Phase 1 as part of this documentation-only task.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
