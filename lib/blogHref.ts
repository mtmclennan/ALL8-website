export function validateBlogHref(value: unknown): true | string {
  if (typeof value !== "string" || !value.trim()) {
    return "Enter an internal /path or a complete HTTPS URL.";
  }

  if (value !== value.trim()) {
    return "Remove spaces before or after the URL.";
  }

  if (/^\/(?!\/)[^\\\s]*$/.test(value)) return true;

  try {
    const url = new URL(value);

    return url.protocol === "https:" && !url.username && !url.password
      ? true
      : "External links must use HTTPS without credentials.";
  } catch {
    return "Use an internal /path or a complete HTTPS URL.";
  }
}
