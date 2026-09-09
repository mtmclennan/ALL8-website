# Homepage and Hire Matt visual refinement

Scope: the existing homepage and `/hire-matt`, finalized September 9, 2026. The pass preserved page order, business and employer positioning, approved assets, URLs, and the existing font implementation. Pre-existing domain, deployment, analytics-infrastructure, project-link, and unrelated user changes remain outside the refinement commit.

## Final design verdict

| Page | Before | After | Verdict |
| --- | ---: | ---: | --- |
| Homepage | 8.0/10 | 8.7/10 | The same conversion architecture now has a calmer first viewport, stronger proof hierarchy, more readable supporting copy, and more deliberate tablet/mobile behavior. |
| Hire Matt | 7.8/10 | 8.7/10 | Role classification remains immediate while the portrait, measured proof, systems evidence, project cards, and final contact actions now have clearer relative emphasis. |

The remaining difference from a perfect score is primarily the pages' necessary content density, not a material visual or usability defect. No further cosmetic round is recommended.

## High-impact changes

- Moved the commercial header to its compact navigation below 1100px so the phone, navigation, and CTA do not crowd at 1024px.
- Reduced homepage desktop headline scale and tightened the mobile hero so its primary CTA stays comfortably in the first viewport.
- Made reveal-wrapped content visible in initial HTML and removed entrance delays; motion is short and reduced-motion preferences are respected.
- Rebuilt the Hire Matt proof layout around three intentional cards: three columns on desktop, two plus a full-width systems card on tablet, and one column on mobile.
- Kept measured acquisition results visually dominant while reducing `Search → Operations` to supporting systems evidence.
- Capped the employer portrait at 360px desktop, 320px tablet, and 288px mobile.
- Improved muted-text contrast, primary-button contrast, focus visibility, mobile card padding, and final contact hierarchy.
- Changed homepage FAQ items to H3 headings and reduced mobile proof-card and case-study indentation.

## Updated proof

Approved public acquisition wording:

- `40 → 100` Google Search Clicks
- Per rolling 28 days
- March → September 2026
- `2.5× growth`
- Latest verified 100-click window: August 10–September 6, 2026
- `+76%` Google Business Profile Website Clicks, year over year

Repository-wide proof review found no stale public `40 → 90+` value, headline impression/CTR/average-position claims, exact missed-call rate, or public client-name disclosure. Historical internal planning notes still describe the superseded milestone as prior context; they are not rendered public proof. Ranking and AI-result visibility remain explicitly point-in-time supporting evidence.

## Responsive validation

Both `/` and `/hire-matt` were rendered and measured at 1600, 1440, 1280, 1024, 768, 430, 390, and 360 CSS pixels.

- PASS: no page-level horizontal overflow at any required width.
- PASS: exactly one H1 on each route at every required width.
- PASS: homepage CTA remains in the first 900px viewport at every required width.
- PASS: compact commercial navigation appears before the 1024px layout becomes crowded.
- PASS: homepage measured-result cards use two columns where space permits and one column on narrow screens.
- PASS: Hire Matt proof uses three columns through 1024px, a two-column tablet layout with a full-width systems tile at 768px, and one column from 430px down.
- PASS: Hire Matt projects use two columns through 1024px and one column at 768px and below.
- PASS: employer portrait placement, project padding, CTA wrapping, résumé action, and final contact rhythm remain clean at 430–360px.

## Accessibility

- One H1 per page is preserved; the employer H1 remains exactly `Developer. Marketer. Business Problem Solver.`
- Homepage FAQ item headings are H3 beneath the section H2.
- Initial content is visible without animation initialization.
- Scoped focus-visible outlines remain visible on links, buttons, and fields.
- Primary buttons are at least 48px high; mobile header controls, modal controls, employer hero links, and project actions meet the intended touch-target treatment.
- Closed mobile navigation is inert and absent from the accessibility tree; Escape closes it.
- Reduced-motion CSS removes animation, transitions, and smooth scrolling within the audited surfaces.
- Muted supporting text is raised to `#a8b2c1` on the two audited pages and their shared chrome.
- Estivor's external action identifies that it opens in a new tab and uses `target="_blank"` with `rel="noopener noreferrer"`.

## Modal validation

The lead-review modal was checked at 1440, 430, 390, and 360px.

- No horizontal overflow.
- 44px close and challenge controls.
- 50px fields and a 51px submit control in the 390px check.
- Dynamic viewport-height scrolling remains available.
- Focus enters the first field, wraps backward to Close, and returns to the launch button after dismissal.
- Escape closes the modal.

## Estivor status

Estivor remains `LIVE · EARLY ACCESS`. The project action resolves to `https://estivor.com`, opens as an external link with safe relationship attributes, and retains technical/product evidence without adding adoption or revenue claims.

## Lead-system status

The Ooma Office → Zapier → Estivor workflow remains `IN VALIDATION`. Call-event capture, routing, and record matching are not presented as proven client outcomes; recovery and escalation remain `PLANNED`.

## Screenshot artifacts

The before and after captures are genuine, separately timestamped files with distinct image hashes. They remain untracked under `tmp/` and are not part of the source commit.

- `tmp/master-refinement/before-home-1440.png`
- `tmp/master-refinement/after-home-1440.png`
- `tmp/master-refinement/before-home-390.png`
- `tmp/master-refinement/after-home-390.png`
- `tmp/master-refinement/before-hire-1440.png`
- `tmp/master-refinement/after-hire-1440.png`
- `tmp/master-refinement/before-hire-390.png`
- `tmp/master-refinement/after-hire-390.png`
- `tmp/master-refinement/comparison-home-1440.png`
- `tmp/master-refinement/comparison-home-390.png`
- `tmp/master-refinement/comparison-hire-1440.png`
- `tmp/master-refinement/comparison-hire-390.png`

Additional before/after captures for 1600, 1280, 1024, 768, 430, and 360px are preserved in the same directory.

## Build validation

- TypeScript: PASS (`tsc --noEmit --incremental false`).
- Tests: PASS, 5/5.
- ESLint: PASS with 0 errors; 518 existing repository warnings remain.
- Production build: BLOCKED BY EXTERNAL GOOGLE FONT FETCH.

The production retry reached Next.js compilation and failed only while requesting the existing Archivo, DM Sans, Fira Code, and Orbitron stylesheets from Google Fonts. This is an environment/network failure, not a TypeScript, test, ESLint, or application-code compilation regression. The font strategy was deliberately left unchanged.
