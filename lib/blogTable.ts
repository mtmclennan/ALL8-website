export function getTableRowWidths(rows: unknown): number[] {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) =>
    row && typeof row === "object" && "cells" in row && Array.isArray(row.cells)
      ? row.cells.length
      : 0,
  );
}

export function hasConsistentTableRows(rows: unknown) {
  const widths = getTableRowWidths(rows);

  return widths.length < 2 || widths.every((width) => width === widths[0]);
}

export function getTableHeaderCount(
  headerRows: number | undefined,
  rowCount: number,
) {
  if (!Number.isFinite(headerRows)) return 0;

  return Math.min(rowCount, Math.max(0, Math.trunc(headerRows ?? 0)));
}
