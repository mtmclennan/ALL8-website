# Phase 3 — Content briefs: Lead Handling & Tracking / Attribution pillars

Two of ALL8's five planned content pillars have zero posts and zero Sanity categories (per the Aug 15, 2026 site audit, §F/§J). This doc briefs two posts per pillar — enough to get each pillar off zero and feed the service pages that currently have no supporting blog content at all (Missed-Call Recovery, Lead Follow-Up Automation, CRM & Sales Pipeline, Call Tracking & Lead Attribution, Google Ads).

These are briefs, not drafts — topic, angle, target keyword, and outline only. Write the full post from here, then create it in Sanity Studio (`/studio`) using the fields below. `lib/relatedServices.ts`'s `BLOG_SERVICE_MAP` already has the keyword rules to auto-link these to the right service pages (fixed in this pass) — add an explicit slug entry to `BLOG_SERVICE_MAP` once the real post slug exists, so the auto-link isn't left to keyword-matching alone.

---

## Pillar 1 — Lead Handling

**New Sanity category to create first:**
- title: `Lead Handling`
- slug: `lead-handling`
- description: `Missed calls, follow-up, and what happens after a lead comes in.`

### Post 1: "You Didn't Lose the Job to a Competitor. You Lost It to Voicemail."

- **Target keyword:** missed call losing customers / missed call text back
- **Angle:** Reframes missed calls from an annoyance into a quantifiable revenue leak — uses the "the marketing worked, the customer called, nobody answered" framing already established in the Missed-Call Recovery service page copy, so the post and page read as one voice.
- **Outline:**
  1. The moment that actually loses the job isn't a bad ad or a bad website — it's an unanswered phone.
  2. Why this is invisible: no record exists that the call happened, so nobody notices the leak.
  3. What a text-back / call-routing setup actually looks like (plain-language, not a feature dump).
  4. A simple way to estimate what missed calls are already costing, using the reader's own call volume.
  5. CTA into Free Lead System Review.
- **Category:** Lead Handling. **Secondary category:** Digital Marketing.
- **Tags:** missed calls, call handling, lead generation, contractor marketing
- **Feeds:** `missed-call-recovery` (primary), `lead-follow-up-automation` (secondary)
- **SEO title:** "Missed Calls Are Costing You Jobs — Here's the Fix | ALL8 Webworks"
- **SEO description:** "A missed call doesn't just vanish — it becomes a job for a competitor. Here's what a real missed-call recovery setup looks like and how to see what it's already costing you."

### Post 2: "The Quote You Sent on Friday Is Already Cold by Monday"

- **Target keyword:** follow up with leads / estimate follow-up automation
- **Angle:** Most owner-operators send one quote and move on. This post makes the case for sequenced follow-up without sounding like a robo-spam pitch — mirrors the Lead Follow-Up Automation page's "automation handles the reminding, people do the selling" distinction.
- **Outline:**
  1. The default failure mode: one quote sent, zero follow-up, no one notices until the job goes elsewhere.
  2. Why most people don't say yes on the first ask — the case for a second and third touch.
  3. What automated follow-up actually is (acknowledgement, reminders, sequenced check-ins) vs. what it isn't (a robot doing your selling).
  4. How this connects to a CRM/pipeline if the reader doesn't have one yet.
  5. CTA into Free Lead System Review.
- **Category:** Lead Handling. **Secondary category:** Small Business Insights.
- **Tags:** follow-up, lead nurturing, sales pipeline, contractor sales
- **Feeds:** `lead-follow-up-automation` (primary), `crm-sales-pipeline` (secondary)
- **SEO title:** "Why Your Quotes Are Going Cold — And How to Fix Follow-Up | ALL8 Webworks"
- **SEO description:** "A quote sent once and never followed up is a job you're handing to whoever calls the lead back. Here's how automated follow-up actually works."

---

## Pillar 2 — Tracking & Attribution

**New Sanity category to create first:**
- title: `Tracking & Attribution`
- slug: `tracking-attribution`
- description: `Knowing which marketing actually produced the call, the lead, or the job.`

### Post 3: "Which Ad, Page, or Search Actually Got You That Customer? Most Owners Can't Say."

- **Target keyword:** marketing attribution for small business / call tracking for contractors
- **Angle:** Direct, non-technical explanation of attribution aimed at owners who've never had visibility into it — sets up the "replaces most of the guessing, not all of it" honesty already used on the Call Tracking & Lead Attribution service page.
- **Outline:**
  1. The question every owner should be able to answer and usually can't: what actually produced this job?
  2. Why gut-feel marketing decisions are expensive — spending more on what's already working vs. what feels like it's working.
  3. What call tracking, form attribution, and UTM tracking actually do, explained without jargon.
  4. What attribution can't do (word of mouth, memorized phone numbers) — building trust by being honest about limits.
  5. CTA into Free Lead System Review.
- **Category:** Tracking & Attribution. **Secondary category:** Digital Strategy.
- **Tags:** attribution, call tracking, marketing ROI, analytics
- **Feeds:** `call-tracking-lead-attribution` (primary), `google-ads-lead-generation` (secondary)
- **SEO title:** "Do You Actually Know Which Marketing Gets You Customers? | ALL8 Webworks"
- **SEO description:** "Most small business owners can't say which ad, page, or search actually produced their last customer. Here's what call and lead attribution actually looks like."

### Post 4: "Your Google Ads Are Tracking Clicks. They're Not Tracking Jobs."

- **Target keyword:** Google Ads conversion tracking for contractors / is Google Ads working
- **Angle:** Targets the specific gap on the Google Ads service page (zero supporting blog content today) — clicks and impressions aren't the same as booked work, and most small-business Ads accounts stop measuring at the click.
- **Outline:**
  1. The default Google Ads dashboard tells you clicks and cost, not whether any of it turned into a job.
  2. Why that gap makes it impossible to know if ad spend is working or just burning budget.
  3. What real conversion tracking looks like connected to calls and form submissions, not just landing-page visits.
  4. How this connects back to attribution and the CRM once tracking exists.
  5. CTA into Free Lead System Review.
- **Category:** Tracking & Attribution. **Secondary category:** Digital Marketing.
- **Tags:** Google Ads, conversion tracking, PPC, lead generation
- **Feeds:** `google-ads-lead-generation` (primary), `call-tracking-lead-attribution` (secondary)
- **SEO title:** "Your Google Ads Track Clicks, Not Jobs — Here's the Fix | ALL8 Webworks"
- **SEO description:** "Clicks and impressions aren't the same as a booked job. Here's how to actually connect your Google Ads spend to real calls and customers."

---

## Cannibalization — flagged, not resolved this pass

Pulled directly from the live Sanity dataset (12 posts). Not touched in this pass per Matt's direction — listed here so a future session doesn't have to re-derive it.

**Posts competing with `lead-generation-websites` / `website-care-optimization` for the same search intent** (title and topic overlap directly with what those service pages already rank for):
- "Why Contractor Websites Fail (And How to Fix Yours)"
- "How to Build a High-Performance Contractor Website That Actually Converts"
- "Building a Website Is Easy. Running One Is Not." — nearly restates the Website Care & Optimization page's own pitch
- "Why Your Website Should Perform Like a V8 Engine"
- "What Makes a High-Converting Service Page for Trades Businesses?"
- "More Traffic Won't Fix the Wrong Website"

**Posts competing with `local-seo-google-business-profile`** — and with each other:
- "Local SEO for Contractors in 2026: The Ultimate Blueprint for Ranking in Google Maps"
- "Why Your Business Isn't Showing Up on Google Maps (And It's Not What You Think)" — same core topic as the post above; these two likely split each other's ranking potential rather than the service page's
- "If Your Business Only Has a Facebook Page, You're Invisible to Google"

That's 8–9 of 12 posts pulling toward two service pages (Lead Gen Websites, Local SEO), while 5 of 9 service pages — Google Ads, Missed-Call Recovery, Lead Follow-Up, CRM, Call Tracking — had zero supporting posts before this pass's briefs. "How to Get Your Business Recommended by ChatGPT" and "The Problem Wasn't Skill, It Was the System" are the only posts with fairly distinct intent (AI-answer visibility; systems-thinking narrative) worth leaving as-is.

**When this gets addressed:** the likely fix is consolidating the two Google Maps posts into one, and repointing 2–3 of the website-performance posts toward the now-covered Lead Handling / Tracking & Attribution pillars or retiring/301-ing them — but that's a content decision for Matt to make deliberately, not something to auto-resolve.

## After publishing

1. Add each post's real slug to `BLOG_SERVICE_MAP` in `lib/relatedServices.ts` with the service slugs noted above — don't rely on keyword-matching alone for pillar-defining content.
2. Confirm the new categories render on `/blog` and that the (currently orphaned — see audit §D) category archive pages pick them up once Phase 4 surfaces that navigation.
3. These 4 posts alone fully close the "zero blog support" gap for Missed-Call Recovery, Lead Follow-Up Automation, and meaningfully improve it for CRM, Call Tracking, and Google Ads. CRM & Sales Pipeline still only gets secondary coverage — worth a dedicated post in a future pass if it stays uncovered.
