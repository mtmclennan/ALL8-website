import { groq } from "next-sanity";

const relatedArticleProjection = groq`
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "category": categories[0]->{
    title,
    slug
  }
`;

export const allPostsQuery = groq`
*[
  _type == "post" &&
  !(_id in path("drafts.**")) &&
  draft != true &&
  seo.noIndex != true
]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    _updatedAt,
    tags,
    readingTime,
    "categories": categories[]->{
      title,
      "slug": slug.current
    },
    "author": author->name
  }

`;

export const homeStrategicPostsQuery = groq`
  *[
    _type == "post" &&
    !(_id in path("drafts.**")) &&
    draft != true &&
    seo.noIndex != true &&
    slug.current in $slugs
  ] {
    _id,
    title,
    slug,
    excerpt,
    "category": categories[0]->{
      title,
      "slug": slug.current
    }
  }
`;

export const publishedPostSlugsQuery = groq`
  *[
    _type == "post" &&
    !(_id in path("drafts.**")) &&
    draft != true &&
    defined(slug.current)
  ].slug.current
`;

export const singlePostQuery = groq`
  *[
    _type == "post" &&
    !(_id in path("drafts.**")) &&
    slug.current in $slugs &&
    draft != true
  ][0]{
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    updatedAt,
    _updatedAt,
    body,
    seo,
    readingTime,
    "categories": categories[]->{
      title,
      "slug": slug.current
    },
    "author": author->{
      name,
      image,
      bio
    }
  }
`;

export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current in $slugs][0]{
    _id,
    title,
    "slug": slug.current,
    "categoryIds": categories[]._ref,
    "categoryTitles": categories[]->title,
    "categorySlugs": categories[]->slug.current,
    tags,
    "manual": relatedPosts[]->{
      ${relatedArticleProjection}
    },
    "candidates": *[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      draft != true &&
      seo.noIndex != true &&
      !(slug.current in $slugs)
    ] | order(publishedAt desc)[0...60] {
      ${relatedArticleProjection},
      "categoryIds": categories[]._ref,
      tags
    }
  }
`;

export const blogPageQuery = groq`
  *[_type == "blogPage"][0] {
    title,
    description,
    ogImage,
    hero,
    featuredTitle,
    cta
  }
`;

export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)].slug.current
`;

export const categoryArchiveSitemapQuery = groq`
  *[_type == "category" && defined(slug.current)] {
    _updatedAt,
    "slug": slug.current,
    "postCount": count(*[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      draft != true &&
      seo.noIndex != true &&
      references(^._id)
    ])
  }[postCount > 0]
`;

export const categoryPostsQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "posts": *[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      draft != true &&
      seo.noIndex != true &&
      references(^._id)
    ] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      _updatedAt,
      "author": author->name
    }
  }
`;
