import { describe, expect, it } from "vitest";
import { bookingsForCustomer } from "./bookings-for-customer";
import type { Booking } from "@/lib/domain/types";

function booking(partial: Partial<Booking>): Booking {
  return {
    id: "OZ-TEST",
    service: "cleaning",
    serviceName: "House cleaning",
    detailLabel: "2BHK",
    estLow: 300,
    estHigh: 500,
    slotLabel: "Today 4 PM",
    zone: "Madhapur",
    customerName: "Test",
    otp: "1234",
    status: "pending_offer",
    helperId: null,
    helperName: null,
    preferredHelperId: null,
    declinedBy: [],
    createdAt: 1,
    updatedAt: 1,
    via: "app",
    amountPaid: null,
    paymentId: null,
    paymentMethod: null,
    customerId: null,
    customerEmail: null,
    ...partial,
  } as Booking;
}

describe("bookingsForCustomer (per-account isolation)", () => {
  const mine = booking({ id: "OZ-A", customerId: "user-1" });
  const mineByEmail = booking({ id: "OZ-B", customerId: null, customerEmail: "me@x.com" });
  const theirs = booking({ id: "OZ-C", customerId: "user-2", customerEmail: "them@x.com" });
  const anonymous = booking({ id: "OZ-D" });
  const all = [mine, mineByEmail, theirs, anonymous];

  it("returns only this customer's bookings (id or legacy email match)", () => {
    const got = bookingsForCustomer(all, { id: "user-1", email: "me@x.com" });
    expect(got.map((b) => b.id)).toEqual(["OZ-A", "OZ-B"]);
  });

  it("different user gets a different, non-overlapping list", () => {
    const got = bookingsForCustomer(all, { id: "user-2", email: "them@x.com" });
    expect(got.map((b) => b.id)).toEqual(["OZ-C"]);
  });

  it("never matches rows with null ids/emails, even if the user has no email", () => {
    expect(bookingsForCustomer(all, { id: "user-3", email: null })).toEqual([]);
    expect(bookingsForCustomer([anonymous], { id: "user-1", email: "me@x.com" })).toEqual([]);
  });
});
