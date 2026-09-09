import type { BlogIndexPost } from "./BlogTopicSections";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { urlFor } from "@/app/studio/sanity/lib/image";

type FeaturedPostProps = {
  posts: BlogIndexPost[];
  title?: string;
};

function formatDate(value?: string) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FeaturedPost({
  posts,
  title = "The Big One",
}: FeaturedPostProps) {
  const post = posts[0];

  if (!post?.slug?.current || !post.title) return null;

  const href = `/blog/${post.slug.current}`;
  const published = formatDate(post.publishedAt);
  const minutes = post.readingTime;
  const imageUrl = post.coverImage ? urlFor(post.coverImage).url() : null;
  const imageAlt =
    (post.coverImage &&
    typeof post.coverImage === "object" &&
    "alt" in post.coverImage &&
    typeof post.coverImage.alt === "string"
      ? post.coverImage.alt
      : null) ?? post.title;

  return (
    <div className="mb-[52px] grid grid-cols-1 overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.036] transition-colors hover:border-[rgba(0,118,255,.32)] hover:bg-white/[0.058] lg:grid-cols-[1.15fr_.85fr]">
      <div className="flex flex-col p-9 sm:p-11">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full border border-[rgba(0,118,255,.28)] bg-[rgba(0,118,255,.13)] px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[.06em] text-accent-blue">
            {title}
          </span>
          {published && (
            <span className="text-[13px] text-white/70">
              {published}
              {minutes ? ` · ${minutes} min read` : ""}
            </span>
          )}
        </div>
        <h2 className="mb-3.5 text-[clamp(26px,2.9vw,38px)] font-extrabold leading-[1.1] tracking-[-.026em]">
          <Link className="hover:text-accent-blue" href={href}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="mb-6 text-[16.5px] leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        <Link
          className="group mt-auto inline-flex items-center gap-2 self-start py-2 text-[14.5px] font-bold text-accent-blue"
          href={href}
        >
          Read the article
          <ArrowRight
            className="transition-transform group-hover:translate-x-[3px]"
            size={14}
            strokeWidth={2.5}
          />
        </Link>
      </div>
      <div className="relative min-h-[240px] border-t border-white/[0.08] bg-gradient-to-br from-[rgba(0,118,255,.16)] to-[rgba(11,15,26,.4)] lg:min-h-[300px] lg:border-l lg:border-t-0">
        {imageUrl && (
          <Image
            fill
            alt={imageAlt}
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={imageUrl}
          />
        )}
      </div>
    </div>
  );
}
