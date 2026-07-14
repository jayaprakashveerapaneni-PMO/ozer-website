// Client-side booking store — the functional backbone of the front-to-back
// flow. Persists to localStorage and broadcasts changes via storage events
// (cross-tab) + a custom event (same-tab), so the customer screen and the
// helper portal react to each other in real time, no backend required.

import type { ServiceId } from "./data";

export type BookingStatus =
  | "pending_offer" // FR-11: offered to eligible helpers
  | "assigned"      // FR-12: helper accepted
  | "en_route"      // FR-14/15
  | "arrived"       // FR-16: OTP handshake passed
  | "in_progress"
  | "completed";

export interface Booking {
  id: string;
  service: ServiceId;
  serviceName: string;
  detailLabel: string;
  estLow: number;
  estHigh: number;
  slotLabel: string;
  zone: string;
  customerName: string;
  otp: string;
  status: BookingStatus;
  helperId: string | null;
  helperName: string | null;
  preferredHelperId: string | null;
  declinedBy: string[];
  createdAt: number;
  updatedAt: number;
  via: "voice" | "app";
}

const KEY = "ozer-bookings";
const EVT = "ozer-store-change";

function read(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function write(bookings: Booking[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(bookings));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getBookings(): Booking[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function getBooking(id: string): Booking | undefined {
  return read().find((b) => b.id === id);
}

export function createBooking(
  input: Omit<Booking, "id" | "otp" | "status" | "helperId" | "helperName" | "declinedBy" | "createdAt" | "updatedAt">
): Booking {
  const booking: Booking = {
    ...input,
    id: `OZ-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
    otp: String(Math.floor(1000 + Math.random() * 9000)),
    status: "pending_offer",
    helperId: null,
    helperName: null,
    declinedBy: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  write([...read(), booking]);
  return booking;
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | undefined {
  const bookings = read();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  bookings[idx] = { ...bookings[idx], ...patch, updatedAt: Date.now() };
  write(bookings);
  return bookings[idx];
}

export function clearCompleted(): void {
  write(read().filter((b) => b.status !== "completed"));
}

/** Subscribe to store changes from this tab AND other tabs. */
export function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb();
  };
  const onLocal = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVT, onLocal);
  };
}

// ---- Helper wallet ----

export function getWallet(helperId: string): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(`ozer-wallet-${helperId}`) ?? 0);
}

export function creditWallet(helperId: string, amount: number): number {
  const next = getWallet(helperId) + amount;
  window.localStorage.setItem(`ozer-wallet-${helperId}`, String(next));
  window.dispatchEvent(new CustomEvent(EVT));
  return next;
}

export const STATUS_STEPS: { key: BookingStatus; label: string }[] = [
  { key: "pending_offer", label: "Finding helper" },
  { key: "assigned", label: "Assigned" },
  { key: "en_route", label: "En route" },
  { key: "arrived", label: "Arrived" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
];

export function statusIndex(s: BookingStatus): number {
  return STATUS_STEPS.findIndex((x) => x.key === s);
}
