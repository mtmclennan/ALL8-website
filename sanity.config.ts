import studioConfig from "./app/studio/sanity.config";

const studioProjectId = process.env.SANITY_STUDIO_PROJECT_ID;
const studioDataset = process.env.SANITY_STUDIO_DATASET;

if (!studioProjectId || !studioDataset) {
  throw new Error(
    "Hosted Studio builds require SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET",
  );
}

if (
  (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    studioProjectId !== process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) ||
  (process.env.NEXT_PUBLIC_SANITY_DATASET &&
    studioDataset !== process.env.NEXT_PUBLIC_SANITY_DATASET)
) {
  throw new Error(
    "Hosted Studio project and dataset must match the Next.js site",
  );
}

// Sanity hosting serves this Studio at the hostname root.
export default { ...studioConfig, basePath: "/" };
