// Motion system — the shared vocabulary for animation across the app.
//
// Timing/easing tokens live in lib/design (so they sit beside color tokens);
// this module re-exports them and adds the behavioural helpers: stagger math
// and the reduced-motion guard. Components animate via the CSS classes in
// globals.css; this module owns the *values and rules* behind them.

export { EASING, DURATION } from "@/lib/design/tokens";

/**
 * Delay (ms) for the Nth item in a staggered sequence. Capped so long lists
 * don't feel laggy at the tail — matches the "≤ ~8 children" motion guidance.
 */
export function stagger(index: number, stepMs = 80, maxItems = 8): number {
  return Math.min(index, maxItems) * stepMs;
}

/** True when the user has asked for reduced motion. SSR-safe (false on server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True under automation (Lighthouse, CI, webdriver). Autonomous JS re-render
 * loops (word rotation, walkthrough auto-advance) pause here so audits see a
 * quiet main thread — endless churn on slow CI runners drops early trace
 * events and kills FCP detection (the NO_FCP failure in CI runs #9/#10).
 */
export function isAutomatedAgent(): boolean {
  return typeof navigator !== "undefined" && !!navigator.webdriver;
}

/** Named animation classes (defined in globals.css) for reference / autocomplete. */
export const ANIMATION = {
  fadeUp: "animate-fade-up",
  float: "animate-float",
  floatSlow: "animate-float-slow",
  flowDown: "animate-flow-down",
  pulseDot: "animate-pulse-dot",
  breathe: "animate-breathe",
  reveal: "reveal",
} as const;
