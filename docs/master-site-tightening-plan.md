# ALL8 Webworks Master Site Tightening Tracker

Baseline captured on 2026-08-28 from branch `redesign/homepage` before this implementation pass.

Status values: `CONFIRMED`, `ALREADY FIXED`, `NOT APPLICABLE`, `NEEDS USER INPUT`, `IMPLEMENTED`.

| Phase | Issue | Current state at baseline | Action | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| 0 | Baseline validation | TypeScript and ESLint pass; production build passes with network access; no test suite exists | Preserve results and repeat after material changes | CONFIRMED | ESLint reports 16 warnings, 0 errors |
| 0 | Existing worktree | Large redesign diff and untracked Hire Matt files already exist | Preserve current work and keep new changes focused | CONFIRMED | Do not reset or discard prior work |
| 1 | Primary domain | Local canonical resolves to `.com`; `.com` production currently redirects to the old `.ca` site | Make `.com` the code default and document host-level route-preserving `.ca` redirect | NEEDS USER INPUT | DNS/hosting redirect cannot be completed in repository alone |
| 1 | `.ca` fallbacks | `siteUrl()` falls back to `.ca` and static helpers contain `.ca` fallback URLs | Change defaults to `.com`; keep `.ca` only as legacy-domain documentation | CONFIRMED | Avoid duplicate canonical domains |
| 2 | Public-site SSR | Entire provider boundary is dynamically imported with `ssr: false`; initial HTML lacks page H1/content | Restore SSR provider boundary and SSR navigation/footer | CONFIRMED | Highest-priority technical SEO fix |
| 3 | Public phone | `321-987-4567` is consistently sourced from config but cannot be independently verified | Keep unchanged and flag confirmation | NEEDS USER INPUT | If intentional U.S. line, label it transparently where useful |
| 3 | Contact consistency | Navbar, footer, SMS and contact page use the same configured phone/email | Preserve centralized configuration | ALREADY FIXED | Schema still needs telephone/email synchronization |
| 4 | Currency | All public service pricing is USD or custom quote | Preserve amounts; verify schema matches | ALREADY FIXED | No mechanical FX conversion needed |
| 4 | Subscription pricing | Lead Generation Websites is `$1,500 setup + $299/mo`; Website Care is correctly limited to outside-built sites | Preserve terms and improve structured representation of setup + monthly charges | ALREADY FIXED | Do not reintroduce one-time website tiers |
| 5 | Ownership/retainer language | Homepage says no retainer is required while website service is a cancellable subscription | Qualify the statement so it does not contradict subscription terms | CONFIRMED | Trust/correctness issue |
| 6 | Old positioning defaults | Root/site metadata, logo alt text and category fallback CTAs remain website-first | Rewrite only global defaults and stale fallbacks | CONFIRMED | Strong page-level positioning should remain |
| 7 | Homepage deep links | Outcome cards mostly point to `/services` | Link each outcome to the most relevant service destinations | CONFIRMED | Preserve approved layout |
| 8 | Service architecture | Services are already organized around lead-journey outcomes | Preserve architecture | ALREADY FIXED | Nine distinct service intents are present |
| 9 | Repeated proof | One SEO/GBP proof block is rendered on every service page | Use relevant proof only on Local SEO/website pages; use measurement framing elsewhere | CONFIRMED | Do not imply SEO results prove CRM/Ads/missed-call work |
| 10 | Search growth metric | Hire Matt still headlines `80 clicks / 5,324 impressions` | Replace with documented `40 -> 90+ clicks per rolling 28 days` | CONFIRMED | Do not claim 100; current evidence says 92/100 progress |
| 11 | Proof hierarchy | `+76%`, page-one and local visibility are useful; raw totals are over-promoted | Centralize approved language and use contextual disclaimers | CONFIRMED | AI visibility stays supporting only |
| 12 | Ranking claims | `#1 Local` appears as a generic permanent-looking badge | Replace with captured/point-in-time wording | CONFIRMED | No guaranteed/permanent language |
| 13 | Client privacy | Hire Matt publicly names Bellhouse and attaches the missed-call rate | Anonymize public copy and remove exact sensitive operational percentage | CONFIRMED | Naming permission has not been confirmed |
| 14 | Real case study | No dedicated case-study route exists; Hire Matt button points to `#contact` | Create `/work/service-business-growth-case-study` with evidence-backed anonymized content | CONFIRMED | Add metadata, schema, sitemap and links |
| 15 | Ooma/Zapier/Estivor | Workflow story exists only as broad claims; live/tested/planned states are not documented | Publish only supplied safe system evolution and mark capability status conservatively | NEEDS USER INPUT | Exact production-state classification needs Matt confirmation |
| 16 | Estivor employer evidence | Estivor is described but not linked or evidenced | Add honest project card fields and route-safe evidence language | CONFIRMED | Do not expose private code |
| 17 | Future baseline | No public baseline framework for downstream lead handling exists | Document measurement plan without claiming results | CONFIRMED | Exact missed-call rate remains private/careful |
| 18 | Hire Matt role classification | Page lists ten equal roles and primary role family is not explicit enough | Add `Web Developer - Growth Engineer` context and reduce equal-weight roles | CONFIRMED | Required H1 remains unchanged |
| 19 | Hire Matt length | Mobile page is about 19k-21k px tall with repetitive capability sections | Reorder and consolidate sections | CONFIRMED | Target substantial reduction, not redesign |
| 20 | Hire Matt metric cards | Weak raw Search Console metrics and exact missed-call rate are headline cards | Replace with 40->90+, +76%, and Search->Operations | CONFIRMED | Use private bottleneck wording |
| 21 | Resume | “Download Resume” is a `mailto:` link; no PDF is present | Rename to “Request Resume” and flag PDF requirement | NEEDS USER INPUT | Recommended future path `/matt-mclennan-resume.pdf` |
| 22 | Technical evidence | Projects have no screenshots, demos, repositories or detailed stack/role evidence | Improve cards using only verified repository/project facts; flag missing assets/links | NEEDS USER INPUT | GitHub URL and safe project evidence required |
| 23 | Employer chrome | Hire Matt inherits Lead Review navigation/footer/modal | Add a route-aware employer header/footer mode and suppress customer sticky CTA/modal triggers on Hire Matt | CONFIRMED | Keep Hire Matt out of commercial navigation |
| 24 | Hire Matt SEO | Existing ProfilePage/Person schema is useful but title and OG asset are not employer-specific enough | Update title/description/schema; add image/url; retain H1 | CONFIRMED | Dedicated 1200x630 asset needs creation/supply |
| 25 | Internal links | Blog->service exists; service->blog does not; Hire Matt lacks real evidence links | Add intentional bidirectional contextual links | CONFIRMED | Do not link every post to Hire Matt |
| 26 | Blog pillars | Ten category archives cover eleven posts, including several one-post archives | Document five-pillar target and prevent thin categories from being promoted | CONFIRMED | Sanity content migration requires editorial work |
| 27 | Cannibalization | Several website/performance posts overlap; no performance data was supplied | Document decisions and avoid blind redirects | NEEDS USER INPUT | Search Console URL data required before consolidation |
| 28 | New articles | Six lead-system topics are missing | Create briefs only, do not publish | CONFIRMED | Stored in documentation |
| 29 | Links | Resume and case-study actions are fake; legacy service links redirect correctly | Replace fake actions and crawl all resulting links | CONFIRMED | Social destinations resolve; LinkedIn uses auth wall when logged out |
| 30 | Metadata | Major static pages are mostly distinct; blog CMS metadata and root defaults are stale | Tighten defaults, Hire Matt, case study, blog/category fallbacks | CONFIRMED | Preserve existing article canonicals/slugs |
| 31 | Structured data | Domain is local `.com`; Organization language/contact and subscription offer need tightening | Update Organization/WebSite/Service/Person/Article-related fields without fake ratings | CONFIRMED | Keep FAQ and Breadcrumb graphs |
| 32 | Sitemap | Services use `new Date()` on every request; Hire Matt is included | Use stable file/build dates; add case study; review category inclusion | CONFIRMED | Real CMS dates already used for posts/categories |
| 33 | GTM | GTM code is safe but configured ID is a placeholder, so no container loads | Preserve safe disable behavior and document required real ID | NEEDS USER INPUT | Do not ship `GTM-XXXXX` as if active |
| 34 | Event model | Generic CTA/email events exist; employer-specific events do not | Add distinct customer and employer event names | CONFIRMED | Clicks are not completed leads |
| 35 | HubSpot/env | Layout reads server-only `HS_PORTAL_ID`; prior public/private mismatch is fixed | Update `.env.example` and environment documentation | ALREADY FIXED | Never expose tokens/client secrets publicly |
| 36 | Privacy/consent | Code grants analytics consent by default; privacy copy says aggregate analytics; no functional consent banner is present | Align code and policy truthfully; do not claim a banner | CONFIRMED | U.S.-first baseline can load analytics; disclose clearly |
| 37 | Lead durability | Success is returned after primary email submission, while secondary CRM/Sheets tasks run asynchronously | Verify primary durable capture and make secondary failures observable/retryable where practical | CONFIRMED | Do not block response on every integration |
| 38 | Lead form | Required identity/contact fields, CAPTCHA, UTMs and challenge selection exist | Align challenge labels/options and validate schema/tests | CONFIRMED | Production submission requires credentials/domain |
| 39 | Mobile | No persistent overflow at 360/390/430; Hire Matt is too long and contact CTA can fall below fold | Re-test after changes and ensure 44px targets/safe-area behavior | CONFIRMED | Preserve approved responsive design |
| 40 | Accessibility | Duplicate H1 exists in one article; client-only rendering and some generic link labels hurt semantics | Fix code-controlled issues and document CMS content issue | CONFIRMED | Modal already supports Escape/focus behavior |
| 41 | Performance | Entire-site hydration, client-only nav/footer and raw blog images add cost | Restore SSR and use Next Image for portable images where safe | CONFIRMED | Keep reduced-motion support |
| 42 | Technical quality | Typecheck/lint/build pass; no tests | Add focused tests for critical pure helpers/validation where feasible | CONFIRMED | Avoid snapshot spam |
| 43 | Project instructions | Existing AGENTS file covers business/pricing but not new proof/Hire Matt rules | Add the supplied durable rules | CONFIRMED | Preserve existing instructions |
| 44 | SEO intent map | No complete current map exists | Create `docs/seo-intent-map.md` | CONFIRMED | Include audience, CTA, links and cannibalization |
| 45 | Proof inventory | No centralized evidence policy exists | Create `docs/proof-inventory.md` | CONFIRMED | Include source/date/use/status |
| 46 | Final validation | Required final checks not yet run | Repeat typecheck/lint/build/crawl/mobile/schema/link checks | CONFIRMED | Forms/analytics require production credentials for end-to-end confirmation |

## Final implementation outcome

Implemented in the repository:

- `.com` canonical defaults, path/query-preserving `.ca` 308 proxy, and `.com` metadata/schema fallbacks.
- Server-rendered provider, navigation and footer boundaries; raw HTML now contains primary content and crawlable links.
- Outcome-first global copy, corrected ownership language, USD/subscription Offer schema, synchronized Organization/WebSite details, and stable sitemap dates.
- Homepage deep service links, contextual service proof, service-to-article resources, thin-category handling, blog metadata/H1/image fixes, and an anonymized case-study route.
- Hire Matt employer chrome, shorter employer-first hierarchy, preserved H1, Web Developer / Growth Engineer classification, dedicated OG image, public-safe proof, working case-study/project links, `Request Resume` state, and distinct employer analytics.
- Primary lead notification awaited before success; secondary HubSpot/Sheets/CRM enrichment remains non-blocking and logged. Lead-review options and events are aligned.
- Proof inventory, SEO intent map, ten content briefs, launch runbook, environment template, tests and a reusable local crawler.

Final validation on 2026-08-28:

- `npx tsc --noEmit`: pass.
- `npx eslint .`: pass with 0 errors and the same 16 integration/logging warnings present at baseline.
- `npm test`: 5/5 pass, including the production-configured missing-CAPTCHA-token regression check.
- `npm run build`: pass; 50 routes generated.
- Local crawl: 34 routes, 0 broken internal links, 0 invalid H1 counts, 0 invalid canonicals, 0 malformed JSON-LD blocks.
- Raw-HTML checks: homepage, services, about, Hire Matt and case study each expose one H1 and crawlable links.
- Responsive checks: `/hire-matt` at 360, 390 and 430 px has no horizontal overflow; mobile height reduced to about 15,875 px and the employer contact target is 44 px high.
- Legacy-domain check: `.ca` host request returns a one-hop 308 to the matching `.com` path and query.

Repository work is implemented. Launch remains dependent on the user-supplied production items below and production credential testing.

## User-supplied items still required

- Confirm that `321-987-4567` is the intended public U.S. line.
- Supply a real GTM container ID.
- Supply `matt-mclennan-resume.pdf`.
- Confirm whether the client may ever be publicly named.
- Confirm exact `LIVE`, `TESTED`, `IN VALIDATION`, or `PLANNED` states for Ooma -> Zapier -> Estivor capabilities.
- Supply a verified personal GitHub URL and any safe demo/repository/project screenshots.
- Complete the host/DNS configuration that redirects every `.ca` path to its `.com` equivalent.
