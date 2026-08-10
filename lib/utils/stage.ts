export type Stage = "found" | "contacted" | "follow" | "win";

export const STAGE_HEX: Record<Stage, string> = {
  found: "#3D97FF",
  contacted: "#22d3ee",
  follow: "#f59e0b",
  win: "#22c55e",
};

export const STAGE_LABEL: Record<Stage, string> = {
  found: "Get Found",
  contacted: "Get Contacted",
  follow: "Respond & Follow Up",
  win: "Win More Work",
};

/** Dynamic per-stage colors can't be Tailwind-JIT-scanned, so we compute rgba() inline instead. */
export function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
