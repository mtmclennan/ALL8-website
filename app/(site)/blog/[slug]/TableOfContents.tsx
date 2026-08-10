"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string };

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <aside
      aria-label="On this page"
      className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.036] p-[22px]"
    >
      <h4 className="mb-3.5 text-[11px] font-bold uppercase tracking-[.13em] text-white/70">
        On this page
      </h4>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              className={
                activeId === item.id
                  ? "-ml-3 block border-l-2 border-primary py-2 pl-3 text-[13.5px] leading-snug text-accent-blue"
                  : "-ml-3 block border-l-2 border-transparent py-2 pl-3 text-[13.5px] leading-snug text-white/70 hover:border-white/[0.14] hover:text-white"
              }
              href={`#${item.id}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
