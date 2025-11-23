import { groq } from 'next-sanity';

export const allPostsQuery = groq`
*[_type == "post" && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    "author": author->name
  }

`;

export const singlePostQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    updatedAt,
    body,
    seo,
    "author": author->{
      name,
      image
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
