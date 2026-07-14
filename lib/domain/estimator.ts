// Pricing estimator (FR-6): pure, deterministic, fully unit-tested.
// Inputs are clamped — absurd values never produce absurd prices.

import type { ServiceId } from "./types";

export interface EstimateInput {
  service: ServiceId;
  // cleaning
  hours?: number;
  cleaningType?: "regular" | "vessel" | "deep";
  // cook
  cookMode?: "person" | "dish";
  people?: number;
  dishes?: number;
  // laundry
  laundryMode?: "kg" | "piece";
  kg?: number;
  pieces?: number;
  // care
  careMode?: "hourly" | "day";
  careHours?: number;
  days?: number;
}

export interface Estimate {
  low: number;
  high: number;
  label: string;
  note?: string;
}

export const RATE_CARD = {
  cleaning: { hourlyLow: 80, hourlyHigh: 120, deepFlat: 400, maxHours: 8 },
  cook: { perPersonLow: 50, perPersonHigh: 80, perDishLow: 80, perDishHigh: 250 },
  laundry: { perKg: 60, perPiece: 8 },
  care: { hourlyLow: 100, hourlyHigh: 150, dayFlat: 600, maxHours: 12, maxDays: 14 },
} as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(Math.round(v) || lo, lo), hi);

export function estimate(input: EstimateInput): Estimate {
  const r = RATE_CARD;
  switch (input.service) {
    case "cleaning": {
      if (input.cleaningType === "deep") {
        return { low: r.cleaning.deepFlat, high: r.cleaning.deepFlat, label: "Deep clean — flat package" };
      }
      const hours = clamp(input.hours ?? 1, 1, r.cleaning.maxHours);
      const note =
        (input.hours ?? 1) > r.cleaning.maxHours
          ? "For jobs above 8 hours we suggest the deep-clean package."
          : undefined;
      return {
        low: r.cleaning.hourlyLow * hours,
        high: r.cleaning.hourlyHigh * hours,
        label: `${hours} hr ${input.cleaningType === "vessel" ? "vessel wash" : "regular cleaning"}`,
        note,
      };
    }
    case "cook": {
      if (input.cookMode === "dish") {
        const dishes = clamp(input.dishes ?? 1, 1, 20);
        return {
          low: r.cook.perDishLow * dishes,
          high: r.cook.perDishHigh * dishes,
          label: `${dishes} dish${dishes > 1 ? "es" : ""}`,
        };
      }
      const people = clamp(input.people ?? 2, 1, 20);
      return {
        low: r.cook.perPersonLow * people,
        high: r.cook.perPersonHigh * people,
        label: `Meal for ${people}`,
      };
    }
    case "laundry": {
      if (input.laundryMode === "piece") {
        const pieces = clamp(input.pieces ?? 10, 1, 200);
        return { low: r.laundry.perPiece * pieces, high: r.laundry.perPiece * pieces, label: `Ironing — ${pieces} pieces` };
      }
      const kg = clamp(input.kg ?? 4, 1, 50);
      return { low: r.laundry.perKg * kg, high: r.laundry.perKg * kg, label: `Wash & fold — ${kg} kg` };
    }
    case "care": {
      if (input.careMode === "day") {
        const days = clamp(input.days ?? 1, 1, r.care.maxDays);
        return {
          low: r.care.dayFlat * days,
          high: r.care.dayFlat * days,
          label: `Full day care × ${days}`,
          note: "Care window 6 AM – 10 PM",
        };
      }
      const hours = clamp(input.careHours ?? 4, 1, r.care.maxHours);
      return {
        low: r.care.hourlyLow * hours,
        high: r.care.hourlyHigh * hours,
        label: `${hours} hr certified care`,
        note: "Care window 6 AM – 10 PM",
      };
    }
  }
}
