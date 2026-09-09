# ALL8 production infrastructure and domain cutover plan

Status recorded 2026-09-09: **NOT READY TO CUT OVER**.

This runbook implements the target path:

```text
Internet -> Cloudflare -> all8-prod Tunnel -> cloudflared
         -> 127.0.0.1:8080 Nginx -> 127.0.0.1:3000 Next.js/PM2
```

The sequence is intentionally gated. Do not publish `.ca` through the tunnel or
enable `.ca` redirects until `.com` has passed a real lead submission and the
checks in this document.

## Current blockers

- The connected Cloudflare account currently exposes zero zones and zero
  tunnels. It is not the account currently authoritative for the ALL8 domains.
- The Phase 1 changes, lockfile, `.nvmrc`, loopback Nginx example, and PM2 file
  exist only in the local working tree. The remote `redesign/homepage` branch is
  therefore not a deployable release.
- No SSH host/user or verified server checkout path is available in this task.
- The local command runtime is unavailable, so the working tree and SSH config
  cannot be re-inspected or validated in this session.
- A controlled production lead recipient has not been designated.

## Production environment checklist

Enter values in the server's secret environment file or secret manager. Do not
commit secrets. For a standard Next.js host, use a root-owned or deploy-user-owned
`.env.production.local` with mode `0600` in the application root.

### Required for production startup/build

- `NODE_ENV=production`
- `DEPLOYMENT_ENV=production`
- `NEXT_PUBLIC_SITE_URL_US=https://all8webworks.com`
- `NEXT_PUBLIC_SITE_URL=https://all8webworks.com`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION`

### Required for durable lead capture

- `BREVO_API_KEY`
- `CONTACT_TO`

Primary lead success is allowed only after Brevo accepts the notification.

### Required reCAPTCHA configuration

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET`

The reCAPTCHA provider allowlist must contain `all8webworks.com` before the
first `.com` production form test. Keep `.ca` allowed during the transition.

### Required Upstash rate limiting

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Required public Sanity configuration

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION`

Add `https://all8webworks.com` to the Sanity project's CORS origins. If Studio
authentication is used from the site origin, enable credentials for that origin.
Keep the `.ca` origin until the migration is complete.

### Optional HubSpot enrichment

- `HUBSPOT_TOKEN`
- `HS_PORTAL_ID`
- `HS_FORM_GUID`
- `HS_CONSENT_TEXT`
- `HS_SUBSCRIPTION_ID_MARKETING`
- `HS_COMM_TEXT`

If HubSpot is enabled, the token, portal, and form GUID must be supplied as a
complete set. HubSpot failure must not turn an already captured lead into a false
failure, but it must appear in application logs.

### Optional Google Sheets enrichment

- `GOOGLE_SHEET_ID`
- `GOOGLE_SHEET_TAB=ALL8_Leads`
- `GOOGLE_SERVICE_ACCOUNT_JSON` (preferred production authentication)
- `GOOGLE_OAUTH_TOKEN_PATH` (only for an explicitly provisioned persistent token)
- `GOOGLE_CLIENT_ID` (OAuth mode only)
- `GOOGLE_CLIENT_SECRET` (OAuth mode only)
- `GOOGLE_REDIRECT_URI` (OAuth mode only; use the `.com` callback)

The public OAuth callback routes are disabled. Prefer the service account and
share the target sheet with that account. Do not depend on an interactive OAuth
flow on the production server.

### Optional analytics and presentation values

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_BUILD_TIME`
- `CONTACT_CC`
- `ALL8_LOGO_URL=https://all8webworks.com/assets/all8-webworks-web-design-and-development-logo.webp`

Remove or replace every remaining `.ca` value before the production build,
especially `ALL8_LOGO_URL` and any provider callback/domain allowlist.

## Release preparation

Create a focused Phase 1 commit without absorbing unrelated local edits. Push it
to the approved production branch and record the full commit SHA as
`<PHASE_1_SHA>`. The production checkout must be clean before pulling.

Run on the server after the SSH target and current checkout are verified:

```bash
cd <VERIFIED_APPLICATION_DIRECTORY>
git status --short --branch
git remote -v
git rev-parse HEAD
git fetch --prune origin
git switch redesign/homepage
git pull --ff-only origin redesign/homepage
test "$(git rev-parse HEAD)" = "<PHASE_1_SHA>"
```

Stop if the working tree is dirty, the pull is not fast-forward, or the SHA does
not match the approved release.

## Node, clean install, build, and PM2

The repository pins Node in `.nvmrc` and uses `npm ci` as the only production
install path.

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd <VERIFIED_APPLICATION_DIRECTORY>
nvm install
nvm use
node --version
npm --version
npm ci
npx tsc --noEmit
npm test
npm run build
pm2 startOrReload deploy/pm2/ecosystem.config.cjs --env production
pm2 save
pm2 status
pm2 logs all8-webworks --lines 100 --nostream
curl --fail --silent --show-error --head http://127.0.0.1:3000/
```

Expected Node version: `v24.11.0`. Expected npm major: `11`.

Before deployment, record the previous commit SHA and PM2 process description.
Rollback means switching to that exact prior commit, repeating `npm ci` and
`npm run build`, then starting/reloading the same ecosystem file. Do not use
`git reset --hard`.

## Nginx loopback proxy

Proposed site content:

```nginx
server {
    listen 127.0.0.1:8080;
    server_name all8webworks.com www.all8webworks.com
                all8webworks.ca www.all8webworks.ca;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
        proxy_set_header X-Real-IP $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For $http_cf_connecting_ip;

        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

Before installing it, inspect `nginx -T`, resolve the exact active ALL8 site
path, and copy both the file and enabled symlink target to timestamped backups.
Then install the repository example and validate before reload:

```bash
sudo nginx -T
sudo ss -ltnp
sudo cp --archive <CURRENT_ALL8_SITE> <CURRENT_ALL8_SITE>.pre-tunnel-<UTC_TIMESTAMP>
sudo install --mode=0644 deploy/nginx/all8-tunnel.conf.example <ALL8_TUNNEL_SITE>
sudo nginx -t
sudo systemctl reload nginx
curl --fail --silent --show-error --head \
  --header 'Host: all8webworks.com' http://127.0.0.1:8080/
```

Risk: replacing the wrong site or reusing port `8080` can interrupt production.
Rollback: restore the timestamped file/symlink, run `sudo nginx -t`, then reload.

Do not expose `3000` or `8080` publicly. Do not remove the existing public
listener until every hostname has moved through the tunnel and rollback has been
tested.

## Cloudflare tunnel: `.com` apex only

Prerequisites:

1. Connect the Cloudflare account that owns the authoritative
   `all8webworks.com` and `all8webworks.ca` zones.
2. Export/snapshot both DNS zones and all current Redirect/Page/Bulk rules.
3. Confirm email records (MX, SPF, DKIM, DMARC) will remain unchanged.
4. Confirm Nginx responds on `127.0.0.1:8080` and PM2 is healthy.

Proposed first mutation:

- Create one remotely managed tunnel named `all8-prod`.
- Install its connector token as a `systemd` service on the verified origin.
- Configure ingress only for `all8webworks.com` to
  `http://127.0.0.1:8080`, followed by `http_status:404`.
- Replace only the `.com` apex web record with the tunnel CNAME/route.
- Do not publish `www` or either `.ca` hostname yet.

Cloudflare's Debian/Ubuntu package commands are:

```bash
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update
sudo apt-get install cloudflared
sudo cloudflared service install <ONE_TIME_TUNNEL_TOKEN>
sudo systemctl status cloudflared --no-pager
```

Never write the tunnel token to the repository or shell history. Prefer an
interactive protected paste or a root-readable temporary environment mechanism,
then remove it.

Risk: changing the current `.com` record removes the present `.com -> .ca`
fallback. Rollback: restore the snapshotted `.com` DNS record and previous
redirect rule, then verify the old chain.

## `.com` validation gate

Validate from a network outside the server:

- Tunnel reports `Healthy` with active connectors.
- Apex `/`, `/services`, `/hire-matt`, a service page, a blog post,
  `/robots.txt`, and `/sitemap.xml` return the intended status.
- HTML titles, H1s, canonical URLs, Open Graph URLs, JSON-LD, internal links,
  sitemap entries, and robots sitemap reference use `.com`.
- Static assets and Sanity images load without mixed-content or CORS errors.
- Direct origin ports `3000` and `8080` are not publicly reachable.
- OAuth callback routes return the expected disabled response.

### Controlled real lead test

Use a recipient owned by ALL8 and a unique marker such as
`CUTOVER-TEST-<UTC_TIMESTAMP>`. Submit through the public `.com` UI; do not call
the server action directly.

Confirm all of the following:

- The user sees success only after the primary Brevo request is accepted.
- The owner notification arrives.
- The submitter confirmation arrives if the selected form sends one.
- HubSpot form/contact/deal/task enrichment is correct when enabled.
- The Google Sheet row is correct when enabled.
- PM2 logs contain no uncaught error and any secondary failure is explicit.
- Exactly one `lead_review_click`, `lead_review_start`, and `generate_lead`
  event is recorded; `generate_lead` occurs only after success.

Failure at this gate means restore `.com` to its previous record/redirect and fix
the origin. Do not proceed to `www` or `.ca`.

## `www` normalization

After the apex has been stable, publish `www.all8webworks.com` through the same
tunnel and add an edge redirect:

```text
www.all8webworks.com/<path>?<query>
  -> https://all8webworks.com/<path>?<query>  (308, one hop)
```

Retest the full `.com` validation gate. The apex is the only canonical origin.

## `.ca` cutover and direct legacy aliases

Only after the `.com` lead gate passes:

1. Publish `all8webworks.ca` and `www.all8webworks.ca` through the tunnel.
2. Add higher-priority direct rules for indexed legacy paths so they land on the
   final `.com` URL in one hop.
3. Add the `.ca` catch-all redirect last, preserving path and query.

Direct legacy destinations:

- `/tuneUpPage`, `/tune-up`, `/services/performance-tune-up`, and
  `/services/websites-that-convert` ->
  `https://all8webworks.com/services/lead-generation-websites`
- `/services/website-maintenance-hosting` ->
  `https://all8webworks.com/services/website-care-optimization`
- `/services/local-seo-foundation` and
  `/services/google-business-profile-optimization` ->
  `https://all8webworks.com/services/local-seo-google-business-profile`
- `/services/google-ads-setup-integration` ->
  `https://all8webworks.com/services/google-ads-lead-generation`
- `/services/business-tool-integrations` ->
  `https://all8webworks.com/services/custom-lead-systems`
- `/legal/privacy-policy` -> `https://all8webworks.com/privacy`

Apply those rules to `.ca`, `www.ca`, and `www.com` source hosts. Preserve the
incoming query string. Then apply the catch-all:

```text
all8webworks.ca/<path>?<query>
www.all8webworks.ca/<path>?<query>
  -> https://all8webworks.com/<path>?<query>  (308, one hop)
```

The application proxy remains a fallback for `.ca` requests, not the primary
redirect layer.

## CMS, provider, and search follow-up

- Update the Sanity link in the affected article from the old `.ca` Google
  Business Profile service URL to
  `/services/local-seo-google-business-profile`.
- Confirm Sanity CORS for `.com`; remove `.ca` only after Studio/editor traffic
  no longer uses it.
- Verify Brevo sender-domain authentication and the `.com` logo asset.
- Verify reCAPTCHA domain allowlists, Upstash credentials, HubSpot credentials,
  Google service-account sheet access, and GTM/GA/Ads IDs.
- Add/verify the `.com` Search Console domain property before cutover.
- Submit the `.com` sitemap after redirects are live.
- Use Change of Address for the `.ca` property if Search Console supports the
  exact property setup; otherwise retain both properties and monitor indexing.
- Monitor 404s, redirect chains, tunnel health, lead failures, Search Console,
  analytics, and server logs daily during the stabilization window.
- Close public inbound web ports at the DigitalOcean/cloud firewall only after
  all four hosts use the healthy tunnel. Preserve SSH recovery access.

## Completion criteria

`DOMAIN MIGRATION COMPLETE` is allowed only when:

- `.com` apex and `www` are live and validated;
- a real controlled `.com` lead succeeds end to end;
- both `.ca` hosts redirect every path/query to the final `.com` URL in one hop;
- direct legacy aliases avoid redirect chains;
- provider/CMS updates are complete; and
- rollback artifacts and monitoring are confirmed.
