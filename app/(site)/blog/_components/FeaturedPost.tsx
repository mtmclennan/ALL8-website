import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  Section,
} from '@/app/(site)/_components/SectionWrapper';
import { urlFor } from '@/app/studio/sanity/lib/image';
import type { BlogIndexPost } from './BlogTopicSections';

type FeaturedPostsProps = {
  posts: BlogIndexPost[];
  title?: string;
};

function getAuthorName(author: BlogIndexPost['author']) {
  if (!author) return null;
  if (typeof author === 'string') return author;

  return author.name ?? null;
}

function getCoverAlt(post: BlogIndexPost) {
  const coverImage = post.coverImage;

  if (
    coverImage &&
    typeof coverImage === 'object' &&
    'alt' in coverImage &&
    typeof coverImage.alt === 'string'
  ) {
    return coverImage.alt;
  }

  return post.title ?? 'Featured blog article';
}

function formatDate(value?: string) {
  if (!value) return null;

  return new Date(value).toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function FeaturedPosts({
  posts,
  title = 'Featured Article',
}: FeaturedPostsProps) {
  const featured = posts[0];

  if (!featured?.slug?.current || !featured.title) return null;

  const imageUrl = featured.coverImage ? urlFor(featured.coverImage).url() : null;
  const authorName = getAuthorName(featured.author);
  const published = formatDate(featured.publishedAt);

  return (
    <Section className="relative z-20 pb-28" pattern="none" tone="alt">
      <div className="-mb-[140px] -translate-y-[140px] md:-mb-[185px] md:-translate-y-[185px]">
        <Card
          className="mx-auto max-w-6xl overflow-hidden relative z-30 supports-[backdrop-filter]:backdrop-blur-md"
          variant="bordered"
        >
          <Link className="block" href={`/blog/${featured.slug.current}`}>
            <div className="relative z-30 px-6 py-6 sm:px-12 sm:pt-12">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                {title}
              </p>
              <h2 className="mb-4 text-3xl font-semibold tracking-tight transition group-hover:text-brand-blue sm:text-4xl">
                {featured.title}
              </h2>

              {featured.excerpt ? (
                <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-foreground/70">
                  {featured.excerpt}
                </p>
              ) : null}

              {published || authorName ? (
                <p className="text-sm text-foreground/50">
                  {published}
                  {published && authorName ? ' - ' : null}
                  {authorName ? (
                    <span className="text-foreground">By {authorName}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
            {imageUrl ? (
              <div className="relative h-64 rounded-2xl md:h-130">
                <Image
                  alt={getCoverAlt(featured)}
                  className="rounded-2xl object-cover"
                  fill
                  src={imageUrl}
                />
              </div>
            ) : null}
          </Link>
        </Card>
      </div>
    </Section>
  );
}
