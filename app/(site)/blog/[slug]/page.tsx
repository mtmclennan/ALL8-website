import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ArticleJsonLd from "../_components/ArticleJsonLd";
import RelatedArticles from "../_components/RelatedArticles";
import RelatedServices from "../_components/RelatedServices";

import BlogPost, { type SinglePost } from "./BlogPost";

import { client as sanity } from "@/app/studio/sanity/lib/client";
import {
  publishedPostSlugsQuery,
  relatedPostsQuery,
  singlePostQuery,
} from "@/app/studio/sanity/lib/queries";
import {
  selectRelatedPosts,
  type RelatedPostsSource,
} from "@/app/studio/sanity/lib/relatedPosts";
import { selectRelatedServices } from "@/lib/relatedServices";
import FinalCta from "@/app/(site)/_components/home/FinalCta";
import { siteUrl } from "@/config/site.config";
import { urlFor } from "@/app/studio/sanity/lib/image";
import { buildPageMetadata, withBrandSuffix } from "@/lib/seo/metadata";
import {
  canonicalBlogSlug,
  sourceBlogSlug,
} from "@/config/permanent-redirects.mjs";
import { canonicalizePortableTextLinks } from "@/lib/seo/canonicalizePortableTextLinks";

// REVALIDATE BLOG POSTS AUTOMATICALLY
export const revalidate = 3600; // 1 hour — safe default

export async function generateStaticParams() {
  const slugs = await sanity.fetch<string[]>(publishedPostSlugsQuery);

  return slugs.map((slug) => ({ slug: canonicalBlogSlug(slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sourceSlug = sourceBlogSlug(slug);
  const slugs = [...new Set([sourceSlug, canonicalBlogSlug(slug)])];

  const post = await sanity.fetch(singlePostQuery, { slugs });

  if (!post) return {};

  const canonicalSlug = canonicalBlogSlug(slug);
  const path = `/blog/${canonicalSlug}`;

  const shareImage = post.seo?.ogImage || post.coverImage;
  const ogImage = shareImage
    ? urlFor(shareImage).width(1200).height(630).fit("crop").format("jpg").url()
    : `${siteUrl()}/assets/images/og/og-default.jpg`;
  const twitterImage = post.seo?.twitterImage
    ? urlFor(post.seo.twitterImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .format("jpg")
        .url()
    : ogImage;

  const title = withBrandSuffix(post.seo?.metaTitle || post.title);
  const description = post.seo?.metaDescription || post.excerpt;

  return buildPageMetadata({
    title,
    description,
    path,
    canonicalUrl:
      canonicalSlug === sourceSlug ? post.seo?.canonicalUrl : undefined,
    type: "article",
    image: ogImage,
    twitterImage,
    imageAlt: shareImage?.alt ?? post.title,
    openGraphTitle: post.seo?.ogTitle || post.title,
    openGraphDescription: post.seo?.ogDescription || description,
    noindex: post.seo?.noIndex,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sourceSlug = sourceBlogSlug(slug);
  const slugs = [...new Set([sourceSlug, canonicalBlogSlug(slug)])];
  const [post, relatedPostsSource] = await Promise.all([
    sanity.fetch<SinglePost | null>(singlePostQuery, { slugs }),
    sanity.fetch<RelatedPostsSource | null>(relatedPostsQuery, {
      slugs,
    }),
  ]);

  if (!post) notFound();

  const canonicalPost = {
    ...post,
    body: canonicalizePortableTextLinks(post.body),
  };

  const relatedPosts = selectRelatedPosts(relatedPostsSource);
  const relatedServices = selectRelatedServices(relatedPostsSource);

  return (
    <>
      <ArticleJsonLd post={canonicalPost} slug={canonicalBlogSlug(slug)} />
      <BlogPost post={canonicalPost} siteOrigin={siteUrl()} />
      <RelatedServices services={relatedServices} />
      <RelatedArticles articles={relatedPosts} />
      <FinalCta
        data={{
          eyebrow: "Free Lead System Review",
          title: "Find Out Where You're",
          titleAccent: "Losing the Work.",
          subtitle:
            "Fifteen minutes on the path a customer takes from search to contact to follow-up. We'll show you where the biggest gaps appear to be, and what we'd fix first.",
          ctaLabel: "Get My Free Lead System Review",
          micro:
            "No long-term commitment  ·  Clear recommendations  ·  Fixed scope before work begins",
          secondary: { label: "Or just text us", href: "/contact" },
        }}
      />
    </>
  );
}
