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
import { getBlogCanonicalUrl } from "@/lib/seo/blogCanonical";
import { articleRevisionMeta } from "@/lib/indexnow/publicPage";

// Posts published after the build can also enter ISR on first visit.
export const dynamic = "force-static";
export const revalidate = 3600;

const searchCaseStudyArticles = new Set([
  "local-seo-for-contractors-google-maps",
  "why-your-business-isn-t-showing-up-on-google-maps-and-it-s-not-what-you-think",
]);

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

  const post = await sanity.fetch<SinglePost | null>(singlePostQuery, { slugs });

  if (!post?.title) return {};

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
  const description = post.seo?.metaDescription || post.excerpt || post.title;

  const metadata = buildPageMetadata({
    title,
    description,
    path,
    canonicalUrl: getBlogCanonicalUrl(slug, post.seo?.canonicalUrl),
    type: "article",
    image: ogImage,
    twitterImage,
    imageAlt: shareImage?.alt ?? post.title,
    openGraphTitle: post.seo?.ogTitle || post.title,
    openGraphDescription: post.seo?.ogDescription || description,
    noindex: post.seo?.noIndex,
  });

  return { ...metadata, other: { [articleRevisionMeta]: post._rev } };
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
      <ArticleJsonLd
        canonical={getBlogCanonicalUrl(slug, post.seo?.canonicalUrl)}
        post={canonicalPost}
      />
      <BlogPost post={canonicalPost} siteOrigin={siteUrl()} />
      <RelatedServices
        services={relatedServices}
        showSearchCaseStudy={searchCaseStudyArticles.has(canonicalBlogSlug(slug))}
      />
      <RelatedArticles articles={relatedPosts} />
      <FinalCta
        data={{
          eyebrow: "Free Lead Leak Review",
          title: "Want This Checked",
          titleAccent: "in Your Business?",
          subtitle:
            "Send your business and website details. Matt will review the lead path and send specific findings on what to fix first. A short call afterward is optional.",
          ctaLabel: "Get My Free Lead Leak Review",
          micro:
            "Clear recommendations  ·  Fixed scope before work begins",
          secondary: { label: "View Pricing", href: "/pricing" },
          links: [{ label: "Explore services", href: "/services" }],
        }}
      />
    </>
  );
}
