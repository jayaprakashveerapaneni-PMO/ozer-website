import { afterEach, describe, expect, it, vi } from "vitest";
import { bookingEarnings, bookingQuote } from "@/lib/domain/types";
import {
  generatePaymentId,
  getPaymentMode,
  mintBuiltinPayment,
} from "./payment-service";

describe("payment-first pricing", () => {
  it("bookingQuote is the rounded midpoint of the band", () => {
    expect(bookingQuote(160, 240)).toBe(200);
    expect(bookingQuote(100, 101)).toBe(101); // rounds up at .5
    expect(bookingQuote(400, 400)).toBe(400);
  });

  it("helper earnings equal what the customer actually paid", () => {
    expect(bookingEarnings({ estLow: 160, estHigh: 240, amountPaid: 200 })).toBe(200);
    // legacy rows without a payment fall back to the quote
    expect(bookingEarnings({ estLow: 160, estHigh: 240, amountPaid: null })).toBe(200);
    expect(bookingEarnings({ estLow: 160, estHigh: 240 })).toBe(200);
  });
});

describe("payment service", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the builtin sandbox provider until Razorpay is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID", "");
    expect(getPaymentMode()).toBe("builtin");
  });

  it("switches to razorpay when the public key id is present", () => {
    vi.stubEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID", "rzp_test_abc123");
    expect(getPaymentMode()).toBe("razorpay");
  });

  it("mints well-formed sandbox payment records", () => {
    const rec = mintBuiltinPayment("upi", 298);
    expect(rec.paymentId).toMatch(/^PAY-/);
    expect(rec.method).toBe("upi");
    expect(rec.amount).toBe(298);
    expect(rec.provider).toBe("builtin");
  });

  it("payment ids are unique across rapid calls", () => {
    const ids = new Set(Array.from({ length: 50 }, () => generatePaymentId()));
    expect(ids.size).toBe(50);
  });
});
