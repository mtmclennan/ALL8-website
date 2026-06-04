import { urlFor } from '@/app/studio/sanity/lib/image';
import type { SinglePost } from '@/app/(site)/blog/[slug]/BlogPost';
import { site, siteUrl } from '@/config/site.config';

type ArticleJsonLdProps = {
  post: SinglePost;
  slug: string;
};

type BlogPostingJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline?: string;
  description?: string;
  image?: string[];
  datePublished?: string;
  dateModified?: string;
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    '@id': string;
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
};

function absoluteUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, siteUrl()).toString();
}

function safeJsonLd(data: BlogPostingJsonLd) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function ArticleJsonLd({ post, slug }: ArticleJsonLdProps) {
  const canonical = `${siteUrl()}/blog/${slug}`;
  const image = post.coverImage
    ? urlFor(post.coverImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .format('jpg')
        .url()
    : absoluteUrl(site.defaultOgImage);

  const schema: BlogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post._updatedAt || post.publishedAt,
    author: {
      '@type': post.author?.name ? 'Person' : 'Organization',
      name: post.author?.name || site.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl()}/#organization`,
      name: site.name,
      logo: site.defaultOgImage
        ? {
            '@type': 'ImageObject',
            url: absoluteUrl(site.defaultOgImage),
          }
        : undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    articleSection: post.categories?.[0]?.title,
  };

  return (
    <script
      id="blog-posting-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
