"use client";

import type { Post as SanityPost } from "@/app/studio/sanity.types";

import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import TableOfContents, { type TocItem } from "./TableOfContents";

import { urlFor } from "@/app/studio/sanity/lib/image";
import { slugify } from "@/lib/utils/slugify";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
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

type Block = {
  _type?: string;
  style?: string;
  _key?: string;
  children?: { text?: string }[];
};

function getBlockText(block: Block) {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

function extractToc(body: SinglePost["body"]): TocItem[] {
  if (!Array.isArray(body)) return [];

  return (body as Block[])
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => ({ id: slugify(getBlockText(b)), text: getBlockText(b) }));
}

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
  const toc = extractToc(post.body);

  const components: PortableTextComponents = {
    block: {
      h1: ({ children, value }) => (
        <h2
          className="mb-[18px] mt-[52px] scroll-mt-24 text-[clamp(25px,2.6vw,32px)] font-extrabold leading-[1.16] tracking-[-.024em]"
          id={slugify(getBlockText(value as Block))}
        >
          {children}
        </h2>
      ),
      h2: ({ children, value }) => (
        <h2
          className="mb-[18px] mt-[52px] scroll-mt-24 text-[clamp(25px,2.6vw,32px)] font-extrabold leading-[1.16] tracking-[-.024em]"
          id={slugify(getBlockText(value as Block))}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-3 mt-9 text-xl font-extrabold tracking-[-.018em]">
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
            href={href || "#"}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        const src = value?.asset ? urlFor(value).width(1400).url() : null;

        if (!src) return null;

        return (
          <figure className="my-9">
            <Image
              alt={value?.alt || ""}
              className="h-auto w-full rounded-2xl shadow-lg"
              height={788}
              src={src}
              width={1400}
            />
            {value?.caption ? (
              <figcaption className="mt-3 text-sm text-white/40">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
  };

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

            <h1 className="text-[clamp(36px,4.2vw,58px)] font-black leading-[1.04] tracking-[-.028em]">
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

            {post.body ? (
              <PortableText components={components} value={post.body} />
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

function ArticleCta() {
  const { openModal } = useLeadModal();

  return (
    <div className="mt-8 rounded-[20px] border border-[rgba(0,118,255,.22)] bg-[rgba(0,118,255,.07)] p-[30px]">
      <h3 className="mb-2 text-xl font-extrabold tracking-[-.02em]">
        Not sure which stage is yours?
      </h3>
      <p className="mb-5 text-[15.5px] leading-relaxed text-white/70">
        That&apos;s the whole point of the free Lead System Review. Fifteen
        minutes, we walk the path a customer takes to reach you, and you get the
        findings in writing either way.
      </p>
      <button
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#1e8bff] to-[#0060d6] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_28px_-6px_rgba(0,118,255,.45)] transition-all hover:-translate-y-0.5"
        type="button"
        onClick={openModal}
      >
        Get My Free Lead System Review
      </button>
    </div>
  );
}
