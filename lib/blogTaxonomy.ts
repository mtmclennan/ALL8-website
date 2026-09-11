export type BlogTopicPost = {
  title?: string;
  excerpt?: string;
  slug?: { current?: string };
  tags?: string[];
  categories?: Array<{ title?: string; slug?: string }>;
};

export const BLOG_TOPICS = [
  {
    slug: "search-visibility",
    title: "Search Visibility",
    keywords: [
      "local seo",
      "seo",
      "google maps",
      "business profile",
      "search visibility",
      "search ranking",
      "chatgpt",
      "ai seo",
    ],
  },
  {
    slug: "websites-conversion",
    title: "Websites & Conversion",
    keywords: [
      "website",
      "web development",
      "web performance",
      "conversion",
      "service page",
      "user experience",
      "traffic",
      "performance",
    ],
  },
  {
    slug: "lead-systems-operations",
    title: "Lead Systems & Operations",
    keywords: [
      "lead generation",
      "lead system",
      "systems & operations",
      "systems and operations",
      "workflow",
      "process improvement",
      "digital strategy",
      "small business insights",
    ],
  },
] as const;

export type BlogTopicSlug = (typeof BLOG_TOPICS)[number]["slug"];

function postSearchText(post: BlogTopicPost) {
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

export function postMatchesBlogTopic(
  post: BlogTopicPost,
  topicSlug: BlogTopicSlug,
) {
  const topic = BLOG_TOPICS.find((item) => item.slug === topicSlug);

  if (!topic) return false;

  const searchText = postSearchText(post);

  return topic.keywords.some((keyword) => searchText.includes(keyword));
}

export function formatCategoryLabel(title?: string, slug?: string) {
  if (slug === "ai-seo" || title?.trim().toLowerCase() === "ai seo") {
    return "AI SEO";
  }

  return title;
}
