# Personal domain and Estivor rollout

## Implementation

The Estivor card on /hire-matt links to https://estivor.com with “Visit Estivor”, a new-tab announcement, external-link icon, visible keyboard focus, and noopener noreferrer. The existing hire_project_click engagement event includes cta_id=hire-project-estivor, project=estivor, and destination=https://estivor.com. This is not a conversion; use the existing GTM trigger and forward project/destination parameters if reporting needs them.

The public Estivor site was reachable over HTTPS during implementation and advertises early access and features still in development. The card says “Live · Early access”; no adoption, revenue or scale claims were added.

proxy.ts redirects both personal hosts with 308 to https://all8webworks.com/hire-matt. All paths deliberately collapse to that page (option A); query strings are retained for attribution. The existing .ca path/query-preserving redirects remain unchanged. The canonical and sitemap remain on ALL8 .com. The application fallback only works when the original Host reaches Next.js.

## Live status and prerequisites

No checked-in active Nginx configuration or accessible SSH configuration was available. DNS queries and personal-domain HTTPS probes were inconclusive in this environment. Certificate coverage, DNS state and live redirects are NOT verified. The supplied Nginx file is a deployment template, not an installed configuration.

A previous browser check found ALL8 .com redirecting to the older .ca deployment, which returned 404 for /hire-matt. Resolve that deployment/domain routing before enabling the personal-domain redirect; otherwise the final destination will still fail or add a hop.

## DNS records

In the DNS provider, use:

| Name | Type | Target |
| --- | --- | --- |
| @ | A | The existing ALL8 DigitalOcean Droplet IPv4 address from its dashboard |
| www | CNAME | mattmclennan.dev |

Only add an apex AAAA record if the same server has working IPv6 and Nginx listens there; remove conflicting/stale records after checking their existing purpose. No origin IP has been guessed or recorded here. If a DNS provider supports apex CNAME flattening, an apex CNAME to all8webworks.com is an alternative only after verifying it resolves to the intended ALL8 endpoint and accepts both personal hosts. Keep existing Cloudflare proxy policy; do not switch to DNS-only merely for this task.

## Nginx and HTTPS

1. Access the existing server and inspect nginx -T, enabled virtual hosts and certbot certificates. Preserve all ALL8 .com/.ca server blocks and their certificates. Resolve any duplicate personal-domain server_name definitions.
2. Ensure both personal hostnames resolve to this server. Use the existing certificate issuance workflow to cover both mattmclennan.dev and www.mattmclennan.dev. Do not enable a TLS block referencing files that do not exist. For an existing webroot workflow, install only the port-80 block initially, create its challenge webroot, run nginx -t and reload, then use certbot certonly --webroot -w /var/www/letsencrypt -d mattmclennan.dev -d www.mattmclennan.dev. If the host uses a different challenge method or certificate path, follow that established method instead.
3. Adapt deploy/nginx/mattmclennan.dev.conf.example to the verified certificate paths and existing TLS conventions. Enable its TLS block once the certificate exists. This uses a dedicated certificate and does not alter ALL8 certificates. .dev requires working HTTPS in browsers.
4. Run nginx -t successfully before every reload, then systemctl reload nginx. Verify certbot renew --dry-run under the host's existing renewal workflow.
5. Deploy the current ALL8 source with the Estivor link. Host-level redirects should point directly at the final working .com profile, never via .ca or a www intermediate.

## Verification after deployment

Run curl -I for HTTP and HTTPS on both personal hosts, including /random-path?utm_source=resume. Expect 308 with Location: https://all8webworks.com/hire-matt (and the same query when supplied). Run curl -L -o /dev/null -w '%{http_code} %{num_redirects} %{url_effective}' for each URL: final status 200, exactly one redirect, final path /hire-matt. Verify each personal certificate hostname with curl's normal TLS verification; do not use -k.

Recheck .ca paths/queries, /hire-matt canonical and one H1, mobile layout, keyboard focus, and new-tab Estivor navigation. In GTM Preview confirm exactly one hire_project_click with the project/destination values per click, and no generate_lead or employer-conversion event. Do not add the personal domain to the sitemap or host a duplicate profile there.
