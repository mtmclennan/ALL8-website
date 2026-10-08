import clsx from "clsx";

type CoverFallbackProps = {
  label?: string | null;
  className?: string;
};

/**
 * Intentional placeholder for posts without a cover image. It keeps the card
 * geometry identical to covered posts without inventing editorial imagery.
 */
export default function CoverFallback({
  label,
  className,
}: CoverFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "absolute inset-0 flex items-end bg-content3 p-5",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(rgba(61,151,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,151,255,.07) 1px, transparent 1px), radial-gradient(70% 90% at 85% 15%, rgba(0,70,165,.45) 0%, transparent 70%)",
        backgroundSize: "28px 28px, 28px 28px, 100% 100%",
      }}
    >
      <span className="text-[13px] font-bold tracking-[.02em] text-white/70">
        {label || "ALL8 Webworks"}
      </span>
    </div>
  );
}
