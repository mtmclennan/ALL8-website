type Dimensions = { width?: number; height?: number };
type Crop = { left?: number; right?: number; top?: number; bottom?: number };

export type ArticleImageValue = {
  asset?: { _ref?: string };
  assetMetadata?: {
    dimensions?: Dimensions;
    description?: string | null;
    originalFilename?: string | null;
  } | null;
  crop?: Crop;
  alt?: string;
  decorative?: boolean;
  caption?: string;
  credit?: string;
  sourceUrl?: string;
};

function assetDimensions(value: ArticleImageValue): Dimensions | null {
  const dimensions = value.assetMetadata?.dimensions;

  if (dimensions?.width && dimensions.height) return dimensions;

  const match = value.asset?._ref?.match(/-(\d+)x(\d+)-[^-]+$/);

  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

export function getArticleImageDimensions(value: ArticleImageValue) {
  const dimensions = assetDimensions(value);
  const width = dimensions?.width;
  const height = dimensions?.height;

  if (!width || !height || width <= 0 || height <= 0) return null;

  const horizontalCrop = Math.max(
    0.01,
    1 - (value.crop?.left ?? 0) - (value.crop?.right ?? 0),
  );
  const verticalCrop = Math.max(
    0.01,
    1 - (value.crop?.top ?? 0) - (value.crop?.bottom ?? 0),
  );

  return {
    width: Math.max(1, Math.round(width * horizontalCrop)),
    height: Math.max(1, Math.round(height * verticalCrop)),
  };
}

export function getArticleImageAlt(
  value: ArticleImageValue,
  articleTitle: string,
) {
  if (value.decorative) return "";
  if (value.alt?.trim()) return value.alt.trim();
  if (value.caption?.trim()) return value.caption.trim();
  if (value.assetMetadata?.description?.trim()) {
    return value.assetMetadata.description.trim();
  }

  const filename = value.assetMetadata?.originalFilename
    ?.replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (filename) return filename.charAt(0).toUpperCase() + filename.slice(1);

  return `Illustration accompanying ${articleTitle}`;
}

export function getArticleImageSourceUrl(value: ArticleImageValue) {
  if (!value.sourceUrl) return null;

  try {
    const url = new URL(value.sourceUrl);

    return url.protocol === "https:" && !url.username && !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
