import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalBookingService, type StorageLike } from "./local-booking-service";
import type { NewBooking } from "@/lib/domain/types";

class FakeStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}

const newBooking = (over: Partial<NewBooking> = {}): NewBooking => ({
  service: "cleaning",
  serviceName: "House Cleaning",
  detailLabel: "2 hr regular cleaning",
  estLow: 160,
  estHigh: 240,
  slotLabel: "ASAP",
  zone: "Madhapur",
  customerName: "Test customer",
  preferredHelperId: null,
  via: "app",
  ...over,
});

describe("LocalBookingService", () => {
  let svc: LocalBookingService;

  beforeEach(() => {
    svc = new LocalBookingService(new FakeStorage());
  });

  it("creates bookings in pending_offer with a 4-digit OTP and unique ids", async () => {
    const a = await svc.create(newBooking());
    const b = await svc.create(newBooking());
    expect(a.status).toBe("pending_offer");
    expect(a.otp).toMatch(/^\d{4}$/);
    expect(a.id).toMatch(/^OZ-/);
    expect(a.id).not.toBe(b.id);
  });

  it("persists upfront payment fields and defaults them to null for legacy input", async () => {
    const paid = await svc.create(
      newBooking({ amountPaid: 200, paymentId: "PAY-TEST1", paymentMethod: "upi" })
    );
    expect(paid.amountPaid).toBe(200);
    expect(paid.paymentId).toBe("PAY-TEST1");
    expect(paid.paymentMethod).toBe("upi");

    const legacy = await svc.create(newBooking());
    expect(legacy.amountPaid).toBeNull();
    expect(legacy.paymentId).toBeNull();
    expect(legacy.paymentMethod).toBeNull();
  });

  it("lists newest first", async () => {
    const a = await svc.create(newBooking());
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 1000);
    const b = await svc.create(newBooking());
    vi.useRealTimers();
    const list = await svc.list();
    expect(list[0].id).toBe(b.id);
    expect(list[1].id).toBe(a.id);
  });

  it("updates status through the FSM and stamps updatedAt", async () => {
    const b = await svc.create(newBooking());
    const updated = await svc.update(b.id, { status: "assigned", helperId: "h1", helperName: "Meena K." });
    expect(updated?.status).toBe("assigned");
    expect(updated?.helperName).toBe("Meena K.");
    expect((await svc.get(b.id))?.status).toBe("assigned");
  });

  it("returns null when updating a missing booking", async () => {
    expect(await svc.update("OZ-NOPE", { status: "assigned" })).toBeNull();
  });

  it("notifies subscribers on create, update and wallet credit", async () => {
    const cb = vi.fn();
    const unsub = svc.subscribe(cb);
    const b = await svc.create(newBooking());
    await svc.update(b.id, { status: "assigned" });
    await svc.creditWallet("h1", 200);
    expect(cb).toHaveBeenCalledTimes(3);
    unsub();
    await svc.create(newBooking());
    expect(cb).toHaveBeenCalledTimes(3);
  });

  it("accumulates wallet credits per helper", async () => {
    expect(await svc.getWallet("h1")).toBe(0);
    await svc.creditWallet("h1", 200);
    expect(await svc.creditWallet("h1", 195)).toBe(395);
    expect(await svc.getWallet("h2")).toBe(0);
  });

  it("survives corrupted storage (EC)", async () => {
    const bad = new FakeStorage();
    bad.setItem("ozer-bookings", "{not json");
    const s2 = new LocalBookingService(bad);
    expect(await s2.list()).toEqual([]);
  });
});
