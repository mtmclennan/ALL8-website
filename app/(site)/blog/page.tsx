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

export const revalidate = 3600;

export async function generateMetadata() {
  const page = await sanity.fetch(blogPageQuery);
  const canonical = `${siteUrl()}/blog`;
  const title =
    "Field Notes on Lead Systems for Service Businesses | ALL8 WEBWORKS";
  const description =
    "Practical guidance on local visibility, websites, lead handling, follow-up, CRM and attribution for service businesses.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [
        page?.ogImage
          ? {
              url: urlFor(page.ogImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
            }
          : {
              url: new URL(site.defaultOgImage, siteUrl()).toString(),
              width: 1200,
              height: 630,
            },
      ],
    },
  };
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
    name: page?.title ?? "Field Notes — ALL8 WEBWORKS",
    url: `${siteUrl()}/blog`,
    blogPost: posts
      .filter((p): p is BlogIndexPost & { slug: { current: string } } =>
        Boolean(p.slug?.current),
      )
      .map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${siteUrl()}/blog/${p.slug.current}`,
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
