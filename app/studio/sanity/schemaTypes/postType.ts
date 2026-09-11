import { defineType, defineField } from "sanity";

import { slugify } from "@/lib/utils/slugify";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(120),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          slugify(input).slice(0, 96).replace(/-+$/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary used for previews and SEO.",
      validation: (Rule) => Rule.max(250),
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      description:
        "Optional manual picks shown before category, tag, and latest-post fallbacks.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (Rule) => Rule.unique().max(6),
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
      readOnly: true,
    }),

    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "coverImage",
      subtitle: "excerpt",
    },
  },
});
