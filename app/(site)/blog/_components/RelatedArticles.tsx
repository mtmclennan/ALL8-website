import type { RelatedArticle } from "@/app/studio/sanity/lib/relatedPosts";

import Link from "next/link";

type RelatedArticlesProps = {
  articles: RelatedArticle[];
  limit?: number;
};

const DEFAULT_LIMIT = 3;

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatPublishDate(publishedAt?: string) {
  if (!publishedAt) return null;

  return dateFormatter.format(new Date(publishedAt));
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
      className="relative z-20 mx-auto max-w-5xl px-6 pb-16"
    >
      <div className="border-t border-white/10 pt-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-400">
            Keep Reading
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-white"
            id="related-articles-title"
          >
            Related Articles
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {relatedArticles.map((article) => {
            const slug = article.slug?.current;
            const publishedLabel = formatPublishDate(article.publishedAt);

            if (!slug || !article.title) return null;

            return (
              <article
                key={article._id ?? slug}
                className="group rounded-2xl border border-foreground/10 bg-background/70 p-6 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl"
              >
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/50">
                  {article.category?.title ? (
                    <span className="font-medium text-blue-300">
                      {article.category.title}
                    </span>
                  ) : null}
                  {publishedLabel ? (
                    <time dateTime={article.publishedAt}>{publishedLabel}</time>
                  ) : null}
                </div>

                <h3 className="text-xl font-semibold leading-tight text-white">
                  <Link
                    className="outline-none transition-colors group-hover:text-blue-300 focus-visible:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    href={`/blog/${slug}`}
                  >
                    {article.title}
                  </Link>
                </h3>

                {article.excerpt ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                    {article.excerpt}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
