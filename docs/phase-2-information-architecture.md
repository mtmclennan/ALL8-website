# Phase 2 Information Architecture Audit

## Repository findings

- Phase 1 canonical, redirect, robots, sitemap, metadata, proof, and `/hire-matt` separation remain intact.
- The `/services` page already used the four-stage lead journey. Rebuilding it would have duplicated working architecture, so Phase 2 clarifies labels, destinations, and service relationships instead.
- The homepage linked to service pages and conversion actions but had no editorial links. Its proof block also had no path to a proof index because `/work` did not exist.
- The case study linked to contact, but `/work/service-business-growth-case-study` was an orphaned child route with no parent index.
- Blog posts already receive code-controlled related services, related articles, canonicalized body links, and a lead-review CTA.

## Content ownership

| Area                                                       | Source                                               |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| Homepage, services, about, contact, proof copy             | Repository JSON/TypeScript                           |
| Service inventory, pricing, FAQs, cross-links              | `data/services.json`                                 |
| Navigation and footer destinations                         | Repository TypeScript                                |
| Work index and case-study presentation                     | Repository TypeScript                                |
| Blog posts, excerpts, categories, tags, images, body links | Sanity                                               |
| Blog hero fields and legacy meta fields                    | Sanity, with search-intent metadata enforced in code |
| Related blog posts                                         | Sanity references plus code fallback logic           |
| Related commercial services                                | Repository keyword and slug rules                    |

## Internal-link model

The primary paths after Phase 2 are:

1. Home → service stage → service detail → proof/case study → Lead System Review
2. Home → Work → case study → Lead System Review
3. Home → strategic article → related service → proof/case study
4. Blog → article → related services and articles → Lead System Review

Important pages are linked from the primary navigation or one contextual click from the homepage. `/hire-matt` remains outside these customer paths.

## Service journey mapping

| Service                              | Lead-journey stages                            |
| ------------------------------------ | ---------------------------------------------- |
| Lead Generation Websites             | Get Found; Get Contacted                       |
| Local SEO & Google Business Profile  | Get Found                                      |
| Google Ads & Lead Generation         | Get Found; Get Contacted                       |
| Missed-Call Recovery & Call Handling | Get Contacted; Respond & Follow Up             |
| Lead Follow-Up Automation            | Respond & Follow Up; Win More Work             |
| CRM & Sales Pipeline Setup           | Respond & Follow Up; Win More Work             |
| Call Tracking & Lead Attribution     | Get Found; Get Contacted; Win More Work        |
| Website Care & Optimization          | Supports Get Contacted for outside-built sites |
| Custom Lead Systems                  | Connects all four stages                       |

The primary group on `/services` remains unchanged. Multi-stage badges make overlap explicit without duplicating or renaming services.

## Service capability anchor audit

### Wording corrections

| Previous anchor                   | Previous target                     | Classification                  | Resolution                                                                                                                                            |
| --------------------------------- | ----------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI & generative search visibility | Local SEO & Google Business Profile | B — wording problem             | Changed to “Local search & AI visibility foundations.” The destination supports the foundation without implying a separate AI-search product.         |
| Technical SEO                     | Lead Generation Websites            | B — wording/destination problem | Changed to “Technical local SEO” and linked to Local SEO & Google Business Profile, where indexing, metadata, and structured-data work are described. |
| Service & location pages          | Lead Generation Websites            | B — wording problem             | Changed to “Lead-generation service pages.” This removes an implied location-page program while accurately describing the website offer.              |
| Search performance                | Local SEO & Google Business Profile | B — wording problem             | Changed to “Organic search reporting,” matching the Search Console and measurement content on the destination.                                        |

### Correct capability groups

- Local SEO, Google Business Profile, local/AI visibility foundations, technical local SEO, and organic search reporting → Local SEO & Google Business Profile.
- Lead-generation service pages, conversion-focused websites, landing pages, and quote/contact forms → Lead Generation Websites.
- Google Ads → Google Ads & Lead Generation.
- Business phone/VoIP, missed-call text-back, and lead intake/answering → Missed-Call Recovery & Call Handling.
- Email/SMS follow-up, lead notifications, and estimate/appointment workflows → Lead Follow-Up Automation.
- CRM setup, sales pipeline setup, lead routing, and pipeline visibility → CRM & Sales Pipeline Setup.
- Analytics, conversion/call/form attribution, lead-source tracking, and reporting → Call Tracking & Lead Attribution.
- Tool integrations → Custom Lead Systems.

### Supporting content and future offers

- C — missing supporting content: the published blog has no focused missed-call or follow-up guide. Phase 2 does not invent one.
- D — potential future service: AI-search visibility and broad technical SEO may become clearer offers later, but current evidence supports them only as capabilities within existing services. No thin service page should be created yet.

## Blog taxonomy audit

The published dataset currently has 11 posts assigned across 10 categories:

| Current category        | Published posts | Assessment                                                      |
| ----------------------- | --------------: | --------------------------------------------------------------- |
| AI SEO                  |               1 | Thin; useful as a later Search Visibility subtopic              |
| Conversion Optimization |               1 | Thin; overlaps Websites & Conversion                            |
| Digital Marketing       |               4 | Broad umbrella; does not describe a specific reader need        |
| Digital Strategy        |               1 | Thin; overlaps Lead Systems & Operations                        |
| Local SEO               |               4 | Useful, specific search-intent category                         |
| SEO                     |               4 | Overlaps Local SEO for the current article set                  |
| Small Business Insights |               1 | Thin and broad                                                  |
| Systems & Operations    |               1 | Useful direction but currently thin                             |
| Web Development         |               1 | Thin; overlaps website operations/performance                   |
| Web Performance         |               4 | Useful but overlaps Conversion Optimization and Web Development |

The blog index now presents the smallest useful visitor-facing topic set without mutating Sanity:

1. Search Visibility
2. Websites & Conversion
3. Lead Systems & Operations

“Ai SEO” is normalized to “AI SEO” at render time while preserving `/blog/category/ai-seo`.

### Recommended Sanity migration

- Consolidate Local SEO, SEO, and AI SEO into Search Visibility.
- Consolidate Web Performance, Web Development, and Conversion Optimization into Websites & Conversion.
- Consolidate Systems & Operations, Digital Strategy, and Small Business Insights into Lead Systems & Operations.
- Reassign Digital Marketing posts to their most specific topic instead of retaining an umbrella category.
- Before changing any category slug, add permanent redirects from every retired archive URL and verify category metadata and sitemap eligibility.

The migration is deferred because it requires coordinated external Sanity mutations and redirect decisions. Existing thin archives remain `noindex,follow`; existing URLs are preserved.

## Deferred Phase 3 content

- A focused missed-call recovery guide
- A lead-response and follow-up guide
- A carefully scoped AI visibility guide or service-positioning decision
- Pricing, comparison, assessment, calculator, newsletter-funnel, lead-magnet, and location-page expansion
