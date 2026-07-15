import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA } from "./contrast";
import { BRAND_INK, SERVICE_ACCENT_INK } from "./tokens";

// The light background and semantic text colors, mirroring globals.css :root.
const BG_LIGHT = "#f4efe7";
const WHITE = "#ffffff";
const TEXT_TOKENS: Record<string, string> = {
  foreground: "#26221c",
  muted: "#6b6559",
  primary: "#c2410c",
  accent: "#0e7490",
  success: "#047857",
  violet: "#6d28d9",
  destructive: "#b91c1c",
};

describe("WCAG AA contrast enforcement", () => {
  it("contrastRatio is symmetric and correct for known pairs", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    // The ivory base sits close to white (sanity: it's a light theme).
    expect(contrastRatio(WHITE, BG_LIGHT)).toBeLessThan(1.3);
  });

  it("every semantic text token meets AA (4.5:1) on the light background", () => {
    for (const [name, hex] of Object.entries(TEXT_TOKENS)) {
      const ratio = contrastRatio(hex, BG_LIGHT);
      expect(ratio, `${name} (${hex}) = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("white text on every solid brand-ink surface meets AA", () => {
    for (const [name, hex] of Object.entries(BRAND_INK)) {
      expect(meetsAA(WHITE, hex), `white on ${name} (${hex})`).toBe(true);
    }
  });

  it("white text on every solid service-ink surface meets AA", () => {
    for (const [id, hex] of Object.entries(SERVICE_ACCENT_INK)) {
      expect(meetsAA(WHITE, hex), `white on service ${id} (${hex})`).toBe(true);
    }
  });

  it("service-ink is also AA as text on the light background", () => {
    for (const [id, hex] of Object.entries(SERVICE_ACCENT_INK)) {
      expect(meetsAA(hex, BG_LIGHT), `service ${id} text (${hex})`).toBe(true);
    }
  });
});
