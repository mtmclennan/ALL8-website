import { client as sanity } from '@/app/studio/sanity/lib/client';
import {
  relatedPostsQuery,
  singlePostQuery,
} from '@/app/studio/sanity/lib/queries';
import {
  selectRelatedPosts,
  type RelatedPostsSource,
} from '@/app/studio/sanity/lib/relatedPosts';
import { selectRelatedServices } from '@/lib/relatedServices';
import ArticleBreadcrumbs from '../_components/ArticleBreadcrumbs';
import ArticleJsonLd from '../_components/ArticleJsonLd';
import BlogPost, { type SinglePost } from './BlogPost';
import RelatedArticles from '../_components/RelatedArticles';
import RelatedServices from '../_components/RelatedServices';
import StrongCTA from '@/app/(site)/_components/CallToAction';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteUrl } from '@/config/site.config';
import { urlFor } from '@/app/studio/sanity/lib/image';

// REVALIDATE BLOG POSTS AUTOMATICALLY
export const revalidate = 3600; // 1 hour — safe default

export async function generateStaticParams() {
  const slugs = await sanity.fetch(`*[_type == "post"].slug.current`);
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await sanity.fetch(singlePostQuery, { slug });
  if (!post) return {};

  const canonical = `${siteUrl()}/blog/${slug}`;

  const ogImage = post.coverImage
    ? urlFor(post.coverImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .format('jpg')
        .url()
    : `${siteUrl()}/assets/images/og-default.jpg`;

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;

  return {
    title,
    description,

    alternates: { canonical },

    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'ALL8 Webworks',
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.coverImage?.alt ?? post.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, relatedPostsSource] = await Promise.all([
    sanity.fetch<SinglePost | null>(singlePostQuery, { slug }),
    sanity.fetch<RelatedPostsSource | null>(relatedPostsQuery, { slug }),
  ]);
  if (!post) notFound();

  const relatedPosts = selectRelatedPosts(relatedPostsSource);
  const relatedServices = selectRelatedServices(relatedPostsSource);
  const primaryCategory = post.categories?.[0] ?? null;

  return (
    <>
      <ArticleJsonLd post={post} slug={slug} />
      <ArticleBreadcrumbs title={post.title} category={primaryCategory} />
      <BlogPost post={post} />
      <RelatedServices services={relatedServices} />
      <RelatedArticles articles={relatedPosts} />
      <StrongCTA
        titlePrefix="Your website deserves"
        highlight="full power"
        titleSuffix="— not excuses."
        subtitle="Get a site that runs like a finely tuned V8 engine."
        ctaLabel="Book a Free Website Review"
        ctaHref="/tune-up"
        microText="No long contracts • Transparent pricing • Built for performance"
      />
    </>
  );
}
