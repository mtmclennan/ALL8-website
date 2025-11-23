import { sanity } from '@/lib/sanity/sanityClient';
import { singlePostQuery } from '@/lib/sanity/queries';
import BlogPost from './BlogPost';
import StrongCTA from '@/app/(site)/components/CallToAction';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = await sanity.fetch(`*[_type == "post"].slug.current`);
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanity.fetch(singlePostQuery, { slug });
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage?.asset?.url ?? '/assets/images/og-default.webp',
          width: 1200,
          height: 630,
          alt: post.coverImage?.alt ?? post.title,
        },
      ],
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
