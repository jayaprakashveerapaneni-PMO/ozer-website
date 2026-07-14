// BookingService — the seam between UI and persistence.
//
// Two implementations exist:
//   • LocalBookingService  — browser localStorage, zero-config, single-device.
//   • SupabaseBookingService — free-tier Postgres + Realtime, multi-device.
//
// The factory picks Supabase automatically when NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY are configured; otherwise it falls back to
// local so the product always works. UI code depends ONLY on this interface —
// swapping backends never touches a component.

import type { Booking, NewBooking } from "@/lib/domain/types";

export interface BookingService {
  /** All bookings, newest first. */
  list(): Promise<Booking[]>;
  get(id: string): Promise<Booking | null>;
  create(input: NewBooking): Promise<Booking>;
  update(id: string, patch: Partial<Booking>): Promise<Booking | null>;
  /** Fires on any data change (local writes and remote/realtime ones). */
  subscribe(cb: () => void): () => void;
  getWallet(helperId: string): Promise<number>;
  creditWallet(helperId: string, amount: number): Promise<number>;
  /** Which backend is active — surfaced in the UI so demos are honest. */
  readonly mode: "local" | "supabase";
}

/** Human-readable, collision-resistant booking id (time-ordered). */
export function generateBookingId(now: number = Date.now()): string {
  const time = now.toString(36).slice(-4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `OZ-${time}${rand}`;
}

export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

let instance: BookingService | null = null;

/** Lazily constructed singleton; safe to call from any client component. */
export function getBookingService(): BookingService {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    // Dynamic require keeps supabase-js out of the bundle when unconfigured.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SupabaseBookingService } = require("./supabase-booking-service") as typeof import("./supabase-booking-service");
    instance = new SupabaseBookingService(url, key);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LocalBookingService } = require("./local-booking-service") as typeof import("./local-booking-service");
    instance = new LocalBookingService();
  }
  return instance;
}

/** Test-only: replace or reset the singleton. */
export function setBookingServiceForTesting(svc: BookingService | null): void {
  instance = svc;
}
