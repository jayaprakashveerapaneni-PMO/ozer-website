import { describe, expect, it } from "vitest";
import { estimate } from "./estimator";

describe("estimator (FR-6)", () => {
  it("prices regular cleaning per hour band", () => {
    expect(estimate({ service: "cleaning", hours: 2, cleaningType: "regular" })).toMatchObject({
      low: 160,
      high: 240,
    });
  });

  it("deep clean is a flat package regardless of hours", () => {
    const e = estimate({ service: "cleaning", hours: 6, cleaningType: "deep" });
    expect(e.low).toBe(400);
    expect(e.high).toBe(400);
  });

  it("clamps absurd hour inputs and suggests deep clean (EC)", () => {
    const e = estimate({ service: "cleaning", hours: 24, cleaningType: "regular" });
    expect(e.low).toBe(80 * 8);
    expect(e.note).toMatch(/deep-clean/);
  });

  it("clamps zero and negative inputs to minimums (EC)", () => {
    expect(estimate({ service: "cleaning", hours: 0, cleaningType: "regular" }).low).toBe(80);
    expect(estimate({ service: "cook", cookMode: "person", people: -3 }).low).toBe(50);
  });

  it("prices cook per person and per dish", () => {
    expect(estimate({ service: "cook", cookMode: "person", people: 3 })).toMatchObject({ low: 150, high: 240 });
    expect(estimate({ service: "cook", cookMode: "dish", dishes: 2 })).toMatchObject({ low: 160, high: 500 });
  });

  it("prices laundry by kg and by piece (fixed, no band)", () => {
    const kg = estimate({ service: "laundry", laundryMode: "kg", kg: 4 });
    expect(kg.low).toBe(240);
    expect(kg.low).toBe(kg.high);
    const pieces = estimate({ service: "laundry", laundryMode: "piece", pieces: 10 });
    expect(pieces.low).toBe(80);
  });

  it("care notes the 6 AM–10 PM window (FR-53)", () => {
    const e = estimate({ service: "care", careMode: "hourly", careHours: 4 });
    expect(e).toMatchObject({ low: 400, high: 600 });
    expect(e.note).toMatch(/6 AM/);
    expect(estimate({ service: "care", careMode: "day", days: 2 }).low).toBe(1200);
  });
});
