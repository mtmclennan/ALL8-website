export type RelatedArticle = {
  _id?: string;
  title?: string;
  slug?: {
    current?: string;
  };
  excerpt?: string;
  publishedAt?: string;
  category?: {
    title?: string;
    slug?: {
      current?: string;
    };
  };
};

type RelatedArticleCandidate = RelatedArticle & {
  categoryIds?: string[];
  tags?: string[];
};

export type RelatedPostsSource = {
  _id?: string;
  slug?: string;
  categoryIds?: string[];
  tags?: string[];
  manual?: RelatedArticleCandidate[];
  candidates?: RelatedArticleCandidate[];
};

const DEFAULT_RELATED_LIMIT = 3;

function hasCategoryOverlap(
  post: RelatedArticleCandidate,
  currentCategoryIds: Set<string>,
) {
  return post.categoryIds?.some((categoryId) =>
    currentCategoryIds.has(categoryId),
  );
}

function hasTagOverlap(
  post: RelatedArticleCandidate,
  currentTags: Set<string>,
) {
  return post.tags?.some((tag) => currentTags.has(tag.toLowerCase()));
}

export function selectRelatedPosts(
  source: RelatedPostsSource | null,
  limit = DEFAULT_RELATED_LIMIT,
): RelatedArticle[] {
  if (!source || limit <= 0) return [];

  const selected: RelatedArticle[] = [];
  const seen = new Set<string>();
  const currentCategoryIds = new Set(source.categoryIds ?? []);
  const currentTags = new Set(
    (source.tags ?? []).map((tag) => tag.toLowerCase()),
  );
  const candidates = source.candidates ?? [];
  const buckets = [
    source.manual ?? [],
    candidates.filter((post) => hasCategoryOverlap(post, currentCategoryIds)),
    candidates.filter((post) => hasTagOverlap(post, currentTags)),
    candidates,
  ];

  const addPost = (post: RelatedArticleCandidate) => {
    const slug = post.slug?.current;

    if (
      !slug ||
      !post.title ||
      slug === source.slug ||
      post._id === source._id ||
      post._id?.startsWith("drafts.")
    ) {
      return;
    }

    const key = post._id ?? slug;

    if (seen.has(key) || seen.has(slug)) return;

    seen.add(key);
    seen.add(slug);
    selected.push({
      ...post,
      slug: { ...post.slug, current: canonicalBlogSlug(slug) },
    });
  };

  for (const bucket of buckets) {
    for (const post of bucket) {
      if (selected.length >= limit) return selected;
      addPost(post);
    }
  }

  return selected;
}
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";
