'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/app/studio/sanity/lib/image';
import type { Post as SanityPost } from '@/app/studio/sanity.types';

/**
 * Query-result type for singlePostQuery:
 * - In Sanity schema, `author` is a reference.
 * - In GROQ, you're projecting `author-> { name, image }`.
 * So we override the schema type to match the query result.
 */
export type SinglePost = Omit<SanityPost, 'author'> & {
  author?: {
    name: string;
    image?: unknown;
  };
};

type BlogPostProps = { post: SinglePost };

export default function BlogPost({ post }: BlogPostProps) {
  const heroSrc =
    (post.coverImage
      ? urlFor(post.coverImage).width(1920).height(1080).url()
      : null) ?? '/assets/images/og/ALL8_Webworks_blog.jpg';

  const heroAlt = post.coverImage?.alt || post.title || 'Blog post cover';

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const components: PortableTextComponents = {
    types: {
      image: ({ value }) => {
        // Sanity portable text images usually come through as an image object with an asset ref.
        // urlFor handles that correctly.
        const src = value?.asset ? urlFor(value).width(1400).url() : null;
        if (!src) return null;

        const alt = value?.alt || '';

        return (
          <figure className="my-12">
            <img
              src={src}
              alt={alt}
              className="rounded-2xl shadow-lg w-full h-auto"
              loading="lazy"
            />
            {/* Optional caption support if you store it */}
            {value?.caption ? (
              <figcaption className="mt-3 text-sm text-neutral-400">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href as string | undefined;
        const isExternal = href ? /^https?:\/\//i.test(href) : false;

        return (
          <a
            href={href || '#'}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <article className="relative isolate pb-16">
      {/* HERO SECTION */}
      <section className="relative isolate text-white min-h-[350px] md:min-h-[400px] bg-blueprint bg-primary/5 flex flex-col justify-end pt-18 pb-10 md:pb-24">
        {/* Background grid + glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-primary/90 to-transparent dark:from-blue-900/10" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-5xl text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl/14 font-bold mb-6"
          >
            {post.title}
          </motion.h1>
        </div>
      </section>

      {/* Overlapping hero image */}
      <div className="relative z-10 -translate-y-10 md:-translate-y-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl"
        >
          <Image
            src={heroSrc}
            alt={heroAlt}
            width={1920}
            height={1080}
            className="object-cover w-full h-auto"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/70" />
        </motion.div>

        {post.excerpt ? (
          <p className="text-neutral-300 px-4 italic text-lg max-w-2xl mt-10 mx-auto">
            {post.excerpt}
          </p>
        ) : null}
      </div>

      {/* MAIN ARTICLE BODY */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-20 max-w-3xl mx-auto px-6"
      >
        {/* Meta info */}
        <div className="text-sm text-neutral-400 mb-10 border-b border-white/10 pb-6">
          <p>
            {publishedLabel ? (
              <>
                Published {publishedLabel}
                {post.author?.name ? (
                  <>
                    {' '}
                    • Written by{' '}
                    <span className="text-white font-medium">
                      {post.author.name}
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                {post.author?.name ? (
                  <>
                    Written by{' '}
                    <span className="text-white font-medium">
                      {post.author.name}
                    </span>
                  </>
                ) : (
                  ' '
                )}
              </>
            )}
          </p>
        </div>

        {/* Main content */}
        <div
          className="prose prose-lg prose-invert max-w-none
          prose-headings:font-semibold prose-headings:text-white
          prose-p:mt-0
          prose-h2:mt-16 prose-h2:mb-6 prose-h3:mt-12 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:my-6 prose-h4:mt-10 prose-h4:mb-2
          prose-h4:text-xl
          prose-li:my-2 prose-ul:my-6 prose-ol:my-6
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500/50 prose-blockquote:pl-6 prose-blockquote:text-neutral-300
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          prose-img:rounded-2xl prose-img:shadow-lg
          prose-hr:border-white/10"
        >
          {post.body ? (
            <PortableText value={post.body} components={components} />
          ) : null}
        </div>
      </motion.div>
    </article>
  );
}
