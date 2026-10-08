// Sanity stores publishedAt as a UTC timestamp. Formatting in UTC keeps the
// rendered date identical on the server, in the browser and across cards.
const formatters = {
  long: new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }),
  short: new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }),
} as const;

export function formatPostDate(
  value: string | undefined | null,
  style: keyof typeof formatters = "short",
) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return formatters[style].format(date);
}

/** Only an explicit editorial update on a later calendar day counts as "Updated". */
export function getMeaningfulUpdateDate(
  publishedAt: string | undefined | null,
  updatedAt: string | undefined | null,
) {
  if (!publishedAt || !updatedAt) return null;

  const published = new Date(publishedAt);
  const updated = new Date(updatedAt);

  if (Number.isNaN(published.getTime()) || Number.isNaN(updated.getTime())) {
    return null;
  }

  const publishedDay = published.toISOString().slice(0, 10);
  const updatedDay = updated.toISOString().slice(0, 10);

  return updatedDay > publishedDay ? updatedAt : null;
}
