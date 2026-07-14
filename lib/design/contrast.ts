// WCAG 2.1 contrast math. Used by tests to *enforce* that every color we use
// for text or a solid interactive surface meets AA — so a future palette
// change that breaks accessibility fails CI instead of shipping.

function channel(hex: string, start: number): number {
  const v = parseInt(hex.replace("#", "").slice(start, start + 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** Relative luminance of a #rrggbb color per WCAG. */
export function luminance(hex: string): number {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 2) + 0.0722 * channel(hex, 4);
}

/** Contrast ratio (1–21) between two #rrggbb colors. */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** AA: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold). */
export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5);
}
