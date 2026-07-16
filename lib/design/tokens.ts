// Design tokens — the single source of truth for values that JavaScript and
// inline styles need (CSS-only tokens live in globals.css @theme). Three tiers:
//
//   1. PALETTE     — raw primitive colors (never referenced directly by UI)
//   2. semantic    — SERVICE_ACCENT / PERSONA_ACCENT etc.
//   3. component   — CONFETTI_COLORS and friends
//
// UI code imports the semantic/component tokens, never the palette. This is
// what lets Phase 6 fix an accent's contrast in exactly one place.

import type { ServiceId } from "@/lib/domain";

/** Tier 1 — primitive palette. Internal; do not import directly in components. */
const PALETTE = {
  saffron: "#fb923c",
  rose: "#f472b6",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  emerald: "#34d399",
} as const;

/** Append an alpha channel to a 6-digit hex, e.g. withAlpha("#fb923c", 0.2). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

/**
 * Two-value accent system (like Material's "container" / "on-container"):
 *   • *_ACCENT  — bright, for DECORATIVE fills only: translucent tints, blobs,
 *                 glows, borders. Contrast does not apply to these.
 *   • *_INK     — darker, WCAG-AA on the light background, for TEXT and SOLID
 *                 interactive surfaces (a solid button bg with white text).
 * The bright values fail AA as text (measured: 1.7–2.6:1); the ink values pass
 * (4.9–6.9:1) and white-on-ink also passes. Enforced by contrast.test.ts.
 */

/** Tier 2 — core brand colors (bright). MIRRORS globals.css :root; keep synced. */
export const BRAND = {
  primary: "#ea580c",
  accent: "#0891b2",
  violet: "#7c3aed",
  success: "#059669",
  rose: "#f472b6",
} as const;

/** Tier 2 — AA-safe brand colors for text and solid button backgrounds. */
export const BRAND_INK = {
  primary: "#c2410c",
  accent: "#0e7490",
  violet: "#6d28d9",
  success: "#047857",
  rose: "#be185d",
} as const;

/** Tier 2 — per-service accent (bright; decorative fills only). */
export const SERVICE_ACCENT: Record<ServiceId, string> = {
  cleaning: PALETTE.saffron,
  cook: PALETTE.rose,
  laundry: PALETTE.cyan,
  care: PALETTE.violet,
};

/** Tier 2 — AA-safe per-service accent for text and solid buttons. */
export const SERVICE_ACCENT_INK: Record<ServiceId, string> = {
  cleaning: BRAND_INK.primary,
  cook: BRAND_INK.rose,
  laundry: BRAND_INK.accent,
  care: BRAND_INK.violet,
};

/** Tier 2 — persona accent ordering (Divya, Anjali, Rao garu, Meena; bright). */
export const PERSONA_ACCENT = [
  PALETTE.saffron,
  PALETTE.violet,
  PALETTE.cyan,
  PALETTE.emerald,
] as const;

/** Tier 2 — AA-safe persona accents for text on the light background. */
export const PERSONA_ACCENT_INK = [
  BRAND_INK.primary,
  BRAND_INK.violet,
  BRAND_INK.accent,
  BRAND_INK.success,
] as const;

/** Tier 3 — confetti burst palette for the booking success screen. */
export const CONFETTI_COLORS = [
  PALETTE.saffron,
  PALETTE.cyan,
  PALETTE.violet,
  PALETTE.emerald,
  PALETTE.rose,
] as const;

/**
 * Motion tokens. Keep JS timings in lockstep with the CSS custom properties in
 * globals.css (--ease-*, --duration-*) so animation feels identical whether it
 * is driven by a class or an inline style.
 */
export const EASING = {
  /** Entrances / reveals — decelerating "expo out". */
  emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Standard UI transitions (hover, color). */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Ambient, looping motion. */
  smooth: "ease-in-out",
} as const;

export const DURATION = {
  fast: 150,
  base: 250,
  slow: 400,
  reveal: 600,
} as const;
