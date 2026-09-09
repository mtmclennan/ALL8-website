# Launch and Validation Runbook

## Hosting and domains

The authoritative production request path is:

`Cloudflare → Cloudflare Tunnel → cloudflared → 127.0.0.1:8080 Nginx → 127.0.0.1:3000 Next.js`

The root-level `all8`, `default` and `nginx.conf` files are historical server
artifacts and are not the production tunnel template. Do not copy them to a
server. Start from `deploy/nginx/all8-tunnel.conf.example`, review it against
the actual host and test it before enabling it.

1. Route `all8webworks.com` through the verified Cloudflare Tunnel.
2. Configure Cloudflare to send `www.all8webworks.com`, `all8webworks.ca` and `www.all8webworks.ca` to the canonical apex `.com` URL with one-hop 301 redirects that preserve paths and query strings.
3. Verify at least `/`, `/services`, `/hire-matt`, a blog post and an arbitrary query-string path redirect from `.ca` to the identical `.com` path/query in one hop.
4. Confirm the final `.com` response is indexable and self-canonical.
5. Close public 80/443 only after the tunnel has been stable and verified independently of those ports.

## Production environment

- Copy `.env.example` into the host's secret/environment UI and supply real values.
- Set `SITE_URL=https://all8webworks.com` at build time and runtime.
- Set `DEPLOYMENT_ENV=production` only for the real public production deployment. Other values produce global noindex metadata and a deny-all robots response.
- Set `TRUST_PROXY_IP_HEADER=true` only when Next.js is bound to loopback and reached through the reviewed local Nginx configuration. Nginx must overwrite `X-ALL8-Client-IP` with the normalized Cloudflare client address.
- `NEXT_PUBLIC_GTM_ID` must be a real `GTM-*` container; the app deliberately disables placeholders.
- Keep Brevo, HubSpot, Google and reCAPTCHA secrets server-only. Never add `NEXT_PUBLIC_` to them.
- Primary lead success depends on Brevo delivery acceptance. HubSpot, Sheets and CRM are secondary enrichment.
- The application has no public Google OAuth setup route. Prefer `GOOGLE_SERVICE_ACCOUNT_JSON`; alternatively mount a previously provisioned token outside the checkout and set an absolute `GOOGLE_OAUTH_TOKEN_PATH`.

## Forms and analytics

1. Submit a real test Lead System Review and confirm the owner and customer emails arrive.
2. Confirm the same submission appears in configured secondary destinations; investigate logs if it does not.
3. Verify one `lead_review_click`, one `lead_review_start` and one `generate_lead` event. `generate_lead` must fire only after the server returns success.
4. On `/hire-matt`, verify contact, resume-request, LinkedIn, case-study and project events use their `hire_*` names and never open the customer Lead Review modal.

## Release checks

Run:

```text
npx tsc --noEmit
npx eslint .
npm test
npm run build
```

Then crawl production for status, title, description, canonical, H1 count, internal links and structured-data parse errors. Test 360, 390 and 430 px widths, keyboard-only navigation, reduced motion, modal focus/Escape, the resume state, external links and all form states.
