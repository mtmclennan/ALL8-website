import type { Post as SanityPost, Table } from "@/app/studio/sanity.types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import TableOfContents from "./TableOfContents";
import ArticleCta from "./ArticleCta";

import { urlFor } from "@/app/studio/sanity/lib/image";
import { buildArticleHeadings } from "@/lib/blogHeadings";
import {
  getArticleImageAlt,
  getArticleImageDimensions,
  getArticleImageSourceUrl,
  getCoverImageAlt,
  type ArticleImageValue,
} from "@/lib/blogImage";
import { validateBlogHref } from "@/lib/blogHref";
import { getTableHeaderCount } from "@/lib/blogTable";
import { canonicalInternalPath } from "@/config/permanent-redirects.mjs";
import { formatCategoryLabel } from "@/lib/blogTaxonomy";

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
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const categoryData = post.categories?.[0];
  const category = formatCategoryLabel(categoryData?.title, categoryData?.slug);
  const { toc, idsByKey } = buildArticleHeadings(post.body);

  const renderBodyImage = (value: ArticleImageValue) => {
    if (!value.asset) return null;

    const dimensions = getArticleImageDimensions(value);
    const width = Math.min(dimensions?.width ?? 1400, 1400);
    const height = dimensions
      ? Math.max(1, Math.round((width * dimensions.height) / dimensions.width))
      : 933;
    const src = urlFor(value as SanityImageSource)
      .width(width)
      .url();
    const caption = value.caption?.trim();
    const credit = value.credit?.trim();
    const sourceUrl = getArticleImageSourceUrl(value);

    return (
      <figure className="my-9">
        <Image
          alt={getArticleImageAlt(value, post.title ?? "this article")}
          className="h-auto w-full rounded-2xl shadow-lg"
          height={height}
          sizes="(min-width: 1024px) 680px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 3rem)"
          src={src}
          width={width}
        />
        {(caption || credit || sourceUrl) && (
          <figcaption className="mt-3 space-y-1 text-sm leading-relaxed text-white/70">
            {caption && <span className="block">{caption}</span>}
            {(credit || sourceUrl) && (
              <span className="block text-white/60">
                {sourceUrl ? (
                  <a
                    className="underline decoration-white/40 underline-offset-2 hover:text-white"
                    href={sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {credit ? `Credit: ${credit}` : "Image source"}
                  </a>
                ) : (
                  `Credit: ${credit}`
                )}
              </span>
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
              const cellClassName =
                "min-w-28 px-4 py-3 align-top [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-relaxed";

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
          <div
            aria-label={
              title ||
              "Article data table, scroll horizontally to see all columns"
            }
            className="my-9 max-w-full overflow-x-auto rounded-xl border border-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            role="region"
            tabIndex={0}
          >
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              {(title || caption) && (
                <caption className="px-4 py-3 text-left">
                  {title && (
                    <span className="block font-semibold text-white">
                      {title}
                    </span>
                  )}
                  {caption && (
                    <span className="block text-white/70">{caption}</span>
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

  return (
    <article className="pb-24 max-[960px]:pb-16">
      <section className="relative overflow-hidden pt-[68px]">
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
        <div className="relative z-[2] mx-auto max-w-[1160px] px-6 pb-16 pt-11 sm:px-10">
          <div className="max-w-[800px]">
            <nav
              aria-label="Breadcrumb"
              className="mb-[22px] flex flex-wrap items-center gap-2 text-[13px] text-white/70"
            >
              <Link className="hover:text-white" href="/">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <Link className="hover:text-white" href="/blog">
                Field Notes
              </Link>
              <span className="text-white/40">/</span>
              <span className="max-w-full truncate font-semibold text-accent-blue">
                {post.title}
              </span>
            </nav>

            <div className="mb-[22px] flex flex-wrap items-center gap-3">
              {category && (
                <span className="rounded-full border border-[rgba(0,118,255,.28)] bg-[rgba(0,118,255,.13)] px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[.06em] text-accent-blue">
                  {category}
                </span>
              )}
              {publishedLabel && (
                <span className="text-[13.5px] text-white/70">
                  {publishedLabel}
                </span>
              )}
              {post.readingTime && (
                <>
                  <span className="text-[13.5px] text-white/70">·</span>
                  <span className="text-[13.5px] text-white/70">
                    {post.readingTime} min read
                  </span>
                </>
              )}
            </div>

            <h1 className="all8-h1 font-black leading-[1.04] tracking-[-.028em]">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] px-6 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_232px]">
          <div className="max-w-[680px]">
            {post.excerpt && (
              <p className="mb-[34px] text-[21px] leading-[1.68] text-[#cbd9e8]">
                {post.excerpt}
              </p>
            )}

            {post.coverImage && (
              <figure className="relative mb-10 aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-content3">
                <Image
                  fill
                  priority
                  alt={getCoverImageAlt(
                    post.coverImage,
                    post.title ?? "Article cover",
                  )}
                  className="object-cover"
                  sizes="(min-width: 1024px) 680px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 3rem)"
                  src={urlFor(post.coverImage)
                    .width(1200)
                    .height(630)
                    .fit("crop")
                    .url()}
                />
              </figure>
            )}

            {post.body ? (
              <div className="font-body">
                <PortableText components={components} value={post.body} />
              </div>
            ) : null}

            <div className="mt-14 border-t border-white/[0.08] pt-8">
              {post.author?.name && (
                <div className="flex items-center gap-[18px]">
                  {post.author.image ? (
                    <Image
                      alt={post.author.name}
                      className="flex-shrink-0 rounded-full border border-white/[0.14] object-cover"
                      height={64}
                      src={urlFor(post.author.image)
                        .width(128)
                        .height(128)
                        .url()}
                      width={64}
                    />
                  ) : null}
                  <div>
                    <div className="text-[15.5px] font-extrabold tracking-[-.01em]">
                      {post.author.name}
                    </div>
                    {post.author.bio ? (
                      <div className="mt-1 text-[13.5px] leading-relaxed text-white/70">
                        <PortableText
                          components={bioComponents}
                          value={post.author.bio as any}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              <ArticleCta />
            </div>
          </div>

          <TableOfContents items={toc} />
        </div>
      </div>
    </article>
  );
}
