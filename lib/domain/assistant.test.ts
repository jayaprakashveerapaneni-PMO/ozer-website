import { describe, expect, it } from "vitest";
import {
  clampSpokenHours,
  draftEstimate,
  draftSpeech,
  makeDraftId,
  makePairingCode,
  matchService,
  matchZone,
} from "./assistant";
import { ZONES } from "./catalog";

describe("matchService (spoken phrase → catalog service)", () => {
  it("matches catalog names and everyday synonyms", () => {
    expect(matchService("House Cleaning")).toBe("cleaning");
    expect(matchService("please clean my house")).toBe("cleaning");
    expect(matchService("I need a maid")).toBe("cleaning");
    expect(matchService("book a cook for dinner")).toBe("cook");
    expect(matchService("khana banane wali")).toBe("cook");
    expect(matchService("laundry pickup")).toBe("laundry");
    expect(matchService("istri")).toBe("laundry");
    expect(matchService("elder care for my father")).toBe("care");
    expect(matchService("ayah for the baby")).toBe("care");
  });

  it("returns null for unknown or empty phrases", () => {
    expect(matchService("plumbing")).toBeNull();
    expect(matchService("")).toBeNull();
    expect(matchService(null)).toBeNull();
    expect(matchService(undefined)).toBeNull();
  });
});

describe("matchZone", () => {
  it("matches serviceable zones case-insensitively", () => {
    expect(matchZone("in GACHIBOWLI please")).toBe("Gachibowli");
    expect(matchZone("hitech city")).toBe("Hitech City");
  });

  it("defaults to the first zone when unknown or missing", () => {
    expect(matchZone("somewhere else")).toBe(ZONES[0]);
    expect(matchZone(null)).toBe(ZONES[0]);
  });
});

describe("clampSpokenHours", () => {
  it("clamps to 1–12 and parses spoken numbers", () => {
    expect(clampSpokenHours(0)).toBe(1);
    expect(clampSpokenHours(99)).toBe(12);
    expect(clampSpokenHours("3")).toBe(3);
  });

  it("returns null when not provided (service default applies)", () => {
    expect(clampSpokenHours(null)).toBeNull();
    expect(clampSpokenHours(undefined)).toBeNull();
    expect(clampSpokenHours("three-ish")).toBeNull();
  });
});

describe("draft speech (FR-27 guardrail)", () => {
  it("quotes the estimate band and always routes payment to the website", () => {
    const s = draftSpeech("cleaning", 2, "Madhapur");
    const est = draftEstimate("cleaning", 2);
    expect(s).toContain(`${est.low} to ${est.high} rupees`);
    expect(s).toContain("Madhapur");
    expect(s.toLowerCase()).toContain("voice never completes a booking");
    expect(s.toLowerCase()).toContain("confirm and pay");
  });
});

describe("pairing code + draft id", () => {
  it("pairing code is 6 digits and never starts with 0", () => {
    for (const r of [0, 0.31, 0.9999]) {
      const code = makePairingCode(() => r);
      expect(code).toMatch(/^[1-9]\d{5}$/);
    }
  });

  it("draft ids are VD-prefixed and unambiguous", () => {
    const id = makeDraftId(() => 0.42);
    expect(id).toMatch(/^VD-[A-HJ-NP-Z2-9]{7}$/);
  });
});
