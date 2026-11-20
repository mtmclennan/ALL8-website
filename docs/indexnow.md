# IndexNow for ALL8 Webworks

IndexNow sends notifications about new, changed or removed URLs to participating search engines. HTTP 200 means receipt. HTTP 202 means receipt with key validation still pending. Neither response guarantees crawling or indexing. [IndexNow protocol](https://www.indexnow.org/documentation)

## Production configuration

| Variable | Value |
| --- | --- |
| `DEPLOYMENT_ENV` | `production` on the live Next.js build and process. Preview builds do not serve the key file or submit notifications. |
| `INDEXNOW_KEY` | One stable public key, 8–128 ASCII letters, digits or hyphens. Keep it in the production runtime across releases. |
| `INDEXNOW_ENABLED` | Set to `true` when ready to accept webhook notifications and to enable explicit CLI submissions. The key file can be verified before enabling. |
| `SANITY_INDEXNOW_WEBHOOK_SECRET` | A separate random signing secret of at least 32 characters. Store it server-side and enter the same value in Sanity's **Secret** setting. |
| `INDEXNOW_ENDPOINT` | Optional trusted HTTPS endpoint ending in `/indexnow`. Defaults to `https://api.indexnow.org/indexnow`. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Existing public Sanity settings. The webhook must target these exact values. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Existing Redis connection. Delivery leases and completed deliveries use the `indexnow:sanity:` prefix. |

Set the variables using the existing production release and PM2 environment process. Keep the signing secret and Redis token out of client variables, URLs, logs, shared webhook configuration links and version control. The ownership key is public by design.

Before enabling the webhook, GET `https://all8webworks.com/{key}.txt`. Expect 200 without a redirect, `text/plain; charset=utf-8`, and the exact key as the file body. A different key path should return 404. Verify that the edge passes the response through as plain text. Keep this URL available across releases. If rotating the key, check the new public file before sending notifications. [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted)

## Sanity webhook

In Sanity Manage, create a GROQ webhook for the live dataset with API version `2025-02-19` or newer, HTTP method **POST**, and URL `https://all8webworks.com/api/indexnow/sanity`. Enable **Create**, **Update**, and **Delete**, and leave draft and version events off. Set the webhook's **Secret** to the separate signing secret above. Use the following filter and projection. [Sanity webhook configuration](https://www.sanity.io/docs/content-lake/webhooks)

Filter:

```groq
coalesce(after()._type, before()._type) == "post" &&
!(coalesce(after()._id, before()._id) in path("drafts.**")) &&
!(coalesce(after()._id, before()._id) in path("versions.**")) &&
(
  delta::operation() != "update" ||
  delta::changedAny((
    draft, slug.current, title, excerpt, coverImage, body, publishedAt,
    updatedAt, author, categories, relatedPosts, tags, readingTime,
    seo.noIndex, seo.canonicalUrl, seo.metaTitle, seo.metaDescription,
    seo.ogTitle, seo.ogDescription, seo.ogImage, seo.twitterImage
  ))
)
```

Projection:

```groq
{
  "projectId": sanity::projectId(),
  "dataset": sanity::dataset(),
  "meaningful": delta::operation() != "update" || delta::changedAny((
    draft, slug.current, title, excerpt, coverImage, body, publishedAt,
    updatedAt, author, categories, relatedPosts, tags, readingTime,
    seo.noIndex, seo.canonicalUrl, seo.metaTitle, seo.metaDescription,
    seo.ogTitle, seo.ogDescription, seo.ogImage, seo.twitterImage
  )),
  "before": before() {
    "id": _id, "revision": _rev, "slug": slug.current,
    "draft": coalesce(draft, false), "noIndex": coalesce(seo.noIndex, false),
    "canonicalUrl": seo.canonicalUrl
  },
  "after": after() {
    "id": _id, "revision": _rev, "slug": slug.current,
    "draft": coalesce(draft, false), "noIndex": coalesce(seo.noIndex, false),
    "canonicalUrl": seo.canonicalUrl
  }
}
```

The handler verifies the signature before querying Sanity. It rechecks the live published record against actual public HTML. A 200 article must return its current Sanity revision, its own canonical, and no noindex directive. An old URL after a rename or unpublish is eligible when it returns 404/410. Existing redirect sources are omitted. Drafts, release versions, noindex articles and alternate-canonical articles are ineligible.

Next invalidates affected article pages, the blog index, category archives, home and sitemap as needed. If Sanity or public HTML still shows the previous state, the handler returns 503 so Sanity can retry after the invalidation takes effect. Sanity documents two retries at 30-second intervals. An edge cache that continues serving stale HTML can exhaust both retries. Check the public canonical response and Sanity's delivery log before retrying an affected event. Redis suppresses concurrent and completed deliveries for the same signed change for seven days. The protocol has no idempotency key, so an upstream receipt followed by a lost response can still result in a repeat notification. [Sanity retry and delivery guidance](https://www.sanity.io/docs/content-lake/webhooks#technical-limits-retry-policy-and-timeouts)

## Submit changed release pages by hand

After a release is publicly available, list only static or service routes actually changed in that release. The default is a dry run. The command checks the public key file and each explicit URL before sending. It does not read the sitemap. Run from a checkout with Node 24 and the same IndexNow configuration.

```sh
npm run indexnow:submit -- /pricing /services/lead-generation-websites
npm run indexnow:submit -- --send /pricing /services/lead-generation-websites
```

## Verify after enabling

1. Confirm the final key URL and affected production pages return the expected status, canonical and robots policy.
2. Observe a genuine article publish or editorial update in Sanity's delivery log. If the first request is waiting for regenerated HTML, look for a successful retry. Verify that a repeat delivery is acknowledged without submitting again.
3. In Bing Webmaster Tools, select the verified `all8webworks.com` property. Check the IndexNow tab for receipt of the changed URL. Use URL Inspection to check crawl and index status separately. [Bing IndexNow report](https://www.bing.com/webmasters/help/indexnow-0z209wby)
