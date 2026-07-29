import { describe, expect, it } from "vitest";
import { STATUS_STEPS, otpVisibleToCustomer, type BookingStatus } from "./types";

describe("otpVisibleToCustomer (FR-16 arrival OTP window)", () => {
  const visible: BookingStatus[] = ["assigned", "en_route"];

  it("shows the OTP only while a helper is assigned or on the way", () => {
    for (const s of visible) expect(otpVisibleToCustomer(s)).toBe(true);
  });

  it("hides the OTP before assignment and after the handshake", () => {
    const hidden = STATUS_STEPS.map((x) => x.key).filter((s) => !visible.includes(s));
    expect(hidden).toEqual(["pending_offer", "arrived", "in_progress", "completed"]);
    for (const s of hidden) expect(otpVisibleToCustomer(s)).toBe(false);
  });
});
