import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { notFound } from "next/navigation";

import PostCard from "../../_components/PostCard";

import { client as sanity } from "@/app/studio/sanity/lib/client";
import {
  categoryPostsQuery,
  categorySlugsQuery,
} from "@/app/studio/sanity/lib/queries";
import { Section } from "@/app/(site)/_components/SectionWrapper";
import StrongCTA from "@/app/(site)/_components/CallToAction";
import { siteUrl } from "@/config/site.config";

type CategoryArchivePost = {
  _id: string;
  title?: string;
  slug?: {
    current?: string;
  };
  excerpt?: string;
  coverImage?: SanityImageSource;
  publishedAt?: string;
  _updatedAt?: string;
  author?: string;
};

type CategoryArchive = {
  _updatedAt?: string;
  title?: string;
  description?: string;
  slug?: string;
  posts?: CategoryArchivePost[];
};

const CATEGORY_SERVICE_CTA: Record<
  string,
  {
    href: string;
    label: string;
    highlight: string;
  }
> = {
  "contractor-websites": {
    href: "/services/websites-that-convert",
    label: "Explore Websites That Convert",
    highlight: "convert",
  },
  "website-strategy": {
    href: "/services/websites-that-convert",
    label: "Explore Website Strategy",
    highlight: "convert",
  },
  "local-seo": {
    href: "/services/local-seo-foundation",
    label: "Explore Local SEO Foundation",
    highlight: "found",
  },
  "google-business-profile": {
    href: "/services/google-business-profile-optimization",
    label: "Improve My Google Business Profile",
    highlight: "visible",
  },
  "website-performance": {
    href: "/services/performance-tune-up",
    label: "Book a Performance Tune-Up",
    highlight: "faster",
  },
  "lead-generation": {
    href: "/services/performance-tune-up",
    label: "Improve Website Lead Flow",
    highlight: "leads",
  },
  "case-studies": {
    href: "/contact",
    label: "Talk Through My Website",
    highlight: "next",
  },
};

function getIntroCopy(category: CategoryArchive) {
  return (
    category.description ??
    `Browse ALL8 Webworks articles about ${category.title ?? "this topic"}, including practical website, SEO, and conversion advice for contractors and service businesses.`
  );
}

function getServiceCta(category: CategoryArchive) {
  const slug = category.slug ?? "";

  return (
    CATEGORY_SERVICE_CTA[slug] ?? {
      href: "/services/performance-tune-up",
      label: "Book a Website Review",
      highlight: "better",
    }
  );
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await sanity.fetch<string[]>(categorySlugsQuery);

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanity.fetch<CategoryArchive | null>(
    categoryPostsQuery,
    { slug },
  );

  if (!category) return {};

  const title = `${category.title ?? "Category"} Articles | ALL8 Webworks`;
  const description =
    category.description ??
    `Browse ALL8 Webworks blog articles in the ${category.title ?? "selected"} category.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl()}/blog/category/${slug}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await sanity.fetch<CategoryArchive | null>(
    categoryPostsQuery,
    { slug },
  );

  if (!category) notFound();

  const posts = category.posts ?? [];
  const cta = getServiceCta(category);

  return (
    <>
      <Section className="pt-32" pattern="dots" tone="alt">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
            ALL8 Webworks Blog
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            {category.title ?? "Category"} Articles
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
            {getIntroCopy(category)}
          </p>
        </div>
        {posts.length ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-2xl text-center text-foreground/70">
            No articles have been published in this category yet.
          </p>
        )}
      </Section>
      <StrongCTA
        ctaHref={cta.href}
        ctaLabel={cta.label}
        highlight={cta.highlight}
        microText="No long contracts - Clear reporting - Built for local service businesses"
        subtitle={`Turn ${category.title ?? "blog"} insights into a faster, clearer website that helps more visitors become real inquiries.`}
        titlePrefix="Ready to make this work "
        titleSuffix="on your site?"
      />
    </>
  );
}
