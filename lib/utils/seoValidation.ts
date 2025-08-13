import type { Metadata } from 'next';
import { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';

export function validateMetadata(
  title: string | null | TemplateString | undefined,
  description: string | null | TemplateString | undefined
): Metadata {
  const safeTitle = title ? String(title) : 'Default Title';
  const safeDescription = description
    ? String(description)
    : 'Default Description';

  if (safeTitle.length > 60) {
    console.warn(
      `⚠️ Meta Title too long (${safeTitle.length} chars): "${safeTitle}"`
    );
  }
  if (safeDescription.length > 160) {
    console.warn(
      `⚠️ Meta Description too long (${safeDescription.length} chars): "${safeDescription}"`
    );
  }

  return {
    title: safeTitle,
    description: safeDescription,
    openGraph: {
      title: safeTitle,
      description: safeDescription,
    },
  };
}
