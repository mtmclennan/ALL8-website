import type { ReactNode } from "react";

/** Renders `**bold**` markdown-lite spans as <strong> — used for a handful of emphasized copy strings in data/home.json. */
export function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
