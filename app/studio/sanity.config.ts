/** Shared schema and plugins for the Sanity-hosted Studio. */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  "2025-11-19";
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Studio project ID and dataset are required");
}

export default defineConfig({
  basePath: "/",
  projectId,
  dataset,
  // Preserve the v5 Studio search behavior after upgrading to v6.
  search: { strategy: "groqLegacy" },
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  typescript: {
    generateTypes: true,
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
