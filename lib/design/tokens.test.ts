import { describe, expect, it } from "vitest";
import { SERVICES } from "@/lib/domain";
import { SERVICE_ACCENT, ASSISTANT_ACCENT, CONFETTI_COLORS, withAlpha } from "./tokens";

describe("design tokens", () => {
  it("withAlpha appends a correct 2-digit hex alpha", () => {
    expect(withAlpha("#ea580c", 1)).toBe("#ea580cff");
    expect(withAlpha("#ea580c", 0)).toBe("#ea580c00");
    expect(withAlpha("#ea580c", 0.5)).toBe("#ea580c80");
  });

  it("withAlpha clamps out-of-range alpha", () => {
    expect(withAlpha("#ea580c", 2)).toBe("#ea580cff");
    expect(withAlpha("#ea580c", -1)).toBe("#ea580c00");
  });

  it("every service has an accent token", () => {
    for (const s of SERVICES) {
      expect(SERVICE_ACCENT[s.id]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("all three assistants have brand accents", () => {
    expect(Object.keys(ASSISTANT_ACCENT).sort()).toEqual(["alexa", "google", "siri"]);
  });

  it("confetti palette is non-empty and valid hex", () => {
    expect(CONFETTI_COLORS.length).toBeGreaterThan(0);
    CONFETTI_COLORS.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
  });
});
