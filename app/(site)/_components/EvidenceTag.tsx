import clsx from "clsx";

export type EvidenceKind =
  | "measured"
  | "observed"
  | "in-validation"
  | "planned";

const STYLES: Record<EvidenceKind, { label: string; className: string }> = {
  measured: {
    label: "Measured",
    className:
      "border-[rgba(34,197,94,.35)] bg-[rgba(34,197,94,.12)] text-[#4ade80]",
  },
  observed: {
    label: "Observed",
    className:
      "border-[rgba(61,151,255,.35)] bg-[rgba(61,151,255,.12)] text-accent-blue",
  },
  "in-validation": {
    label: "In validation",
    className:
      "border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.12)] text-[#fbbf24]",
  },
  planned: {
    label: "Planned",
    className: "border-white/[0.14] bg-white/[0.05] text-white/70",
  },
};

/**
 * Proof status label. "Observed" is for point-in-time captures (page-one,
 * local or AI-result visibility) and must never be presented as measured.
 */
export default function EvidenceTag({
  kind,
  className,
}: {
  kind: EvidenceKind;
  className?: string;
}) {
  const style = STYLES[kind];

  return (
    <span
      className={clsx(
        "inline-flex w-fit rounded-md border px-2 py-0.5 text-[11.5px] font-bold leading-normal",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
