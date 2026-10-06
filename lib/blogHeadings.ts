import { slugify } from "./utils/slugify.ts";

export type ArticleHeading = { id: string; text: string };

type HeadingCandidate = {
  _type: string;
  _key?: string;
  style?: string;
  children?: readonly { text?: string }[];
};

export function getBlockText(block: HeadingCandidate) {
  return (block.children ?? []).map((child) => child.text ?? "").join("");
}

export function buildArticleHeadings(
  body: readonly HeadingCandidate[] | null | undefined,
) {
  const toc: ArticleHeading[] = [];
  const idsByKey = new Map<string, string>();
  const usedIds = new Set<string>();

  body?.forEach((block, index) => {
    if (block._type !== "block" || !/^h[1-6]$/.test(block.style ?? "")) {
      return;
    }

    const text = getBlockText(block).trim();
    const base = slugify(text) || "section";
    let id = base;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${base}-${suffix++}`;
    }

    usedIds.add(id);
    idsByKey.set(block._key ?? `index:${index}`, id);

    // A legacy body H1 renders as H2 below the article's single page H1.
    if (block.style === "h1" || block.style === "h2") {
      toc.push({ id, text });
    }
  });

  return { toc, idsByKey };
}
