// Pure date helpers for sitemap lastModified (no imports so node:test can load them).

export function parseDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;

  const time = Date.parse(value);

  return Number.isFinite(time) ? new Date(time) : undefined;
}

/** Newest valid date in the list, or undefined when there is none. */
export function newestDate(
  values: Iterable<string | null | undefined>,
): Date | undefined {
  let newest: Date | undefined;

  for (const value of values) {
    const date = parseDate(value);

    if (date && (!newest || date > newest)) newest = date;
  }

  return newest;
}
