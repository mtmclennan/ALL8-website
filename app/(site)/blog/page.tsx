import { sanity } from '@/lib/sanity/sanityClient';
import { allPostsQuery } from '@/lib/sanity/queries';
import BlogHero from './_components/BlogHero';
import FeaturedPosts from './_components/FeaturedPost';
import LatestPosts from './_components/LatestPosts';
import StrongCTA from '../components/CallToAction';
import ServicesOverviewRefactored from '../components/Services';
import { blogPageQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageBuilder';

export async function generateMetadata() {
  const page = await sanity.fetch(blogPageQuery);

  return {
    title: page.title,
    description: page.description,
    openGraph: {
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
  const posts = await sanity.fetch(allPostsQuery);
  console.log(posts);

  return (
    <div className="relative">
      <BlogHero />
      <FeaturedPosts posts={posts} />
      <LatestPosts posts={posts} />
      <StrongCTA
        titlePrefix="Get a Website That "
        highlight="Performs"
        titleSuffix="Like It Should"
        subtitle="Most contractor and service websites look good on the surface but run like a worn-out work truck. Slow, unoptimized, and costing you leads every single day. Let’s fix that."
        ctaLabel="Get My Free Website Audit"
        ctaHref="/contact"
        microText="No long contracts • Clear reporting • Built for speed & conversions"
      />
      <ServicesOverviewRefactored
        title="Services Built for Performance"
        subtitle="Your business doesn’t need another pretty website. You need one that loads fast, ranks high, and actually brings in customers. Every service here is engineered to do exactly that."
      />
    </div>
  );
}
