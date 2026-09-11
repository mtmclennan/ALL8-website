import type { BlogIndexPost } from "./BlogTopicSections";

import Link from "next/link";

import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";

function formatDate(value?: string) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PostCard({ post }: { post: BlogIndexPost }) {
  if (!post.slug?.current || !post.title) return null;

  const href = `/blog/${canonicalBlogSlug(post.slug.current)}`;
  const published = formatDate(post.publishedAt);
  const category = post.categories?.[0]?.title;

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.036] p-[30px] transition-all duration-200 hover:-translate-y-[3px] hover:border-[rgba(0,118,255,.24)] hover:bg-white/[0.058] hover:shadow-[0_20px_46px_-16px_rgba(0,0,0,.5)]">
      {category && (
        <div className="mb-3">
          <span className="rounded-full border border-[rgba(0,118,255,.28)] bg-[rgba(0,118,255,.13)] px-3 py-1 text-[11.5px] font-bold uppercase tracking-[.06em] text-accent-blue">
            {category}
          </span>
        </div>
      )}
      <h3 className="mb-2.5 text-[19px] font-extrabold leading-[1.28] tracking-[-.018em]">
        <Link className="hover:text-accent-blue" href={href}>
          {post.title}
        </Link>
      </h3>
      {post.excerpt && (
        <p className="mb-5 line-clamp-3 text-[15px] leading-relaxed text-white/70">
          {post.excerpt}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] pt-[18px] text-[12.5px] text-white/70">
        <span>{published}</span>
        {post.readingTime && <span>{post.readingTime} min read</span>}
      </div>
    </article>
  );
}
