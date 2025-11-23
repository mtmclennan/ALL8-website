import Image from 'next/image';
import Link from 'next/link';
import {
  Section,
  SectionHeader,
  Card,
} from '@/app/(site)/components/SectionWrapper';
import { urlFor } from '@/lib/sanity/imageBuilder';

export default function FeaturedPosts({ posts }: { posts: any[] }) {
  const featured = posts[0]; // only the first post
  console.log(featured);

  const imageUrl = urlFor(featured.coverImage);

  if (!featured) return null;

  return (
    <Section
      tone="alt"
      pattern="none"
      className="relative z-20 pb-28" // overlap into hero
      //   noPad={true}
    >
      <div className="-translate-y-[140px] md:-translate-y-[185px] -mb-[140px] md:-mb-[185px]">
        <Card
          variant="bordered"
          className="max-w-6xl mx-auto overflow-hidden relative z-30 
                  supports-[backdrop-filter]:backdrop-blur-md"
        >
          <Link href={`/blog/${featured.slug.current}`}>
            {/* Featured Label */}

            {/* Content */}
            <div className=" px-6 py-4 sm:px-12 sm:pt-12 pb-4 relative z-30">
              <h3 className="text-4xl font-semibold mb-4 tracking-tight group-hover:text-brand-blue transition">
                {featured.title}
              </h3>

              <p className="text-foreground/70 text-lg leading-relaxed mb-6 line-clamp-3">
                {featured.excerpt}
              </p>

              <p className="text-sm text-foreground/50">
                {new Date(featured.publishedAt).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {featured.author?.name && (
                  <>
                    {' '}
                    • By{' '}
                    <span className="text-foreground">
                      {featured.author.name}
                    </span>
                  </>
                )}
              </p>
            </div>
            {/* Cover Image */}
            {imageUrl && (
              <div className="relative h-64 md:h-130 rounded-2xl">
                <Image
                  src={imageUrl.url()}
                  alt={featured.coverImage.alt || featured.title}
                  fill
                  className="rounded-2xl"
                />
              </div>
            )}
          </Link>
        </Card>
      </div>
    </Section>
  );
}
