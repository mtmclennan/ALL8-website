type PortableTextBlock = {
  _type?: string;
  children?: { text?: string }[];
};

const WORDS_PER_MINUTE = 200;

/** Falls back to a computed estimate when the CMS's manual readingTime field is empty. */
export function estimateReadingTime(body?: PortableTextBlock[] | null): number {
  if (!body?.length) return 1;
  const words = body
    .filter((block) => block._type === "block")
    .flatMap((block) => block.children ?? [])
    .reduce(
      (count, span) => count + (span.text?.trim().split(/\s+/).length ?? 0),
      0,
    );

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
