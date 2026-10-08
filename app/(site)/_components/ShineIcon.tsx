// app/components/ui/ShineIcon.tsx
import type { LucideIcon } from "lucide-react";

export function ShineIcon({
  Icon,
  size = 32,
  tone = "dark", // "dark" or "light"
  className = "",
}: {
  Icon: LucideIcon;
  size?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      // flex-none / shrink-0 prevents the 27px squeeze
      className={`relative grid place-items-center overflow-hidden rounded-full flex-none ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size, // belt
        minHeight: size, // suspenders
      }}
    >
      <Icon
        aria-hidden
        className={tone === "dark" ? "text-[#0076FF]" : "text-[#0047BB]"}
        style={{ width: size, height: size, display: "block" }}
      />
    </span>
  );
}
