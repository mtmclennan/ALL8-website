# Blog publishing inventory

Read-only snapshot of the production Sanity dataset on October 6, 2026. This counts published `post` documents and excludes drafts; no content was changed.

| Content shape | Published count | Notes |
| --- | ---: | --- |
| Posts | 12 | Existing public blog posts |
| Portable Text text blocks | 1,652 | Includes paragraphs, headings, and lists |
| Legacy body images (`_type: "image"`) | 1 | In `how-fast-should-a-service-business-respond-to-a-new-lead`; missing authored alt text |
| New body images (`_type: "bodyImage"`) | 0 | Available for future authoring after Studio redeployment |
| Native tables (`_type: "table"`) | 0 | No published table requires migration |
| Body headings | 205 | 1 H1, 107 H2, 97 H3; no repeated exact heading text within a post |
| Body links | 26 | 12 internal `/path` links, 14 HTTPS links, no other URL forms |
| Cover images | 12 | All have alt text |
| OG images | 1 | Has alt text |
| Twitter images | 0 | No published values |

The legacy body image asset reports 1536 × 1024 pixels. Its original filename is `all8-webworks-lead-response-targets-service-businesses.webp`; the asset has no title or description. The frontend now uses that filename as a nonempty alt fallback. An editor should eventually add a meaningful authored alt description to this one image when reviewing the article.

The new body image type and table fields do not require migration of any published post. Table rendering was checked with a temporary local fixture because there are no published tables yet; the fixture was removed after validation.
