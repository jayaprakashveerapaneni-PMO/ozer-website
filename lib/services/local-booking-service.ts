// LocalBookingService — localStorage persistence with cross-tab sync via
// the browser `storage` event and same-tab sync via an internal emitter.
// Storage is injectable so the adapter is unit-testable without a DOM.

import type { Booking, NewBooking } from "@/lib/domain/types";
import {
  generateBookingId,
  generateOtp,
  type BookingService,
} from "./booking-service";

const BOOKINGS_KEY = "ozer-bookings";
const walletKey = (helperId: string) => `ozer-wallet-${helperId}`;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export class LocalBookingService implements BookingService {
  readonly mode = "local" as const;
  private listeners = new Set<() => void>();
  private storage: StorageLike;

  constructor(storage?: StorageLike) {
    this.storage =
      storage ??
      (typeof window !== "undefined"
        ? window.localStorage
        : new MemoryStorage());
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === BOOKINGS_KEY || e.key === null || e.key?.startsWith("ozer-wallet-")) {
          this.emit();
        }
      });
    }
  }

  private read(): Booking[] {
    try {
      return JSON.parse(this.storage.getItem(BOOKINGS_KEY) ?? "[]") as Booking[];
    } catch {
      return [];
    }
  }

  private write(bookings: Booking[]): void {
    this.storage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((cb) => cb());
  }

  async list(): Promise<Booking[]> {
    return this.read().sort((a, b) => b.createdAt - a.createdAt);
  }

  async get(id: string): Promise<Booking | null> {
    return this.read().find((b) => b.id === id) ?? null;
  }

  async create(input: NewBooking): Promise<Booking> {
    const now = Date.now();
    const booking: Booking = {
      ...input,
      id: generateBookingId(now),
      otp: generateOtp(),
      status: "pending_offer",
      helperId: null,
      helperName: null,
      declinedBy: [],
      createdAt: now,
      updatedAt: now,
      amountPaid: input.amountPaid ?? null,
      paymentId: input.paymentId ?? null,
      paymentMethod: input.paymentMethod ?? null,
    };
    this.write([...this.read(), booking]);
    return booking;
  }

  async update(id: string, patch: Partial<Booking>): Promise<Booking | null> {
    const bookings = this.read();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    bookings[idx] = { ...bookings[idx], ...patch, updatedAt: Date.now() };
    this.write(bookings);
    return bookings[idx];
  }

  subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async getWallet(helperId: string): Promise<number> {
    return Number(this.storage.getItem(walletKey(helperId)) ?? 0);
  }

  async creditWallet(helperId: string, amount: number): Promise<number> {
    const next = (await this.getWallet(helperId)) + amount;
    this.storage.setItem(walletKey(helperId), String(next));
    this.emit();
    return next;
  }
}

/** SSR-safe no-op storage (server render never persists). */
class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}
