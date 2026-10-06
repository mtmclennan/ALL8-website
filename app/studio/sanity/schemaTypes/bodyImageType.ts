import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const bodyImageType = defineType({
  name: "bodyImage",
  title: "Body Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  validation: (Rule) => Rule.required(),
  fields: [
    defineField({
      name: "decorative",
      title: "Decorative image",
      type: "boolean",
      description:
        "Select only when the image adds no information beyond the surrounding text. Decorative images have empty alt text.",
      initialValue: false,
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the information conveyed by this image.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const decorative = (
            context.parent as { decorative?: boolean } | undefined
          )?.decorative;

          return decorative || (typeof value === "string" && value.trim())
            ? true
            : "Add alt text or mark the image as decorative.";
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "credit",
      title: "Credit or source",
      type: "string",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Optional HTTPS link to the original source.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
  ],
});
