import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { client as sanity } from "@/app/studio/sanity/lib/client";
import { homeStrategicPostsQuery } from "@/app/studio/sanity/lib/queries";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";

type HomeResourcePost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  category?: { title?: string; slug?: string };
};

const STRATEGIC_POST_SLUGS = [
  "local-seo-for-contractors-in-2025-the-ultimate-blueprint-for-ranking-in-google-maps",
  "more-traffic-won-t-fix-the-wrong-website",
] as const;

export default async function HomeResources() {
  const posts = await sanity.fetch<HomeResourcePost[]>(
    homeStrategicPostsQuery,
    { slugs: STRATEGIC_POST_SLUGS },
    { next: { revalidate: 3600 } },
  );
  const postsBySlug = new Map(
    posts.map((post) => [post.slug?.current, post] as const),
  );
  const resources = STRATEGIC_POST_SLUGS.map((slug) =>
    postsBySlug.get(slug),
  ).filter(
    (
      post,
    ): post is HomeResourcePost & {
      title: string;
      slug: { current: string };
    } => Boolean(post?.title && post.slug?.current),
  );

  if (!resources.length) return null;

  return (
    <section
      aria-labelledby="home-resources-title"
      className="py-24 max-[960px]:py-16"
      id="resources"
    >
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[680px]">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-accent-blue">
              Practical field notes
            </p>
            <h2
              className="mt-3 text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.06] tracking-[-.022em]"
              id="home-resources-title"
            >
              Understand the Problem Before Buying the Fix
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Start with two recurring constraints: getting found for the right
              work and turning that attention into a real inquiry.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-2 self-start py-2 font-bold text-accent-blue hover:text-[#8ec5ff]"
            href="/blog"
          >
            Browse all service-business guides <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {resources.map((post) => {
            const href = `/blog/${canonicalBlogSlug(post.slug.current)}`;

            return (
              <article
                key={post._id}
                className="flex h-full flex-col rounded-[20px] border border-white/[0.09] bg-white/[0.035] p-7 transition-colors hover:border-[rgba(0,118,255,.26)] hover:bg-white/[0.055]"
              >
                <div className="mb-5 flex items-center gap-3 text-accent-blue">
                  <BookOpen aria-hidden="true" size={20} />
                  <span className="text-xs font-bold uppercase tracking-[.1em]">
                    {post.category?.title ?? "Field Note"}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-[-.02em]">
                  <Link
                    className="hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
                    href={href}
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="mt-4 line-clamp-3 text-base leading-relaxed text-white/70">
                    {post.excerpt}
                  </p>
                ) : null}
                <Link
                  className="mt-6 inline-flex min-h-11 items-center gap-2 self-start py-2 text-sm font-bold text-accent-blue hover:text-[#8ec5ff]"
                  href={href}
                >
                  Read {post.title} <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
