import { client as sanity } from '@/app/studio/sanity/lib/client';
import { singlePostQuery } from '@/app/studio/sanity/lib/queries';
import BlogPost from './BlogPost';
import StrongCTA from '@/app/(site)/components/CallToAction';
import type { Metadata } from 'next';
import { siteUrl } from '@/config/site.config';

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

  const canonical = `${siteUrl()}/blog/${slug}`;

  const ogImage = post.coverImage?.asset?.url
    ? post.coverImage.asset.url
    : `${siteUrl()}/assets/images/og-default.webp`;

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,

    alternates: {
      canonical,
    },

    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description: post.excerpt,
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
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await sanity.fetch(singlePostQuery, { slug });
  return (
    <>
      <BlogPost post={post} />
      <StrongCTA
        titlePrefix="Your website deserves"
        highlight="full power"
        titleSuffix="— not excuses."
        subtitle="Get a site that runs like a finely tuned V8 engine."
        ctaLabel="Book a Free Consultation"
        ctaHref="/contact"
        microText="No long contracts • Transparent pricing • Built for performance"
      />
    </>
  );
}
