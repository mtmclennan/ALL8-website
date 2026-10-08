import type { RelatedArticle } from "@/app/studio/sanity/lib/relatedPosts";
import type { BlogIndexPost } from "./BlogTopicSections";

import PostCard from "./PostCard";

type RelatedArticlesProps = {
  articles: RelatedArticle[];
  limit?: number;
};

const DEFAULT_LIMIT = 3;

/** Related picks use the same card as the blog index, so they read as one publication. */
function toCardPost(article: RelatedArticle): BlogIndexPost {
  return {
    _id: article._id ?? article.slug?.current ?? "",
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    categories: article.category
      ? [
          {
            title: article.category.title,
            slug: article.category.slug?.current,
          },
        ]
      : undefined,
  };
}

export default function RelatedArticles({
  articles,
  limit = DEFAULT_LIMIT,
}: RelatedArticlesProps) {
  const relatedArticles = articles
    .filter((article) => article.title && article.slug?.current)
    .slice(0, limit);

  if (!relatedArticles.length) return null;

  return (
    <section
      aria-labelledby="related-articles-title"
      className="mx-auto max-w-[1160px] px-6 pb-8 pt-4 sm:px-10"
    >
      <div className="border-t border-white/[0.08] pt-12">
        <h2
          className="all8-h2 mb-8 font-extrabold tracking-[-.022em]"
          id="related-articles-title"
        >
          Keep reading
        </h2>

        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((article) => (
            <PostCard
              key={article._id ?? article.slug?.current}
              post={toCardPost(article)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
