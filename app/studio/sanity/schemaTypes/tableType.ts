import { defineArrayMember, defineField, defineType } from "sanity";

import { hasConsistentTableRows } from "../../../../lib/blogTable";

export const tableType = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Table title",
      type: "string",
      description: "A short title shown as the table caption.",
    }),
    defineField({
      name: "caption",
      title: "Explanation",
      type: "text",
      rows: 2,
      description: "Optional context shown with the table title.",
    }),
    defineField({ name: "headerRows", type: "number" }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          name: "row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              type: "array",
              of: [
                defineArrayMember({
                  name: "cell",
                  type: "object",
                  fields: [
                    defineField({
                      name: "value",
                      type: "array",
                      of: [defineArrayMember({ type: "block" })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((rows) =>
          hasConsistentTableRows(rows)
            ? true
            : "Each table row must have the same number of cells.",
        ),
    }),
  ],
});
