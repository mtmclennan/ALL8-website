import type { ReactNode } from "react";

/**
 * Section wrapper. It used to be a framer-motion client component, but with
 * `initial={false}` it rendered its final state immediately and never
 * animated, so it only added hydration cost. It is now a plain server-rendered
 * div with the same props, so call sites are unchanged.
 */
export default function Reveal({
  children,
  className,
  id,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  id?: string;
}) {
  return (
    <div className={className} id={id}>
      {children}
    </div>
  );
}
