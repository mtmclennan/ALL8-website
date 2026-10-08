import type { BlogIndexPost } from "./BlogTopicSections";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CoverFallback from "./CoverFallback";

import { urlFor } from "@/app/studio/sanity/lib/image";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";
import { getCoverImageAlt } from "@/lib/blogImage";
import { formatPostDate } from "@/lib/blogDate";
import { formatCategoryLabel } from "@/lib/blogTaxonomy";

type FeaturedPostProps = {
  posts: BlogIndexPost[];
  title?: string;
};

export default function FeaturedPost({
  posts,
  title = "Latest article",
}: FeaturedPostProps) {
  const post = posts[0];

  if (!post?.slug?.current || !post.title) return null;

  const href = `/blog/${canonicalBlogSlug(post.slug.current)}`;
  const published = formatPostDate(post.publishedAt, "long");
  const minutes = post.readingTime;
  const categoryData = post.categories?.[0];
  const category = formatCategoryLabel(categoryData?.title, categoryData?.slug);
  // Sanity can return an empty string, which would leave an orphan separator.
  const label = title?.trim() || "Latest article";

  return (
    <Link
      className="group mb-[52px] grid grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.036] transition-colors hover:border-[rgba(0,118,255,.32)] hover:bg-white/[0.058] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue lg:grid-cols-[1.1fr_.9fr]"
      href={href}
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden border-b border-white/[0.08] bg-content3 lg:order-last lg:aspect-auto lg:h-full lg:min-h-[320px] lg:border-b-0 lg:border-l">
        {post.coverImage ? (
          <Image
            fill
            priority
            alt={getCoverImageAlt(post.coverImage, post.title)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
            sizes="(min-width: 1160px) 490px, (min-width: 1024px) 42vw, calc(100vw - 3rem)"
            src={urlFor(post.coverImage)
              .width(1200)
              .height(630)
              .fit("crop")
              .url()}
          />
        ) : (
          <CoverFallback label={category} />
        )}
      </div>
      <div className="flex flex-col p-7 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-white/70">
          <span className="font-bold uppercase tracking-[.08em] text-accent-blue">
            {label}
          </span>
          {label && category && <span aria-hidden="true">·</span>}
          {category && <span>{category}</span>}
        </div>
        <h2 className="mb-3.5 text-[clamp(26px,2.9vw,38px)] font-extrabold leading-[1.1] tracking-[-.026em] transition-colors group-hover:text-accent-blue">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-5 line-clamp-4 text-[16.5px] leading-relaxed text-white/70">
            {post.excerpt}
          </p>
        )}
        {(published || minutes) && (
          <p className="mb-5 text-[13px] text-white/60">
            {published && <time dateTime={post.publishedAt}>{published}</time>}
            {published && minutes ? " · " : null}
            {minutes ? `${minutes} min read` : null}
          </p>
        )}
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-[14.5px] font-bold text-accent-blue">
          Read the article
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
            size={14}
            strokeWidth={2.5}
          />
        </span>
      </div>
    </Link>
  );
}
