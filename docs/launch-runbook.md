# Launch and Validation Runbook

## Hosting and domains

1. Point `all8webworks.com` and `www.all8webworks.com` to the production deployment.
2. Point both `.ca` hosts to the same application or configure an equivalent host-level 308 redirect.
3. Verify at least `/`, `/services`, `/hire-matt`, a blog post and an arbitrary query-string path redirect from `.ca` to the identical `.com` path/query in one hop.
4. Confirm the final `.com` response is indexable and self-canonical.

## Production environment

- Copy `.env.example` into the host's secret/environment UI and supply real values.
- `NEXT_PUBLIC_GTM_ID` must be a real `GTM-*` container; the app deliberately disables placeholders.
- Keep Brevo, HubSpot, Google and reCAPTCHA secrets server-only. Never add `NEXT_PUBLIC_` to them.
- Primary lead success depends on Brevo delivery acceptance. HubSpot, Sheets and CRM are secondary enrichment.

## Forms and analytics

1. Submit a real test Lead System Review and confirm the owner and customer emails arrive.
2. Confirm the same submission appears in configured secondary destinations; investigate logs if it does not.
3. Verify one `lead_review_click`, one `lead_review_start` and one `generate_lead` event. `generate_lead` must fire only after the server returns success.
4. On `/hire-matt`, verify contact, resume-request, LinkedIn, case-study and project events use their `hire_*` names and never open the customer Lead Review modal.

## Release checks

Run:

```text
npx tsc --noEmit
npm run lint
npm run build
```

Then crawl production for status, title, description, canonical, H1 count, internal links and structured-data parse errors. Test 360, 390 and 430 px widths, keyboard-only navigation, reduced motion, modal focus/Escape, the resume state, external links and all form states.
