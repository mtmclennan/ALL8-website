// seoFields.ts
import {defineField, defineType} from 'sanity'

export const seoFields = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords (optional)',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'ogTitle',
      title: 'OpenGraph Title',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OpenGraph Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'OpenGraph Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter Card Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
