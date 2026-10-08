import type { BlogIndexPost } from "./BlogTopicSections";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import CoverFallback from "./CoverFallback";

import { urlFor } from "@/app/studio/sanity/lib/image";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";
import { formatCategoryLabel } from "@/lib/blogTaxonomy";
import { getCoverImageAlt } from "@/lib/blogImage";
import { formatPostDate } from "@/lib/blogDate";

type PostCardProps = {
  post: BlogIndexPost;
  /** Heading level for the card title; related-article grids sit under an h2. */
  headingLevel?: "h2" | "h3";
};

export default function PostCard({ post, headingLevel = "h3" }: PostCardProps) {
  if (!post.slug?.current || !post.title) return null;

  const href = `/blog/${canonicalBlogSlug(post.slug.current)}`;
  const published = formatPostDate(post.publishedAt);
  const categoryData = post.categories?.[0];
  const category = formatCategoryLabel(categoryData?.title, categoryData?.slug);
  const Heading = headingLevel;

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.036] transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-[3px] hover:border-[rgba(0,118,255,.3)] hover:bg-white/[0.058] hover:shadow-[0_20px_46px_-16px_rgba(0,0,0,.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue motion-reduce:hover:translate-y-0"
      href={href}
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden border-b border-white/[0.06] bg-content3">
        {post.coverImage ? (
          <Image
            fill
            alt={getCoverImageAlt(post.coverImage, post.title)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:group-hover:scale-100"
            sizes="(min-width: 1160px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 3rem)"
            src={urlFor(post.coverImage)
              .width(900)
              .height(473)
              .fit("crop")
              .url()}
          />
        ) : (
          <CoverFallback label={category} />
        )}
      </div>
      <article className="flex flex-1 flex-col p-6">
        {category && (
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[.08em] text-accent-blue">
            {category}
          </p>
        )}
        <Heading className="mb-2.5 line-clamp-3 text-[19px] font-extrabold leading-[1.28] tracking-[-.018em] transition-colors group-hover:text-accent-blue">
          {post.title}
        </Heading>
        {post.excerpt && (
          <p className="mb-5 line-clamp-2 text-[15px] leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 text-[13px] text-white/60">
          <span>
            {published && <time dateTime={post.publishedAt}>{published}</time>}
            {published && post.readingTime ? " · " : null}
            {post.readingTime ? `${post.readingTime} min read` : null}
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-accent-blue">
            Read
            <ArrowRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
              size={14}
              strokeWidth={2.5}
            />
          </span>
        </div>
      </article>
    </Link>
  );
}
