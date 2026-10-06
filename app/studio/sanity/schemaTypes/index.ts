import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import postType from "./postType";
import { authorType } from "./authorType";
import { seoFields } from "./seoFields";
import blogPage from "./blogPage";
import { tableType } from "./tableType";
import { bodyImageType } from "./bodyImageType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    seoFields,
    blogPage,
    tableType,
    bodyImageType,
  ],
};
