// Design tokens — the single source of truth for values that JavaScript and
// inline styles need (CSS-only tokens live in globals.css @theme). Three tiers:
//
//   1. PALETTE     — raw primitive colors (never referenced directly by UI)
//   2. semantic    — SERVICE_ACCENT / ASSISTANT_ACCENT / PERSONA_ACCENT etc.
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
  sky: "#38bdf8",
} as const;

/** Append an alpha channel to a 6-digit hex, e.g. withAlpha("#fb923c", 0.2). */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

/**
 * Tier 2 — core brand colors for JS/inline-style consumers. These MIRROR the
 * semantic custom properties in globals.css (:root); keep the two in sync.
 * (JS cannot read CSS custom properties at module-eval / SSR time, so a static
 * mirror is unavoidable without a token-codegen build step.)
 */
export const BRAND = {
  primary: "#ea580c",
  accent: "#0891b2",
  violet: "#7c3aed",
  success: "#059669",
  rose: "#f472b6",
} as const;

/** Tier 2 — per-service accent (Services grid, Personas, booking accents). */
export const SERVICE_ACCENT: Record<ServiceId, string> = {
  cleaning: PALETTE.saffron,
  cook: PALETTE.rose,
  laundry: PALETTE.cyan,
  care: PALETTE.violet,
};

export type AssistantId = "alexa" | "siri" | "google";

/** Tier 2 — voice-assistant brand accents. */
export const ASSISTANT_ACCENT: Record<AssistantId, string> = {
  alexa: PALETTE.sky,
  siri: PALETTE.violet,
  google: PALETTE.emerald,
};

/** Tier 2 — persona accent ordering (Divya, Anjali, Rao garu, Meena). */
export const PERSONA_ACCENT = [
  PALETTE.saffron,
  PALETTE.violet,
  PALETTE.cyan,
  PALETTE.emerald,
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
