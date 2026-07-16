// Core domain types for Ozer. Single source of truth — UI, services and
// tests all import from here. No React, no browser APIs.

export type ServiceId = "cleaning" | "cook" | "laundry" | "care";

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  pricing: string;
  minNote: string;
  bullets: string[];
}

export interface Helper {
  id: string;
  name: string;
  services: ServiceId[];
  rating: number;
  jobs: number;
  distanceBand: string;
  languages: string[];
  /** Care certification (FR-37): required to receive care bookings. */
  certified?: boolean;
  initials: string;
  hue: number;
}

export type PaymentMethod = "upi" | "card" | "netbanking";

export type BookingStatus =
  | "pending_offer" // FR-11: offered to eligible helpers
  | "assigned" // FR-12: helper accepted
  | "en_route" // FR-14/15
  | "arrived" // FR-16: OTP handshake passed
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
  /** Payment-first (TR-20): captured BEFORE the booking is created. Null only
   *  on legacy rows created before upfront payment shipped. */
  amountPaid: number | null;
  paymentId: string | null;
  paymentMethod: PaymentMethod | null;
  /** Authenticated customer (Supabase auth). Null on legacy/guest rows. */
  customerId: string | null;
  customerEmail: string | null;
}

/** Fields the caller provides; the service fills in the rest. */
export type NewBooking = Omit<
  Booking,
  | "id"
  | "otp"
  | "status"
  | "helperId"
  | "helperName"
  | "declinedBy"
  | "createdAt"
  | "updatedAt"
  | "amountPaid"
  | "paymentId"
  | "paymentMethod"
  | "customerId"
  | "customerEmail"
> & {
  amountPaid?: number | null;
  paymentId?: string | null;
  paymentMethod?: PaymentMethod | null;
  customerId?: string | null;
  customerEmail?: string | null;
};

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

/** Fixed price charged upfront at booking — midpoint of the estimate band. */
export function bookingQuote(estLow: number, estHigh: number): number {
  return Math.round((estLow + estHigh) / 2);
}

/** Helper payout for a completed booking — what the customer paid upfront. */
export function bookingEarnings(
  b: Pick<Booking, "estLow" | "estHigh"> & { amountPaid?: number | null }
): number {
  return b.amountPaid ?? bookingQuote(b.estLow, b.estHigh);
}

/** Format an estimate band for display, e.g. "₹150 – ₹240" or "₹400". */
export function formatEstimate(low: number, high: number): string {
  const f = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return low === high ? f(low) : `${f(low)} – ${f(high)}`;
}
