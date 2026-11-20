# ALL8 performance, discovery and page SEO audit

November 20, 2026. Production was sampled with public GET requests. Before/after performance comparisons use local production Webpack builds from merged main `974eebd` and this branch. This audit uses the sitemap as an inventory. The previous [technical SEO audit](technical-seo-indexing-audit.md) covers canonicalization and the domain move.

## What changed

- **Defer reCAPTCHA until a form is opened or focused.** The closed site-wide review modal previously started it on mount. The contact form and newsletter also started it on mount. Visitors who never use a form now avoid it on the tested routes. On submit, the shared loader still waits for readiness, gets a fresh token for the correct action, and blocks dispatch if verification fails. Server validation, anti-spam checks and capture-gated conversion events are unchanged. The first form interaction can now incur the script fetch. Check real token latency, rejection rates and form completion after an approved deployment.
- **Stop downloading the mobile-hidden homepage illustration.** Below 640px, the picture selects an inline placeholder. At wider viewports it retains high fetch priority and declares widths that match the displayed illustration. Width and height remain explicit. The mobile baseline downloaded about 157 KiB for the hidden illustration. The checkout's blog cover images already reserve space and are high priority, so their loading policy remains in place.
- **Render static page sections on the server.** The home hero, services hub hero, service-detail hero and shared final CTA now render their text, links and icons on the server. The review button remains a client component using the existing modal provider and analytics. Existing reveal wrappers, filter interactions and modal animation are retained. First-party script transfer fell about 2–5 KiB per tested route.
- **Read HubSpot attribution at submission.** The tracker already waits three seconds after hydration. The lab saw one attempted request with no completed transfer, so it cannot quantify HubSpot cost or justify a scheduling change. The load schedule and GTM remain intact. All three forms now read the current `hubspotutk` cookie immediately before passing form data to the existing CAPTCHA-protected action. Existing page context and UTM handling remain in place.
- **Improve discovery and heading structure.** Two relevant Google Maps articles now link to the service-business growth case study from the related-services section. The blog index now labels the archive cards “Browse articles” at H2, and topic buttons expose their selected state to assistive technology.

## Performance comparison

[All 20 Lighthouse samples](performance/lighthouse-samples.csv) use Lighthouse 13.0.3 and Chrome 157, default mobile simulation at 412 × 823, with a fresh browser navigation for each run. The loopback build used the configured Sanity content and blocked analytics collection endpoints. Values below compare run 2 in each build, when the relevant optimized image variants had already been requested. Run 1 on the baseline took about 8.0 s for the blog and 7.6 s for the article. Each cover took about 480 ms to load in the unthrottled trace before the simulator applied mobile conditions. The second image requests took about 16 ms. The candidate reused the image cache, so the first-run gap is not evidence of a cold-cache improvement.

| Route | Lighthouse score | LCP, seconds | TBT, ms | Wire transfer, KiB | First-party JS, KiB |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 85 → 90 | 4.22 → 3.28 | 104 → 178 | 1,015.1 → 434.3 | 249.7 → 247.6 |
| Pricing | 92 → 96 | 3.31 → 2.76 | 98 → 69 | 848.2 → 422.3 | 252.4 → 250.3 |
| Lead Generation Websites | 92 → 92 | 3.31 → 3.31 | 108 → 72 | 882.3 → 455.6 | 261.6 → 256.5 |
| Blog | 90 → 90 | 3.59 → 3.59 | 50 → 36 | 1,041.3 → 614.2 | 263.8 → 259.4 |
| Lead response article | 92 → 92 | 3.39 → 3.38 | 59 → 35 | 920.6 → 493.5 | 267.1 → 262.7 |

The reCAPTCHA script requests transferred about 391 KiB and their Google-hosted font added about 34 KiB per baseline navigation. Neither was requested in the candidate no-interaction samples. Home TBT varied across the samples and got worse in run 2, so these results do not establish a consistent homepage CPU gain. Lab CLS was 0 throughout. Lighthouse accessibility stayed at 96 and SEO stayed at 100 on all five routes. The outstanding accessibility issue in these runs was color contrast.

PageSpeed Insights returned HTTP 429 for all five requested URLs. Field LCP, CLS and INP are unavailable in this audit. Lighthouse TBT is a lab measure and is not field INP. Use the linked samples for controlled comparisons and request CrUX or Search Console field measurements after rollout. [PageSpeed lab and field data](https://developers.google.com/speed/docs/insights/v5/about)

## Production payload and asset checks

| Public route | Compressed HTML | HTML caching observed |
| --- | ---: | --- |
| Home | 32.8 KiB | Cloudflare DYNAMIC and Next one-hour shared cache |
| Pricing | 20.3 KiB | Cloudflare DYNAMIC and static Next response |
| Lead Generation Websites | 25.2 KiB | Cloudflare DYNAMIC and Next one-day shared cache |
| Blog | 25.2 KiB | Cloudflare DYNAMIC and Next one-hour shared cache |
| Lead response article | 40.0 KiB | Cloudflare DYNAMIC and Next one-hour shared cache |

The targeted asset pass found 200s for all 22 referenced first-party JS resources, all three CSS resources, 16 sampled mobile-width images and five deployed WOFF2 sources extracted from public CSS. The CSS/JS samples were served with immutable cache headers. Sampled `/_next/image` responses advertised a 30-day max age but returned Cloudflare DYNAMIC at the edge. Chrome showed the featured and article covers as the respective LCP elements. Those pages are the best candidates for a follow-up cold-origin and CDN image test if field LCP remains poor.

The lab loaded about 79 KiB of stylesheets per route, including the shared CSS needed for initial layout and a smaller decorative stylesheet loaded after hydration. It did not flag an unused CSS opportunity. Next's shared runtime and UI chunks were the largest remaining first-party JS, with unused JS reported on initial navigation. The form and responsive-image fixes were larger and easier to verify than a shared provider refactor. No cache policy, font files, global animation timing or third-party tracker schedule was changed.

## Discovery and link graph

The [full 37-node HTML graph](performance/internal-link-graph.json) records links and click depth with the global navigation/footer included. It also records main-only links, depth, incoming sources, and each article's observed service/case-study destinations. It captures the candidate production build. Links to fragments, the same page, and URLs outside the sitemap inventory are excluded from graph edges.

- In production, 19 URLs were one click from home, 15 were two clicks away and two category archives were three clicks away. No sitemap page was an orphan. Every service detail had 36 linking pages overall because of the shared footer and at least five contextual sources. The least-supported service detail was Website Care & Optimization, which already gets contextual support from the “Building a Website Is Easy. Running One Is Not” and “High-Performance Contractor Website” articles.
- The featured “Contractor Lead System” article had one contextual source despite being two clicks from home. The “V8 Engine” article had two. The SEO archive had one incoming link and the Local SEO archive had two. Add links from relevant commercial or editorial pages if those topics remain high priority. Adding links site-wide would obscure the contextual signal.
- The case study went from five to seven main-content sources. The new sources are the contractor Google Maps guide and the article about missing Google Maps visibility. They connect an acquisition problem to the existing Search and Google Business Profile proof. The lead response guide continues to link to call handling, pipeline and lead tracking resources. Its topic does not justify presenting the acquisition case study as proof of follow-up performance.
- All 37 sampled live and candidate pages had one visible-content H1. Titles and descriptions were unique in production. The candidate graph contains the new proof links in raw HTML and keeps all 37 paths reachable. The existing SEO smoke check covers indexability and status regressions without reopening the canonical or sitemap audit.

Recreate the graph from a production build with `node scripts/audit-discovery.mjs http://127.0.0.1:3000`. Use the origin argument for a read-only public snapshot. Rerun the mobile lab with Lighthouse 13.0.3 against the same five routes, using the same throttle, Chrome version and image cache conditions if comparing timing.

## Page-level recommendations

| Page | Evidence and recommended follow-up |
| --- | --- |
| Home | The H1 communicates the result, the title names websites, local SEO and lead systems, and the main content already links to all nine services. Keep these roles distinct. If the page is shortened later, preserve the early services and case-study links. Contrast findings are a stronger reason to review supporting text than changing keywords. |
| Pricing | The title and description clearly identify plans and pricing. The H1 “Find the leak. Choose the right level of help.” is less explicit when scanned on its own. Consider a descriptive H1 for plans and pricing with the current slogan below it. Keep the page focused on fees, terms and fit. |
| Lead Generation Websites | “Lead Generation Websites for Service Businesses” and the subsequent problem and scope sections give the page its own commercial intent. Keep detailed conversion checklists in the trades service-page guide. The capability, its estimate/contact outcomes, and the path to a plan belong here. |
| Blog index | The metadata describes the topic range. The H1 “Writing About Where the Work Goes Missing.” is editorial and does not name the guides. Consider a descriptive H1 or a clearer visible supporting line. This PR fixes the article grid hierarchy while retaining the current editorial copy and cards. |
| Lead response article | The title, H1, breadcrumb and first sections agree on response time, while the article explains acknowledgment, a human reply and an estimate separately. Preserve that intent and the specific cover alt. Keep example workflows separate from the broader contractor lead-management article. |
| Cover alt text | None of the 22 priority content images lacked an alt attribute. The article has an empty author-avatar alt beside the written author name. The “Good Contractors Still Lose Work” cover alt includes export instructions and editorial notes, which were also rendered on cards. Replace those notes in Sanity with a short description of the visible scene after editorial approval. |
| Overlap to watch | The Google Maps guide teaches ranking steps, the Maps troubleshooting article diagnoses visibility loss, and Local SEO & Google Business Profile sells help. Keep those three roles. The high-performance contractor website guide overlaps with the V8 and ongoing-care articles. Distinguish build specifications, performance diagnostics and maintenance responsibilities in future edits. Search Console query-level cannibalization was unverified. |

## Validation and rollout

Local checks covered lint, typecheck, 140 unit, integration and monitoring tests, a production build and before/after lab runs. The form regressions cover deferred initialization, keyboard dismissal, attribution set after mount, fresh action-specific tokens, token failure, retries, the honeypot and capture-only conversions. Chrome selected the inline hero source at 390 px and decoded the optimized desktop image at 1280 px. The modal focused the name field, restored focus to the trigger on Escape and only requested CAPTCHA after opening. The blog topic button updated its selected state. The SEO smoke passed for all 37 sitemap paths. Third-party field behavior and production speed remain unverified until a deployment is approved.
