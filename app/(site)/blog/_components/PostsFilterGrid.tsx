"use client";

import type { BlogIndexPost } from "./BlogTopicSections";

import { useMemo, useState } from "react";

import PostCard from "./PostCard";

export default function PostsFilterGrid({ posts }: { posts: BlogIndexPost[] }) {
  const [active, setActive] = useState<string>("all");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();

    for (const post of posts) {
      for (const c of post.categories ?? []) {
        if (c.title && c.slug && !seen.has(c.slug)) seen.set(c.slug, c.title);
      }
    }

    return Array.from(seen, ([slug, title]) => ({ slug, title }));
  }, [posts]);

  const filtered = useMemo(() => {
    if (active === "all") return posts;

    return posts.filter((post) =>
      post.categories?.some((c) => c.slug === active),
    );
  }, [posts, active]);

  if (!posts.length) return null;

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-11 flex flex-wrap gap-2.5">
          <button
            className={
              active === "all"
                ? "min-h-[42px] rounded-full border border-[rgba(0,118,255,.42)] bg-[rgba(0,118,255,.13)] px-4 py-2.5 text-[13.5px] font-semibold text-[#cfe4ff]"
                : "min-h-[42px] rounded-full border border-white/[0.08] bg-white/[0.036] px-4 py-2.5 text-[13.5px] font-semibold text-white/70 hover:text-white"
            }
            type="button"
            onClick={() => setActive("all")}
          >
            All posts
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={
                active === c.slug
                  ? "min-h-[42px] rounded-full border border-[rgba(0,118,255,.42)] bg-[rgba(0,118,255,.13)] px-4 py-2.5 text-[13.5px] font-semibold text-[#cfe4ff]"
                  : "min-h-[42px] rounded-full border border-white/[0.08] bg-white/[0.036] px-4 py-2.5 text-[13.5px] font-semibold text-white/70 hover:text-white"
              }
              type="button"
              onClick={() => setActive(c.slug)}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-white/70">No posts in this category yet.</p>
      )}
    </div>
  );
}
