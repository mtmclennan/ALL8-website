import Link from 'next/link';

export type ArticleBreadcrumbCategory = {
  title?: string;
  slug?: string;
};

type ArticleBreadcrumbsProps = {
  title?: string;
  category?: ArticleBreadcrumbCategory | null;
};

export default function ArticleBreadcrumbs({
  title,
  category,
}: ArticleBreadcrumbsProps) {
  const categoryTitle = category?.title;
  const categoryHref =
    categoryTitle && category?.slug ? `/blog/category/${category.slug}` : null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="relative z-30 bg-background/95 border-b border-white/10"
    >
      <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-6 py-4 text-sm text-foreground/60">
        <li>
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/30">
          /
        </li>
        <li>
          <Link href="/blog" className="transition hover:text-foreground">
            Blog
          </Link>
        </li>
        {categoryHref ? (
          <>
            <li aria-hidden="true" className="text-foreground/30">
              /
            </li>
            <li>
              <Link
                href={categoryHref}
                className="transition hover:text-foreground"
              >
                {categoryTitle}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true" className="text-foreground/30">
          /
        </li>
        <li
          aria-current="page"
          className="min-w-0 max-w-full truncate text-foreground"
        >
          {title || 'Article'}
        </li>
      </ol>
    </nav>
  );
}
