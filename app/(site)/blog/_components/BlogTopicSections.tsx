import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import Link from "next/link";

import { Card, Section, SectionHeader } from "../../_components/SectionWrapper";

import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";

export type BlogIndexPost = {
  _id: string;
  title?: string;
  slug?: {
    current?: string;
  };
  excerpt?: string;
  coverImage?: SanityImageSource;
  publishedAt?: string;
  readingTime?: number;
  tags?: string[];
  author?:
    | string
    | {
        name?: string;
      };
  categories?: Array<{
    title?: string;
    slug?: string;
  }>;
};

type TopicRule = {
  title: string;
  description: string;
  keywords: string[];
  archiveKeywords: string[];
};

type TopicSection = TopicRule & {
  posts: BlogIndexPost[];
  archive?: {
    title: string;
    href: string;
  };
};

type BlogTopicSectionsProps = {
  posts: BlogIndexPost[];
};

const TOPIC_RULES: TopicRule[] = [
  {
    title: "Contractor Websites",
    description:
      "Website strategy, service pages, and trust-building content for contractors and service businesses.",
    keywords: [
      "contractor",
      "contractor website",
      "website",
      "service page",
      "trades",
      "service business",
    ],
    archiveKeywords: ["contractor", "website", "small business"],
  },
  {
    title: "Local SEO",
    description:
      "Practical local search guidance for getting found in the markets you actually serve.",
    keywords: ["local seo", "seo", "ranking", "rank", "search", "google"],
    archiveKeywords: ["local seo", "seo"],
  },
  {
    title: "Google Business Profile",
    description:
      "Advice for improving Maps visibility, profile quality, and local trust signals.",
    keywords: [
      "google business profile",
      "business profile",
      "google maps",
      "maps",
      "gbp",
    ],
    archiveKeywords: ["google business profile", "maps", "gbp"],
  },
  {
    title: "Website Performance",
    description:
      "Speed, UX, and conversion tuning for sites that need to turn traffic into action.",
    keywords: [
      "performance",
      "speed",
      "fast",
      "v8",
      "load",
      "tune-up",
      "conversion",
    ],
    archiveKeywords: ["performance", "speed"],
  },
  {
    title: "Lead Generation",
    description:
      "How to turn qualified visitors into calls, quote requests, and booked jobs.",
    keywords: [
      "lead",
      "leads",
      "conversion",
      "converting",
      "traffic",
      "marketing",
      "booked",
      "calls",
    ],
    archiveKeywords: ["lead", "marketing", "conversion"],
  },
  {
    title: "Case Studies",
    description:
      "Real examples and breakdowns from local search, AI visibility, and website improvements.",
    keywords: ["case study", "real local case", "example", "chatgpt"],
    archiveKeywords: ["case study", "ai seo"],
  },
];

function normalize(value?: string) {
  return value?.toLowerCase() ?? "";
}

function getPostHref(post: BlogIndexPost) {
  return post.slug?.current
    ? `/blog/${canonicalBlogSlug(post.slug.current)}`
    : null;
}

function getHeadingId(title: string) {
  return `blog-topic-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function getSearchText(post: BlogIndexPost) {
  return [
    post.title,
    post.excerpt,
    post.slug?.current,
    ...(post.tags ?? []),
    ...(post.categories ?? []).flatMap((category) => [
      category.title,
      category.slug,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getArchive(posts: BlogIndexPost[], rule: TopicRule) {
  for (const post of posts) {
    for (const category of post.categories ?? []) {
      const categoryText = normalize(
        `${category.title ?? ""} ${category.slug ?? ""}`,
      );
      const matches = rule.archiveKeywords.some((keyword) =>
        categoryText.includes(keyword),
      );

      if (matches && category.title && category.slug) {
        return {
          title: category.title,
          href: `/blog/category/${category.slug}`,
        };
      }
    }
  }

  return null;
}

function getTopicSections(posts: BlogIndexPost[]) {
  return TOPIC_RULES.map<TopicSection | null>((rule) => {
    const selected = posts
      .filter((post) => {
        const href = getPostHref(post);

        if (!href) return false;

        const searchText = getSearchText(post);

        return rule.keywords.some((keyword) => searchText.includes(keyword));
      })
      .slice(0, 3);

    if (!selected.length) return null;

    return {
      ...rule,
      posts: selected,
      archive: getArchive(posts, rule) ?? undefined,
    };
  }).filter((section): section is TopicSection => section !== null);
}

function formatDate(value?: string) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogTopicSections({ posts }: BlogTopicSectionsProps) {
  const sections = getTopicSections(posts);

  if (!sections.length) return null;

  return (
    <Section pattern="grid" tone="base">
      <SectionHeader
        center
        subtitle="Find articles by the business problem you are trying to solve, from faster sites to better local search visibility."
        title="Explore by Topic"
      />
      <div className="space-y-14">
        {sections.map((section) => (
          <section
            key={section.title}
            aria-labelledby={getHeadingId(section.title)}
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                  id={getHeadingId(section.title)}
                >
                  {section.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {section.description}
                </p>
              </div>
              {section.archive ? (
                <Link
                  className="text-sm font-medium text-primary transition hover:text-primary/80"
                  href={section.archive.href}
                >
                  View all {section.archive.title} articles
                </Link>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {section.posts.map((post) => {
                const href = getPostHref(post);
                const published = formatDate(post.publishedAt);

                if (!href || !post.title) return null;

                return (
                  <Card
                    key={`${section.title}-${post._id}`}
                    className="h-full p-5"
                    variant="elevated"
                  >
                    <Link className="block h-full" href={href}>
                      <article className="flex h-full flex-col">
                        {post.categories?.[0]?.title ? (
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                            {post.categories[0].title}
                          </p>
                        ) : null}
                        <h3 className="text-lg font-semibold leading-snug text-foreground transition hover:text-primary">
                          {post.title}
                        </h3>
                        {post.excerpt ? (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                            {post.excerpt}
                          </p>
                        ) : null}
                        {published ? (
                          <p className="mt-auto pt-5 text-xs text-foreground/45">
                            {published}
                          </p>
                        ) : null}
                      </article>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
