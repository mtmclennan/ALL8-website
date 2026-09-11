"use client";

import type { BlogIndexPost } from "./BlogTopicSections";

import { useMemo, useState } from "react";

import PostCard from "./PostCard";

import {
  BLOG_TOPICS,
  postMatchesBlogTopic,
  type BlogTopicSlug,
} from "@/lib/blogTaxonomy";

export default function PostsFilterGrid({ posts }: { posts: BlogIndexPost[] }) {
  const [active, setActive] = useState<string>("all");

  const topics = useMemo(() => {
    return BLOG_TOPICS.filter((topic) =>
      posts.some((post) => postMatchesBlogTopic(post, topic.slug)),
    );
  }, [posts]);

  const filtered = useMemo(() => {
    if (active === "all") return posts;

    return posts.filter((post) =>
      postMatchesBlogTopic(post, active as BlogTopicSlug),
    );
  }, [posts, active]);

  if (!posts.length) return null;

  return (
    <div>
      {topics.length > 0 && (
        <div
          aria-label="Filter articles by topic"
          className="mb-11 flex flex-wrap gap-2.5"
        >
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
          {topics.map((topic) => (
            <button
              key={topic.slug}
              className={
                active === topic.slug
                  ? "min-h-[42px] rounded-full border border-[rgba(0,118,255,.42)] bg-[rgba(0,118,255,.13)] px-4 py-2.5 text-[13.5px] font-semibold text-[#cfe4ff]"
                  : "min-h-[42px] rounded-full border border-white/[0.08] bg-white/[0.036] px-4 py-2.5 text-[13.5px] font-semibold text-white/70 hover:text-white"
              }
              type="button"
              onClick={() => setActive(topic.slug)}
            >
              {topic.title}
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
