'use client';

import {
  LazyMotion,
  domAnimation,
  motion,
  useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '../../components/SectionWrapper';
import { urlFor } from '@/app/studio/sanity/lib/image';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const prefersReduced = useReducedMotion();
  const cover = urlFor(post.coverImage);

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        whileHover={prefersReduced ? {} : { rotateX: -3, rotateY: 3 }}
        className="group relative min-h-[450px]"
      >
        <Card
          variant="elevated"
          className="transition-all duration-300 group-hover:shadow-xl h-full"
        >
          <Link href={`/blog/${post.slug.current}`} className="block h-full">
            <div className="rounded-2xl border border-foreground/10 bg-background/70 backdrop-blur-sm overflow-hidden h-full">
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {cover && (
                  <Image
                    src={cover.url()}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    className="object-cover object-center transition-all duration-700 
                               group-hover:scale-[1.06]"
                  />
                )}

                <div
                  className="absolute inset-0 bg-gradient-to-b 
                                from-transparent to-black/40 opacity-70"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-semibold leading-tight 
                               group-hover:text-primary transition mb-1.5"
                >
                  {post.title}
                </h3>

                <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <p className="text-sm text-foreground/40">
                  {new Date(post.publishedAt).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Hover underline (same as ProcessSection) */}
                <div
                  className="mt-4 h-px w-0 bg-gradient-to-r 
                                from-[var(--from,_#0047bb)] 
                                to-[var(--to,_#D33F49)]
                                transition-all duration-300 
                                group-hover:w-full"
                />
              </div>
            </div>
          </Link>
        </Card>
      </motion.div>
    </LazyMotion>
  );
}
