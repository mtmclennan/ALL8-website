import type { BlogIndexPost } from "@/app/(site)/blog/_components/BlogTopicSections";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PostCard from "@/app/(site)/blog/_components/PostCard";
import { client as sanity } from "@/app/studio/sanity/lib/client";
import { homeStrategicPostsQuery } from "@/app/studio/sanity/lib/queries";

type HomeResourcePost = BlogIndexPost;

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
              From the blog
            </p>
            <h2
              className="mt-3 all8-h2 font-extrabold leading-[1.06] tracking-[-.022em]"
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
            Browse all service-business guides{" "}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <div className="mt-9 grid gap-[22px] md:grid-cols-2">
          {resources.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
