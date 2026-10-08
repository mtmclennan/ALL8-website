import type { Post as SanityPost, Table } from "@/app/studio/sanity.types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import Link from "next/link";
import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

import TableOfContents from "./TableOfContents";

import { urlFor } from "@/app/studio/sanity/lib/image";
import { buildArticleHeadings } from "@/lib/blogHeadings";
import {
  BODY_IMAGE_MAX_WIDTH,
  getArticleImageAlt,
  getArticleImageDimensions,
  getArticleImageSourceUrl,
  getBodyImageLayout,
  getCoverImageAlt,
  type ArticleImageValue,
} from "@/lib/blogImage";
import { formatPostDate, getMeaningfulUpdateDate } from "@/lib/blogDate";
import { validateBlogHref } from "@/lib/blogHref";
import { getTableHeaderCount } from "@/lib/blogTable";
import { canonicalInternalPath } from "@/config/permanent-redirects.mjs";
import { formatCategoryLabel } from "@/lib/blogTaxonomy";
import { homeData } from "@/data/home";

/**
 * Query-result type for singlePostQuery:
 * - In Sanity schema, `author` is a reference.
 * - In GROQ, you're projecting `author-> { name, image, bio }`.
 * So we override the schema type to match the query result.
 */
export type SinglePost = Omit<SanityPost, "author" | "categories"> & {
  author?: {
    name: string;
    image?: unknown;
    bio?: unknown;
  };
  categories?: Array<{
    title?: string;
    slug?: string;
  }>;
};

type BlogPostProps = { post: SinglePost; siteOrigin: string };

type TableRow = NonNullable<Table["rows"]>[number];

function internalHref(href: string | undefined, siteOrigin: string) {
  if (!href) return null;

  try {
    const url = new URL(href, siteOrigin);
    const legacyHosts = new Set(["all8webworks.ca", "www.all8webworks.ca"]);

    if (url.origin !== siteOrigin && !legacyHosts.has(url.hostname))
      return null;

    return `${canonicalInternalPath(url.pathname)}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export default function BlogPost({ post, siteOrigin }: BlogPostProps) {
  const publishedLabel = formatPostDate(post.publishedAt, "long");
  const updatedAt = getMeaningfulUpdateDate(post.publishedAt, post.updatedAt);
  const updatedLabel = formatPostDate(updatedAt, "long");

  const categoryData = post.categories?.[0];
  const category = formatCategoryLabel(categoryData?.title, categoryData?.slug);
  const { toc, idsByKey } = buildArticleHeadings(post.body);

  const renderBodyImage = (value: ArticleImageValue) => {
    if (!value.asset) return null;

    // Body images keep their natural (cropped) aspect ratio — portrait
    // infographics are never forced into a landscape frame.
    const dimensions = getArticleImageDimensions(value);
    const layout = getBodyImageLayout(dimensions);
    const width = Math.min(
      dimensions?.width ?? BODY_IMAGE_MAX_WIDTH,
      BODY_IMAGE_MAX_WIDTH,
    );
    const height = dimensions
      ? Math.max(1, Math.round((width * dimensions.height) / dimensions.width))
      : 933;
    const src = urlFor(value as SanityImageSource)
      .width(width)
      .url();
    // Same crop/hotspot, full resolution, for reading dense diagrams on a phone.
    const fullSizeSrc = urlFor(value as SanityImageSource).url();
    const caption = value.caption?.trim();
    const credit = value.credit?.trim();
    const sourceUrl = getArticleImageSourceUrl(value);
    const decorative = Boolean(value.decorative);

    return (
      <figure className="my-10">
        <Image
          alt={getArticleImageAlt(value, post.title ?? "this article")}
          className="h-auto w-full rounded-xl border border-white/[0.08] bg-content3"
          height={height}
          sizes="(min-width: 1024px) 680px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 3rem)"
          src={src}
          width={width}
        />
        {(caption || credit || sourceUrl || layout.offerFullSize) && (
          <figcaption className="mt-3 space-y-1 text-sm leading-relaxed text-white/60">
            {caption && <span className="block text-white/70">{caption}</span>}
            {(credit || sourceUrl) && (
              <span className="block">
                {sourceUrl ? (
                  <a
                    className="underline decoration-white/40 underline-offset-2 hover:text-white"
                    href={sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {credit ? `Credit: ${credit}` : "Image source"}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  `Credit: ${credit}`
                )}
              </span>
            )}
            {layout.offerFullSize && !decorative && (
              <a
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-blue underline decoration-accent-blue/40 underline-offset-2 hover:text-[#8ec5ff]"
                href={fullSizeSrc}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open full-size image
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </figcaption>
        )}
      </figure>
    );
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Wide tables need keyboard-focusable horizontal scrolling. */
  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value, index }) => (
        <h2
          className="mb-[18px] mt-[52px] scroll-mt-24 font-sans text-[clamp(25px,2.6vw,32px)] font-extrabold leading-[1.16] tracking-[-.024em]"
          id={idsByKey.get(value._key ?? `index:${index}`)}
        >
          {children}
        </h2>
      ),
      h2: ({ children, value, index }) => (
        <h2
          className="mb-[18px] mt-[52px] scroll-mt-24 font-sans text-[clamp(25px,2.6vw,32px)] font-extrabold leading-[1.16] tracking-[-.024em]"
          id={idsByKey.get(value._key ?? `index:${index}`)}
        >
          {children}
        </h2>
      ),
      h3: ({ children, value, index }) => (
        <h3
          className="mb-3 mt-9 font-sans text-xl font-extrabold tracking-[-.018em]"
          id={idsByKey.get(value._key ?? `index:${index}`)}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <div className="my-[38px] rounded-r-[14px] border-l-2 border-primary bg-[rgba(0,118,255,.06)] px-[30px] py-7">
          <p className="text-[clamp(19px,2.1vw,23px)] font-extrabold leading-[1.42] tracking-[-.02em] text-white">
            {children}
          </p>
        </div>
      ),
      normal: ({ children }) => (
        <p className="mb-6 text-lg leading-[1.82] text-white/70">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-[26px] flex flex-col gap-[13px]">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mb-[26px] flex flex-col gap-[13px]">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="flex gap-3.5 text-[17.5px] leading-[1.75] text-white/70">
          <span className="mt-[11px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span>{children}</span>
        </li>
      ),
      number: ({ children, index }) => (
        <li className="flex gap-3.5 text-[17.5px] leading-[1.75] text-white/70">
          <span className="mt-1 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-[rgba(0,118,255,.3)] bg-[rgba(0,118,255,.14)] text-xs font-extrabold text-accent-blue">
            {(index ?? 0) + 1}
          </span>
          <span>{children}</span>
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-white">{children}</strong>
      ),
      link: ({ children, value }) => {
        const href = value?.href as string | undefined;

        if (validateBlogHref(href) !== true) return <span>{children}</span>;

        const normalizedInternalHref = internalHref(href, siteOrigin);

        if (normalizedInternalHref) {
          return (
            <Link
              className="text-accent-blue underline decoration-accent-blue/40 underline-offset-2 hover:text-[#8ec5ff]"
              href={normalizedInternalHref}
            >
              {children}
            </Link>
          );
        }

        return (
          <a
            className="text-accent-blue underline decoration-accent-blue/40 underline-offset-2 hover:text-[#8ec5ff]"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      table: ({ value }) => {
        const { rows = [], headerRows = 0, title, caption } = value as Table;

        if (rows.length === 0) return null;

        const headerCount = getTableHeaderCount(headerRows, rows.length);
        const columnCount = Math.max(
          ...rows.map((row) => row.cells?.length ?? 0),
        );
        // Narrow tables fit a phone; only wide ones need sideways scrolling.
        const isWide = columnCount >= 4;
        const renderRow = (
          row: TableRow,
          rowIndex: number,
          isHeader: boolean,
        ) => (
          <tr
            key={row._key ?? rowIndex}
            className="border-b border-white/15 last:border-b-0"
          >
            {(row.cells ?? []).map((cell, cellIndex) => {
              const content = cell.value?.length ? (
                <PortableText components={components} value={cell.value} />
              ) : null;
              const cellClassName = `${isWide ? "min-w-28" : "min-w-24"} px-3 py-3 align-top sm:px-4 [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-relaxed`;

              return isHeader ? (
                <th
                  key={cell._key ?? cellIndex}
                  className={`${cellClassName} bg-white/[0.06] font-semibold text-white [&_p]:text-white`}
                  scope="col"
                >
                  {content}
                </th>
              ) : (
                <td
                  key={cell._key ?? cellIndex}
                  className={`${cellClassName} text-white/70`}
                >
                  {content}
                </td>
              );
            })}
          </tr>
        );

        return (
          <div className="my-10">
            <div
              aria-label={
                title ||
                "Article data table, scroll horizontally to see all columns"
              }
              className="max-w-full overflow-x-auto rounded-xl border border-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              role="region"
              tabIndex={0}
            >
              <table
                className={`w-full border-collapse text-left text-sm ${isWide ? "min-w-[36rem]" : ""}`}
              >
                {(title || caption) && (
                  <caption className="border-b border-white/15 px-4 py-3 text-left">
                    {title && (
                      <span className="block font-sans text-[15px] font-bold text-white">
                        {title}
                      </span>
                    )}
                    {caption && (
                      <span className="mt-0.5 block text-sm leading-relaxed text-white/70">
                        {caption}
                      </span>
                    )}
                  </caption>
                )}
                {headerCount > 0 && (
                  <thead>
                    {rows
                      .slice(0, headerCount)
                      .map((row, index) => renderRow(row, index, true))}
                  </thead>
                )}
                <tbody>
                  {rows
                    .slice(headerCount)
                    .map((row, index) =>
                      renderRow(row, headerCount + index, false),
                    )}
                </tbody>
              </table>
            </div>
            {isWide && (
              <p
                aria-hidden="true"
                className="mt-2 text-[13px] text-white/60 sm:hidden"
              >
                Scroll sideways to see all columns.
              </p>
            )}
          </div>
        );
      },
      image: ({ value }) => renderBodyImage(value as ArticleImageValue),
      bodyImage: ({ value }) => renderBodyImage(value as ArticleImageValue),
    },
  };
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */

  const bioComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="m-0">{children}</p>,
    },
  };

  const authorName = post.author?.name;
  const authorBio = post.author?.bio as PortableTextBlock[] | undefined;
  // Sanity author records may lack a photo or bio; fall back to the founder profile.
  const isFounder = authorName === homeData.founder.name;
  const authorFallbackImage =
    !post.author?.image && isFounder ? homeData.founder.image.src : null;
  const categorySlug = categoryData?.slug;

  return (
    <article className="pb-16 max-[960px]:pb-12">
      <header className="relative overflow-hidden pt-[68px]">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,118,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,118,255,.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          className="absolute right-0 top-0 h-full w-[60%]"
          style={{
            background:
              "radial-gradient(60% 70% at 80% 25%, rgba(0,64,150,.55) 0%, rgba(11,15,26,0) 65%)",
          }}
        />
        <div className="relative z-[2] mx-auto max-w-[1000px] px-6 pb-10 pt-11 sm:px-10">
          <div className="max-w-[800px]">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/70">
                <li>
                  <Link className="hover:text-white" href="/">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">
                  /
                </li>
                <li>
                  <Link className="hover:text-white" href="/blog">
                    Blog
                  </Link>
                </li>
                {category && (
                  <>
                    <li aria-hidden="true" className="text-white/40">
                      /
                    </li>
                    <li>
                      {categorySlug ? (
                        <Link
                          className="font-semibold text-accent-blue hover:text-[#8ec5ff]"
                          href={`/blog/category/${categorySlug}`}
                        >
                          {category}
                        </Link>
                      ) : (
                        <span className="font-semibold text-accent-blue">
                          {category}
                        </span>
                      )}
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="all8-h1 font-black leading-[1.06] tracking-[-.028em] [text-wrap:balance] max-[480px]:text-[30px]!">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 max-w-[680px] text-[clamp(18px,1.8vw,21px)] leading-[1.6] text-[#cbd9e8]">
                {post.excerpt}
              </p>
            )}

            {/* Separators are attached to the item after them, so a wrapped line never ends on "·". */}
            <ul className="mt-6 flex flex-wrap items-center gap-y-1 text-[14px] text-white/70 [&>li+li]:before:mx-2.5 [&>li+li]:before:content-['·']">
              {authorName && (
                <li className="font-semibold text-white">{authorName}</li>
              )}
              {publishedLabel && (
                <li>
                  <time dateTime={post.publishedAt}>{publishedLabel}</time>
                </li>
              )}
              {updatedLabel && updatedAt && (
                <li>
                  Updated <time dateTime={updatedAt}>{updatedLabel}</time>
                </li>
              )}
              {post.readingTime ? <li>{post.readingTime} min read</li> : null}
            </ul>
          </div>

          {post.coverImage && (
            <figure className="relative mt-10 aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-content3">
              <Image
                fill
                priority
                alt={getCoverImageAlt(
                  post.coverImage,
                  post.title ?? "Article cover",
                )}
                className="object-cover"
                sizes="(min-width: 1000px) 920px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 3rem)"
                src={urlFor(post.coverImage)
                  .width(1840)
                  .height(966)
                  .fit("crop")
                  .url()}
              />
            </figure>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-6 pt-6 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[minmax(0,680px)_232px] lg:justify-between">
          <div className="min-w-0 max-w-[680px]">
            {toc.length > 1 && (
              <details className="group mb-10 rounded-xl border border-white/[0.08] bg-white/[0.036] lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 text-[14px] font-bold text-white [&::-webkit-details-marker]:hidden">
                  On this page
                  <span
                    aria-hidden="true"
                    className="text-accent-blue transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="flex flex-col gap-0.5 px-5 pb-4">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        className="block py-2 text-[14px] leading-snug text-white/70 hover:text-white"
                        href={`#${item.id}`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {post.body ? (
              <div className="font-body">
                <PortableText components={components} value={post.body} />
              </div>
            ) : null}

            {authorName && (
              <aside
                aria-label="About the author"
                className="mt-14 flex items-center gap-[18px] border-t border-white/[0.08] pt-8"
              >
                {authorFallbackImage ? (
                  <Image
                    alt=""
                    className="h-16 w-16 flex-shrink-0 rounded-full border border-white/[0.14] object-cover"
                    height={64}
                    src={authorFallbackImage}
                    width={64}
                  />
                ) : post.author?.image ? (
                  <Image
                    alt=""
                    className="flex-shrink-0 rounded-full border border-white/[0.14] object-cover"
                    height={64}
                    src={urlFor(post.author.image as SanityImageSource)
                      .width(128)
                      .height(128)
                      .url()}
                    width={64}
                  />
                ) : null}
                <div>
                  <p className="text-[15.5px] font-extrabold tracking-[-.01em]">
                    {authorName}
                  </p>
                  {authorBio ? (
                    <div className="mt-1 text-[13.5px] leading-relaxed text-white/70">
                      <PortableText
                        components={bioComponents}
                        value={authorBio}
                      />
                    </div>
                  ) : isFounder ? (
                    <p className="mt-1 text-[13.5px] leading-relaxed text-white/70">
                      {homeData.founder.role}
                    </p>
                  ) : null}
                  <Link
                    className="all8-body-link mt-1.5 inline-flex min-h-11 items-center text-[13.5px] font-semibold"
                    href="/about"
                  >
                    About ALL8 and how Matt works
                  </Link>
                </div>
              </aside>
            )}
          </div>

          <div className="hidden self-stretch lg:block">
            <TableOfContents items={toc} />
          </div>
        </div>
      </div>
    </article>
  );
}
