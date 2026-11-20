import { z } from "zod";

import { client as sanity } from "@/app/studio/sanity/lib/client";
import { singlePostQuery } from "@/app/studio/sanity/lib/queries";
import {
  canonicalBlogSlug,
  sourceBlogSlug,
} from "@/config/permanent-redirects.mjs";
import { getBlogCanonicalUrl } from "@/lib/seo/blogCanonical";

import { indexNowOrigin } from "./client";
import { readPublicPage } from "./publicPage";

const snapshot = z.object({
  id: z.string().min(1).max(128),
  revision: z.string().min(1).max(128),
  slug: z.string().max(256).nullable(),
  draft: z.boolean(),
  noIndex: z.boolean(),
  canonicalUrl: z.string().max(2048).nullable(),
});

export const blogEvent = z
  .object({
    projectId: z.string(),
    dataset: z.string(),
    meaningful: z.boolean(),
    before: snapshot.nullable(),
    after: snapshot.nullable(),
  })
  .refine(
    ({ before, after }) =>
      (before || after) && (!before || !after || before.id === after.id),
  );

type Snapshot = z.infer<typeof snapshot>;
export type BlogEvent = z.infer<typeof blogEvent>;

function publicPath(post: Snapshot | null) {
  if (
    !post ||
    post.draft ||
    /^(?:drafts|versions)\./.test(post.id) ||
    !post.slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)
  )
    return null;

  return `/blog/${canonicalBlogSlug(post.slug)}`;
}

function indexablePath(post: Snapshot | null) {
  const path = publicPath(post);

  return path &&
    post?.slug &&
    !post.noIndex &&
    getBlogCanonicalUrl(post.slug, post.canonicalUrl) === indexNowOrigin + path
    ? path
    : null;
}

type SanityPostState = {
  _id: string;
  _rev: string;
  slug?: { current?: string };
  draft?: boolean;
  seo?: { noIndex?: boolean; canonicalUrl?: string };
};

async function readPublishedPost(path: string): Promise<Snapshot | null> {
  const slug = path.slice("/blog/".length);
  const slugs = [...new Set([sourceBlogSlug(slug), slug])];
  const post = await sanity.fetch<SanityPostState | null>(
    singlePostQuery,
    { slugs },
    { cache: "no-store", signal: AbortSignal.timeout(4000) },
  );

  return post
    ? {
        id: post._id,
        revision: post._rev,
        slug: post.slug?.current ?? null,
        draft: post.draft === true,
        noIndex: post.seo?.noIndex === true,
        canonicalUrl: post.seo?.canonicalUrl ?? null,
      }
    : null;
}

export async function prepareBlogNotification(
  event: BlogEvent,
  invalidate: (path: string, type?: "page") => void,
) {
  if (!event.meaningful) return [];
  const { before, after } = event;
  const touched = [
    ...new Set(
      [publicPath(before), publicPath(after)].filter((path) => path !== null),
    ),
  ];

  if (!touched.length) return [];
  for (const path of ["/", "/blog", "/sitemap.xml"]) invalidate(path);
  invalidate("/blog/category/[slug]", "page");

  const publish = indexablePath(after);
  const candidates = [
    ...new Set(
      [indexablePath(before), publish].filter((path) => path !== null),
    ),
  ];

  for (const path of touched) {
    if (!candidates.includes(path)) invalidate(path);
  }

  const outcomes = await Promise.all(
    candidates.map(async (path) => {
      const live = await readPublishedPost(path);

      if (live && live.id !== (after ?? before)?.id) return null;
      if (
        live &&
        live.revision === before?.revision &&
        live.revision !== after?.revision
      ) {
        return { path, ready: false };
      }
      if (live && (path !== publish || indexablePath(live) !== path)) {
        invalidate(path);
        return null;
      }
      if (!live && path === publish) return { path, ready: false };

      const page = await readPublicPage(path);

      if (!live && [301, 302, 303, 307, 308].includes(page.status)) return null;

      const ready = live
        ? page.indexable && page.revision === live.revision
        : page.status === 404 || page.status === 410;

      if (!ready) invalidate(path);

      return { path, ready };
    }),
  );

  if (outcomes.some((outcome) => outcome && !outcome.ready)) {
    // Next applies the route-handler invalidation after this response. Sanity
    // retries 503s, and the next public GET can then pick up the fresh page.
    throw new Error("Waiting for published Sanity content or regenerated HTML");
  }

  return outcomes.flatMap((outcome) =>
    outcome ? [indexNowOrigin + outcome.path] : [],
  );
}
