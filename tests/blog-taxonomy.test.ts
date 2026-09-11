import assert from "node:assert/strict";
import test from "node:test";

import {
  formatCategoryLabel,
  postMatchesBlogTopic,
} from "../lib/blogTaxonomy.ts";

test("normalizes the AI SEO label without changing its URL slug", () => {
  assert.equal(formatCategoryLabel("Ai SEO", "ai-seo"), "AI SEO");
  assert.equal(formatCategoryLabel("Local SEO", "local-seo"), "Local SEO");
});

test("groups overlapping Sanity categories into useful visitor topics", () => {
  const searchPost = {
    title: "Why Your Business Is Not Showing Up on Google Maps",
    categories: [{ title: "Local SEO", slug: "local-seo" }],
  };
  const websitePost = {
    title: "More Traffic Won't Fix the Wrong Website",
    categories: [
      { title: "Conversion Optimization", slug: "conversion-optimization" },
    ],
  };
  const systemsPost = {
    title: "The Problem Wasn't Skill. It Was the System.",
    categories: [
      { title: "Systems & Operations", slug: "systems-and-operations" },
    ],
  };

  assert.equal(postMatchesBlogTopic(searchPost, "search-visibility"), true);
  assert.equal(postMatchesBlogTopic(websitePost, "websites-conversion"), true);
  assert.equal(
    postMatchesBlogTopic(systemsPost, "lead-systems-operations"),
    true,
  );
});
