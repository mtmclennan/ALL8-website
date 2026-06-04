import { client as sanity } from '@/app/studio/sanity/lib/client';
import {
  allPostsQuery,
  blogPageQuery,
} from '@/app/studio/sanity/lib/queries';
import { urlFor } from '@/app/studio/sanity/lib/image';
import { siteUrl } from '@/config/site.config';
import StrongCTA from '../_components/CallToAction';
import ServicesOverviewRefactored from '../_components/Services';
import BlogHero from './_components/BlogHero';
import BlogTopicSections, {
  type BlogIndexPost,
} from './_components/BlogTopicSections';
import FeaturedPosts from './_components/FeaturedPost';
import LatestPosts from './_components/LatestPosts';

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await sanity.fetch(blogPageQuery);
  const canonical = `${siteUrl()}/blog`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: page.title,
      description: page.description,
      images: page.ogImage
        ? [
            {
              url: urlFor(page.ogImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
  };
}

export default async function BlogIndexPage() {
  const [page, posts] = await Promise.all([
    sanity.fetch(blogPageQuery),
    sanity.fetch<BlogIndexPost[]>(allPostsQuery),
  ]);

  return (
    <div className="relative">
      <BlogHero />
      <FeaturedPosts posts={posts} title={page?.featuredTitle} />
      <BlogTopicSections posts={posts} />
      <LatestPosts posts={posts} />
      <ServicesOverviewRefactored
        title="Services Built for Performance"
        subtitle="Your business doesn't need another pretty website. You need one that loads fast, ranks high, and actually brings in customers. Every service here is engineered to do exactly that."
      />
      <StrongCTA
        ctaHref="/services/performance-tune-up"
        ctaLabel={page?.cta?.ctaLabel ?? 'Get My Free Website Audit'}
        highlight={page?.cta?.highlight ?? 'Performs'}
        microText={
          page?.cta?.microText ??
          'No long contracts - Clear reporting - Built for speed & conversions'
        }
        subtitle={
          page?.cta?.subtitle ??
          "Most contractor and service websites look good on the surface but run like a worn-out work truck. Slow, unoptimized, and costing you leads every single day. Let's fix that."
        }
        titlePrefix={page?.cta?.titlePrefix ?? 'Get a Website That '}
        titleSuffix={page?.cta?.titleSuffix ?? 'Like It Should'}
      />
    </div>
  );
}
