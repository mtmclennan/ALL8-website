export default {
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  fields: [
    // Metadata
    {
      name: 'title',
      title: 'Meta Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Meta Description',
      type: 'text',
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
    },

    // Hero section
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Hero Title' },
        { name: 'subtitle', type: 'text', title: 'Subtitle' },
        { name: 'note', type: 'string', title: 'Small Note (optional)' },
      ],
    },

    // Featured section (optional)
    {
      name: 'featuredTitle',
      title: 'Featured Section Title',
      type: 'string',
    },

    // CTA section
    {
      name: 'cta',
      title: 'CTA Section',
      type: 'object',
      fields: [
        { name: 'titlePrefix', type: 'string', title: 'Title Prefix' },
        { name: 'highlight', type: 'string', title: 'Highlight Word' },
        { name: 'titleSuffix', type: 'string', title: 'Title Suffix' },
        { name: 'subtitle', type: 'text', title: 'Subtitle' },
        { name: 'ctaLabel', type: 'string', title: 'CTA Label' },
        { name: 'ctaHref', type: 'string', title: 'CTA URL' },
        { name: 'microText', type: 'string', title: 'Micro Text' },
      ],
    },
  ],
};
