import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  // Next caches rendered routes. Regeneration must read the current publication.
  useCdn: false,
});
