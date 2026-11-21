# Positioning plan: contractor copy for /, /pricing, /about

> Audit only. No files in `app/`, `data/` or `lib/` were edited. Work stops here until approved.
> The brief was not at `docs/positioning-brief.md` (not on any branch or in history); it was read from `Downloads/positioning-brief.md`.

## 1. Source map

**Everything on the three pages lives in code. Nothing is in Sanity.** The only Sanity touch is `HomeResources.tsx`, which fetches two blog posts by slug (titles/excerpts come from Sanity; the section heading and intro are in code). Blog post titles and SEO fields are Sanity-owned, so they need manual edits (section 4).

| Page | Copy | Metadata | FAQ | JSON-LD |
|---|---|---|---|---|
| `/` | `data/home.json` (typed by `data/home.ts`, proof tokens via `data/proof.ts`); rendered by `app/(site)/Home.tsx` + `_components/home/*`. Plan cards from `data/plans.ts`. Services cards from `data/services.ts`/`services.json`. Inline copy: `PlansPreview.tsx` (heading, intro, currency footnote), `ServicesPreview.tsx`, `WhyAll8.tsx` ("Work directly with Matt"), `HomeResources.tsx` | `app/(site)/page.tsx` (inline `buildPageMetadata`) | `homeData.faqs` in `home.json` | `page.tsx`: FAQPage only |
| `/pricing` | `app/(site)/pricing/page.tsx` (all headings, intro, currency box, comparison cards, `$110/hour` strip, final CTA); plan data in `data/plans.ts`; `PlanCard.tsx`, `PlanPrice.tsx` | `pricing/page.tsx` inline | `const faq` inline in `pricing/page.tsx` (not in JSON-LD) | `pricing/page.tsx`: WebPage + BreadcrumbList (no Offer/price data, no FAQPage) |
| `/about` | `data/pages/about.json` (typed by `about.ts`); components in `about/components/*` plus shared `FounderSection`, `ProofCards`, `FinalCta` | `about.json` `title`/`description` via `buildStaticMetadata("/about")` | none | `about/page.tsx`: Person + AboutPage + BreadcrumbList; both point at `/#organization` |
| Sitewide | `Navbar.tsx` (CTA literal), `Footer.tsx`, `StickyCta.tsx`, `LeadModal.tsx`, `CallToAction.tsx` (default micro text) | `app/layout.tsx` default title/description; `data/site.json` (site description, default OG image) | n/a | `app/layout.tsx`: Organization (from `data/schema/organization.schema.json`) + WebSite |
| Case study | `app/(site)/work/service-business-growth-case-study/page.tsx` (501 lines, all inline, one H1); `/work` index in `work/page.tsx` + `data/work.ts` | inline | none | inline, references `/#organization` |

Source of truth rules: copy edits go to the JSON/TS above, not to rendered output. Prices only in `data/plans.ts` (do not touch). Proof numbers only in `data/proof.ts` and `docs/proof-inventory.md`.

## 2. Findings against the brief's 10 audit points (exact current wording)

1. **Excessive/repetitive wording.** The four-stage idea is explained in the hero badges ("Get found / Get contacted / Respond faster / Win more work"), `SystemRail` ("One System, Four Stages"), the process steps ("Find the Leak. Fix What Matters Most."), and FAQ 1 ("We work across four stages: …"). "Fixed scope before work begins" repeats in process, final-CTA micro, About facts and principles. The leak/outcomes/flow/proofCards blocks exist in `home.json` but `Home.tsx` does not render `LeakSection`, `OutcomeServices`, `IntegrationsFlow` or `ProofCards`; they are dead data on the home page. `LeakSection` ("Most Service Businesses Aren't Short on Demand. They're Losing It Somewhere.") is reusable for the brief's "common contractor problems" step.
2. **Jargon.** Hero: "Lead Systems for Service Businesses" (pill); "We find where opportunities are being lost — search, website, calls, follow-up or tracking — and fix the part costing you the most." Also "lead path", "lead leak", "Lead System", "attribution" ("Lead source attribution", "call and lead attribution"), "Connect the System", "Measure & Improve". Pricing H1: "Find the leak. Choose the right level of help." Pricing compare cards: "Capture / Connect / Improve".
3. **Unclear offers.** Pricing nests two things called "Lead System" (the plan and the Tune-Up's "lead-system gaps"). "Tune-Up credit" is explained twice (FAQ + callout). Home "Plans" shows four of six with "Growth System and Google Ads Management are also available."
4. **Contradictions.** (a) `servicesPage.json:131` "No twelve-month commitment to get started." vs Managed Website "12-month minimum". (b) "No long-term commitment" micro-line (see section 4) sits beside paid plans with 3/6/12-month minimums. (c) About says "one stage of five" / "the same five stages apply"; home says four; services says both "Five Steps Between a Search and a Customer" and "Four Outcomes. One System." (d) Home hero says "Remote-first, Eastern Time" while sections elsewhere say Ontario-based; fine but repeated 6×.
5. **Weak/generic headlines.** Home H1 "Turn More Searches, Clicks & Calls Into Customers." (generic, no audience). Home title tag "Service Business Websites, Local SEO & Lead Systems". About H1 "We Stopped Leading With Websites." Pricing H1 above. "Proof, Not Promises", "Measured Results, Not Adjectives", "What Owners Ask Before Getting Started", "Plans" are fine or neutral.
6. **Confusing pricing explanation.** Currency box ("Currency: U.S. clients pay these numeric prices in USD. Canadian clients pay the same numeric prices in CAD, plus applicable HST. No exchange-rate conversion is applied."), FAQ "What currency are the prices in?", home footnote ("U.S. prices are in USD. Canadian clients pay the same numeric prices in CAD plus applicable HST."), and `$110/hour` twice. Plan card price format ("$299/mo", "+ $1,995 one-time setup · 12-month minimum") is already close to the brief's format.
7. **SEO opportunities.** "Contractor" appears almost nowhere in the three pages' titles/H1s (home "Service Business"; about "Websites"; pricing "Plans & Pricing"). "Excavation" and "Plumbing" appear only as About chips and the anonymized case study. Pricing title has no keyword ("Plans & Pricing | ALL8 Webworks", 35 chars). Home title lacks the brand (see verification). All pages except `/contact` use the same OG image.
8. **Lacking business context.** No page says who ALL8 is for in the hero. Founder trade background is absent everywhere in the repo (no mention of automotive technician, heavy equipment, excavation, estimating). The home founder card says only "Matt works directly with service businesses…". Calculator not surfaced on the three pages.
9. **Unnecessary details that create objections.** Proof footnotes ("Captured local, page-one and AI-result visibility supports the story; it is point-in-time evidence, not a permanent ranking."), "Remote-first, Eastern Time" in the hero micro, "$110/hour in the applicable currency", currency/HST commentary, About chips "Recruiting" and "Professional services", "Not e-commerce, not apps."
10. **CTAs.** Primary label is consistent sitewide ("Get My Free Lead Leak Review", ~35 occurrences). Inconsistent: home secondary "See how it works" (anchor), About primary "Read what changed" (anchor) with the real CTA demoted to a text button, services "See What I Should Fix First", pricing plan links "Discuss Managed Website" etc. (go to `/contact`), PlansPreview and pricing buttons link to `/contact` while hero/sticky/nav open the modal (same label, two behaviours). `PlansPreview` secondary "Compare all plans".

## 3. Proposed before / after (draft, for your approval)

Limits: titles ≤ 60 chars including brand; meta descriptions ≤ ~155. Brand suffix via `withBrandSuffix`. No new claims, prices, results or founder facts beyond what you gave in the brief.

### Home `/`
| Item | Before | After |
|---|---|---|
| SEO title | "Service Business Websites, Local SEO & Lead Systems" (51, no brand) | "Contractor Websites & Local SEO \| ALL8 Webworks" (47) |
| Meta | "ALL8 helps U.S. and Canadian service businesses improve websites, local search, lead response, follow-up and tracking so more opportunities become customers." (157) | "ALL8 builds websites, local search visibility and follow-up systems for contractors, so you get more calls, more quote requests and fewer missed jobs." (~150) |
| Pill | "Lead Systems for Service Businesses" | "Websites, Google visibility & follow-up for contractors" |
| H1 | "Turn More Searches, Clicks & Calls Into Customers." | "More Calls. More Quote Requests. Fewer Jobs Slipping Through." |
| Support | "We find where opportunities are being lost — search, website, calls, follow-up or tracking — and fix the part costing you the most." + bold "Get found more often. Convert more visitors. Lose fewer leads. Follow up consistently." | "Websites, Google visibility, and follow-up systems built for contractors. We help you get found, turn visitors into real inquiries, and stay on top of opportunities before they disappear." |
| CTAs | Primary "Get My Free Lead Leak Review"; secondary "See how it works" (#system) | Primary per Q1; secondary "See Our Work" → `/work/service-business-growth-case-study` or `/work` |
| Micro | "Written findings · No required call · Remote-first, Eastern Time" | "Written findings · No required call" (keep ET in footer/contact) |
| Structure | Hero, proof strip, services, plans, system rail, case study, blog, why/founder, process, FAQ, final CTA | Hero → proof strip → problems (reuse `LeakSection`, trimmed to 4 contractor problems) → how ALL8 helps (services cards) → case study → why ALL8 (adds trades background) → plans preview → simple process → FAQ → final CTA. `SystemRail` stage explanation removed/merged (the four stages explained once, in the problems or services section). Blog resources retained; calculator link added under the missed-call problem. |
| Plans preview | footnote "U.S. prices are in USD. Canadian clients pay…" | removed; heading "Plans" kept; intro shortened |
| Process | "Find the Leak. Fix What Matters Most." | "How Getting Started Works" with 3 steps: Free review → Fix the priority → Keep it running |
| FAQ | 7 Q&As, FAQ 1 explains four stages | Keep; rewrite FAQ 1 in plain contractor wording (no stage lecture); add "How much does it cost?" → links `/pricing`; keep FAQPage JSON-LD synced (no rich-result promise) |
| Final CTA | "Find Out Where You're Losing the Work." | "Find Out Where You're Losing Jobs." (same review offer, plain wording) |

### Pricing `/pricing`
| Item | Before | After |
|---|---|---|
| Title | "Plans & Pricing \| ALL8 Webworks" | "Contractor Website & Lead System Pricing \| ALL8 Webworks" (56) |
| Meta | 192 chars: "Compare ALL8's Free Lead Leak Review, Tune-Up, Managed Website, Lead System, Growth System and Google Ads Management. Clear setup fees, monthly prices and minimum terms for service businesses." | "Contractor website and lead plans: Managed Website $299/mo, Lead System $995/mo, Growth System from $1,500/mo. Setup fees and minimum terms shown up front." (~150; amounts match `plans.ts`) |
| H1 | "Find the leak. Choose the right level of help." | "Website and Lead Plans for Contractors" |
| Intro | "Start with written findings, fix one priority in a Tune-Up, or connect your website, lead handling and growth in an ongoing plan. Setup fees and monthly fees are shown separately." | Keep, lightly shortened. **Currency box removed.** |
| Compare cards | "Capture / Connect / Improve" | "Choose this if…" lines (no new scope): Managed Website: "your site is outdated, slow or isn't bringing in quote requests"; Lead System: "calls, forms or quotes are going unanswered"; Growth System: "the basics are working and you want more services, areas or pages" |
| Additional work | standalone "Additional work is $110/hour in the applicable currency. Scope and cost are agreed before it begins." and FAQ "Additional work is $110/hour in the applicable currency. Scope and cost are discussed before that work starts." | one statement: "Additional work is quoted and approved before it begins." (FAQ keeps the Q, new answer; standalone strip removed) |
| FAQ | removes "What currency are the prices in?" | the rest kept; "Is the free review really no obligation?" clarifies free vs minimum terms |
| Plan cards | unchanged (prices, terms, inclusions untouched) | same data; free-review term "No commitment" retained (it is free) |
| JSON-LD | WebPage + BreadcrumbList | unchanged unless you want Offer data (not recommended; would need a currency, see Q2) |
| Final CTA | "Find out what to fix first." | unchanged label; one primary CTA |

### About `/about`
| Item | Before | After |
|---|---|---|
| Title | "About — Why We Stopped Leading With Websites \| ALL8 WEBWORKS" | "About ALL8 Webworks \| Websites Built for Contractors" (52) |
| Meta | "ALL8 WEBWORKS is an owner-led practice that finds where opportunities are lost between a search and a won job — and fixes the costliest part." | "Owner-led websites, local SEO and follow-up systems for contractors, built by someone with a background in the trades, heavy equipment and excavation." (~150; needs fact approval, Q3) |
| H1 | "We Stopped Leading With Websites." | "Built by Someone Who Understands the Work Behind the Website." |
| Sub | "Not because websites stopped mattering — but because the data kept showing us…" | Founder-first: the challenge of keeping equipment working, crews busy, estimates moving and customers coming in, and why ALL8 builds practical systems. Facts limited to the brief's list. |
| Sections | Shift story → founder → principles → who → facts → proof → final CTA | Hero → founder story (trades background) → short "What the case study taught us" (pivot story compressed to one paragraph + pull quote, "one of four stages") → principles (trimmed) → who we work with (trades chips only; drop "Recruiting", "Professional services", "Industrial services") → facts → proof (exact existing metrics only) → final CTA |
| Stage count | "one stage of five"; "the same five stages apply" | four, matching home |
| CTA | primary "Read what changed" (anchor) + "Get My Free Lead Leak Review" as text button | Primary review CTA as the dominant button; secondary "See Our Work" |
| JSON-LD | Person (name, jobTitle) + AboutPage + Breadcrumb | unchanged structure; AboutPage `name`/`description` follow new copy |

Case study: no copy edits planned. Its claims stay exactly "40 → 100 clicks per rolling 28 days (March–September 2026)" and "+76% YoY GBP website clicks".

## 4. Shared strings and components (blast radius)

| Item | Also used on | If changed |
|---|---|---|
| CTA label "Get My Free Lead Leak Review" (~35 places: `home.json` ×5, `services.json` ×9, `servicesPage.json`, `about.json`, `Navbar` ×2, `StickyCta`, `LeadModalProvider`, `ServiceHero`, `ServiceFinalCta`, blog/work/contact surfaces) | contact, services, work, service pages, blog | A relabel is site-wide plus analytics-label and form/modal copy checks. |
| `PlanCard`, `PlanPrice`, `data/plans.ts` | home, pricing, service pages (`ServicePricing.tsx`) | Adding a "choose this if" field touches all three; prices untouched. |
| `FinalCta`, `ProofCards`, `FounderSection`, `FAQBlock` | home, about, services, work, blog, hire-matt (ProofCards/Founder) | Prop changes only; copy stays per-page JSON. |
| "No long-term commitment · Clear recommendations · Fixed scope before work begins" micro line | `home.json:389`, `about.json:120`, `servicesPage.json:170`, `work/page.tsx:193`, `blog/page.tsx:84`, `blog/[slug]/page.tsx:144`; variants in `LeadModal.tsx:411`, `InlineLeadForm.tsx:293` (contact), `CallToAction.tsx` default | Reword to "Free review · No obligation" on the three in-scope pages; the others (work, blog, contact, modal, form) are out of the three-page scope; confirm in Q5. |
| `servicesPage.json:131` "No twelve-month commitment to get started." | /services only | Contradiction fix is one line but is a services-page edit. |
| `data/site.json` description, `organization.schema.json` description ("…service businesses across the United States and Canada…"), `layout.tsx` default title/description | every page | Org/site descriptions could say "contractors"; affects Organization JSON-LD and default OG/Twitter text. |
| `Footer.tsx` "Missed-Call Calculator" link | all pages | Unchanged. Contextual links added on home only. |
| Blog post titles (Sanity) | 11 of 13 posts exceed 60 chars with suffix (63–76) | Manual Sanity edits or SEO-title field, out of this PR. |
| Missed-call calculator copy/UI | `/tools/...`, services | Untouched. |

## 5. Verification of your live-site observations

| # | Observation | Result | Evidence |
|---|---|---|---|
| 1a | Currency commentary on pricing intro, home plans footnote, pricing FAQ | **True** | `pricing/page.tsx:100-104` (box), `:23-24` (FAQ), `PlansPreview.tsx:29-32` |
| 1b | "$110/hour in the applicable currency" appears twice on /pricing | **True** | `pricing/page.tsx:44` (FAQ "What if I need work beyond my plan?") and `:250-252` (strip). Only occurrences in the repo. |
| 2 | About says five stages; home says four; services says four | **Partly true** | About: `about.json:43`, `:81`. Home: `home.json:84`, FAQ 1. Services says **both** ("Five Steps Between a Search and a Customer", "Four Outcomes. One System."), so it is inconsistent itself. |
| 3 | About title/H1 "We Stopped Leading With Websites" + pivot story | **True** | `about.json:3` title, `:11-12` H1, `shift` section. Live title is 60 chars. |
| 4 | Services "No twelve-month commitment…" vs Managed Website 12-month min | **True** | `servicesPage.json:131` vs `plans.ts:79` ("12-month minimum"). |
| 5 | Org `#organization` referenced but no Organization node | **False in source; true on the live HTML I fetched** | Node is defined in `app/layout.tsx:76-87` (Organization from `organization.schema.json`, plus WebSite). Commit `d8084df` (today) changed it from a `next/script afterInteractive` tag to a plain server `<script id="jsonld">`. The live HTML I fetched still carried it only inside the RSC payload (no real `<script type="application/ld+json">` with Organization, only the FAQ one), so it was invisible to a crawler. It should appear once the current `main` is deployed; recheck after deploy. |
| 6a | Home `<title>` has no brand | **True** | `page.tsx` passes `buildPageMetadata` a plain title; only some pages use `withBrandSuffix`. |
| 6b | Pricing meta ≈192 chars | **True** | 192 in source (197 as encoded in live HTML). |
| 6c | Some blog titles >60 chars | **True** | 11 of 13 live posts at 63–76 chars incl. suffix (e.g. 76: "How to Get Your Business Recommended by ChatGPT (Case Study) \| ALL8 Webworks"). Titles live in Sanity. |
| 6d | Most pages share one OG image | **True** | Every fetched page except `/contact` uses `og-default.jpg`; home passes `site.defaultOgImage` explicitly. |
| 7 | 40→100 / +76% / Page One proof block repeats on 5 pages with heavy disclaimers | **Mostly true** | Proof tokens hydrate in `home.json`, `about.json`, `servicesPage.json`, `hire-matt.json`, plus the case study/work pages. On the home page the visible blocks are the proof strip + case study (the `proofCards` block is not rendered). |
| 8a | Home ≈5,500 words | **False** | Live home HTML visible text ≈1,700 words including nav/footer; `home.json` ≈1,600–2,100 words. (Counted by stripping scripts/styles from fetched HTML.) |
| 8b | Calculator linked only from the footer | **Mostly true** | Footer (`Footer.tsx:26`). Also `/tools`, a resources card on some service pages (`ServiceResources.tsx:39`), and the sitemap. Not in nav, home, pricing or about. |

## 6. Open questions for you

1. **RESOLVED: keep "Get My Free Lead Leak Review"** (decided by Matt). Explain the deliverable in plain words near the button instead of relabelling. Original question: **CTA name.** The brief suggests "Get My Free Website & Lead Review". `AGENTS.md` says "Free Lead Leak Review" is the approved offer name and lists older labels (including "Free Review", "Lead Review") as non-offers. Options: (a) keep "Get My Free Lead Leak Review" and explain the deliverable in plain words beneath it (my recommendation: avoids a ~35-place relabel and analytics/modal/form drift); (b) rename sitewide to the brief's label; (c) rename only on the three pages (not recommended: inconsistent with nav/modal).
2. **Currency and the $110/hour rate.** `AGENTS.md` says to make currency clear on public pricing and lists $110/hour as approved. The brief overrides that for public copy. Confirm I may update `AGENTS.md`, and where currency/HST is disclosed instead (quote, agreement, invoice, contact form?). For a U.S. visitor, prices will show a bare "$". Do you want a one-line "CAD + HST for Canadian clients" in the agreement text only?
3. **Founder facts.** The brief's list (licensed automotive service technician 310S; heavy equipment maintenance/repair; excavation and construction operations; estimating and bids; contractor websites and marketing; business development; software/automation) is not in the repo. Please confirm exact wording, whether "licensed" can be stated publicly, and whether "excavation and construction operations" means employment or ownership (I will not imply ownership).
4. **Leaky terms.** Keep "Lead Leak" only in the review's name, and drop "lead path", "lead system" from headlines? "Lead System" stays as the plan name.
5. **Commitment micro-line scope.** Change "No long-term commitment" on the three pages only, or also on work/blog/services/modal/contact? (Modal and form are tracked flows; I would leave them.)
6. **Stage count.** Four stages everywhere. The services page "Five Steps" journey: leave (not in scope) or flag for a later PR?
7. **About trimming.** OK to drop "Recruiting", "Professional services", "Industrial services" chips and the "Not e-commerce, not apps." line, and compress the pivot story to one paragraph?
8. **Home title/SEO.** OK with "Contractor Websites & Local SEO | ALL8 Webworks" (service-business keywords move into body/FAQ)? Should the org/site descriptions in `site.json` and `organization.schema.json` also say "contractors"?
9. **Secondary CTA target** "See Our Work": `/work` or the case study directly?
10. **Deploy check.** Confirm the live site is behind current `main` (affects the Organization JSON-LD finding).

## 7. Proposed commit order (feat/contractor-positioning-copy)

1. `docs: add contractor positioning plan` (this file, optionally the brief)
2. `copy: remove currency commentary and hourly rate from pricing` (pricing page, PlansPreview footnote, FAQ)
3. `copy: pricing page headline, plan fit lines, metadata`
4. `copy: homepage hero, metadata and CTAs`
5. `copy: homepage structure (problems section, merge stage explanation, calculator link, FAQ, process)`
6. `copy: about page retargeted to contractors with founder story`
7. `copy: align stage count and commitment wording across the three pages` (plus any approved shared-string changes)
8. `chore: seo and link checks fixes` after `npm run lint`, `npx tsc --noEmit`, `npm run build`, SEO smoke test (title/description/canonical/JSON-LD of `/`, `/pricing`, `/about`), internal-link scan, mobile (390px) and desktop pass in the preview.

Deliverables after implementation: draft PR (no merge/deploy), before/after summary, final titles/descriptions, manual Sanity edits list (blog SEO titles), unresolved questions, test results, follow-ups for `/industries/[slug]` (excavation, plumbing first).
