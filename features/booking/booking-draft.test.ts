// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { clearDraft, readDraft, saveDraft } from "./booking-draft";
import { DEFAULT_DETAILS } from "./useServiceDetails";
import { customerNameFromUser } from "@/lib/services/auth-service";

describe("booking draft (sign-in round-trip)", () => {
  beforeEach(() => clearDraft());

  it("round-trips the wizard state", () => {
    saveDraft({
      service: "cook",
      details: { ...DEFAULT_DETAILS, people: 5 },
      zone: "Kondapur",
      slotId: "tom-am",
      customDate: "",
      helperId: "h3",
    });
    const d = readDraft();
    expect(d?.service).toBe("cook");
    expect(d?.details.people).toBe(5);
    expect(d?.zone).toBe("Kondapur");
    expect(d?.slotId).toBe("tom-am");
    expect(d?.helperId).toBe("h3");
  });

  it("returns null when empty and after clearing", () => {
    expect(readDraft()).toBeNull();
    saveDraft({ service: "cleaning", details: DEFAULT_DETAILS, zone: "Madhapur", slotId: null, customDate: "", helperId: null });
    clearDraft();
    expect(readDraft()).toBeNull();
  });
});

describe("customer display name", () => {
  it("prefers metadata name, else prettifies the email prefix", () => {
    expect(customerNameFromUser({ email: "a@b.c", user_metadata: { full_name: "Jaya P" } })).toBe("Jaya P");
    expect(customerNameFromUser({ email: "jayaprakash.veerapaneni@thinkhat.ai", user_metadata: {} })).toBe(
      "Jayaprakash Veerapaneni"
    );
    expect(customerNameFromUser({ email: undefined, user_metadata: {} })).toBe("Customer");
  });
});
