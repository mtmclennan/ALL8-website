import type { BlogIndexPost } from "./_components/BlogTopicSections";

import FinalCta from "../_components/home/FinalCta";

import BlogHero from "./_components/BlogHero";
import FeaturedPost from "./_components/FeaturedPost";
import PostsFilterGrid from "./_components/PostsFilterGrid";
import Newsletter from "./_components/Newsletter";

import { client as sanity } from "@/app/studio/sanity/lib/client";
import { allPostsQuery, blogPageQuery } from "@/app/studio/sanity/lib/queries";
import { urlFor } from "@/app/studio/sanity/lib/image";
import { site, siteUrl } from "@/config/site.config";
import { buildPageMetadata, normalizeBrandName } from "@/lib/seo/metadata";
import { canonicalBlogSlug } from "@/config/permanent-redirects.mjs";

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await sanity.fetch(blogPageQuery);
  const title = "SEO, Websites & Lead Follow-Up Guides | ALL8 Webworks";
  const description =
    "Practical guides for service businesses on local search visibility, higher-converting websites, lead handling, follow-up, CRM and measurable growth.";

  return buildPageMetadata({
    title,
    description,
    path: "/blog",
    image: page?.ogImage
      ? urlFor(page.ogImage).width(1200).height(630).url()
      : site.defaultOgImage,
  });
}

export default async function BlogIndexPage() {
  const [page, posts] = await Promise.all([
    sanity.fetch(blogPageQuery),
    sanity.fetch<BlogIndexPost[]>(allPostsQuery),
  ]);

  const rest = posts.slice(1);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl()}/blog#blog`,
    name: normalizeBrandName(page?.title ?? "Field Notes — ALL8 Webworks"),
    url: `${siteUrl()}/blog`,
    blogPost: posts
      .filter((p): p is BlogIndexPost & { slug: { current: string } } =>
        Boolean(p.slug?.current),
      )
      .map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${siteUrl()}/blog/${canonicalBlogSlug(p.slug.current)}`,
        datePublished: p.publishedAt,
      })),
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        type="application/ld+json"
      />
      <BlogHero subtitle={page?.hero?.subtitle} title={page?.hero?.title} />
      <section className="pb-24 max-[960px]:pb-16">
        <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
          <FeaturedPost posts={posts} title={page?.featuredTitle} />
          <PostsFilterGrid posts={rest} />
          <Newsletter />
        </div>
      </section>
      <FinalCta
        data={{
          eyebrow: "Free Lead System Review",
          title: "Rather Skip the Reading?",
          titleAccent: "We'll Just Tell You.",
          subtitle:
            "Fifteen minutes on the path a customer takes to reach you — search, site, phone, follow-up, tracking — and which stage is costing you the most.",
          ctaLabel: "Get My Free Lead System Review",
          micro:
            "No long-term commitment  ·  Clear recommendations  ·  Fixed scope before work begins",
          secondary: { label: "Or just text us", href: "/contact" },
        }}
      />
    </>
  );
}
