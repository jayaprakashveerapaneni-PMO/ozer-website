import { describe, expect, it } from "vitest";
import { stagger, prefersReducedMotion, DURATION, EASING } from "./index";

describe("motion helpers", () => {
  it("stagger scales linearly by step", () => {
    expect(stagger(0)).toBe(0);
    expect(stagger(1, 80)).toBe(80);
    expect(stagger(3, 100)).toBe(300);
  });

  it("stagger caps long lists so the tail never lags", () => {
    expect(stagger(20, 80, 8)).toBe(640); // capped at 8 * 80
  });

  it("prefersReducedMotion is false in a non-DOM (SSR) context", () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it("exposes motion tokens", () => {
    expect(DURATION.reveal).toBe(600);
    expect(EASING.emphasized).toContain("cubic-bezier");
  });
});
