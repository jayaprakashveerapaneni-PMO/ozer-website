// SupabaseBookingService — free-tier Postgres + Realtime backend.
// Multi-device: a booking placed on a phone appears on a helper's phone
// instantly via a Realtime channel. Schema: supabase/migrations/001_init.sql.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Booking,
  BookingStatus,
  NewBooking,
  PaymentMethod,
  ServiceId,
} from "@/lib/domain/types";
import {
  generateBookingId,
  generateOtp,
  type BookingService,
} from "./booking-service";

/** Row shape in Postgres (snake_case). */
interface BookingRow {
  id: string;
  service: ServiceId;
  service_name: string;
  detail_label: string;
  est_low: number;
  est_high: number;
  slot_label: string;
  zone: string;
  customer_name: string;
  otp: string;
  status: BookingStatus;
  helper_id: string | null;
  helper_name: string | null;
  preferred_helper_id: string | null;
  declined_by: string[];
  created_at: number;
  updated_at: number;
  via: "voice" | "app";
  amount_paid?: number | null;
  payment_id?: string | null;
  payment_method?: PaymentMethod | null;
}

function toBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    service: r.service,
    serviceName: r.service_name,
    detailLabel: r.detail_label,
    estLow: r.est_low,
    estHigh: r.est_high,
    slotLabel: r.slot_label,
    zone: r.zone,
    customerName: r.customer_name,
    otp: r.otp,
    status: r.status,
    helperId: r.helper_id,
    helperName: r.helper_name,
    preferredHelperId: r.preferred_helper_id,
    declinedBy: r.declined_by ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    via: r.via,
    amountPaid: r.amount_paid ?? null,
    paymentId: r.payment_id ?? null,
    paymentMethod: r.payment_method ?? null,
  };
}

function toPatchRow(patch: Partial<Booking>): Partial<BookingRow> {
  const row: Partial<BookingRow> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.helperId !== undefined) row.helper_id = patch.helperId;
  if (patch.helperName !== undefined) row.helper_name = patch.helperName;
  if (patch.declinedBy !== undefined) row.declined_by = patch.declinedBy;
  row.updated_at = Date.now();
  return row;
}

export class SupabaseBookingService implements BookingService {
  readonly mode = "supabase" as const;
  private client: SupabaseClient;
  private listeners = new Set<() => void>();
  private channelStarted = false;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  private ensureChannel(): void {
    if (this.channelStarted || typeof window === "undefined") return;
    this.channelStarted = true;
    this.client
      .channel("ozer-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => this.emit())
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, () => this.emit())
      .subscribe();
  }

  private emit(): void {
    this.listeners.forEach((cb) => cb());
  }

  async list(): Promise<Booking[]> {
    const { data, error } = await this.client
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(`bookings.list failed: ${error.message}`);
    return (data as BookingRow[]).map(toBooking);
  }

  async get(id: string): Promise<Booking | null> {
    const { data, error } = await this.client
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`bookings.get failed: ${error.message}`);
    return data ? toBooking(data as BookingRow) : null;
  }

  async create(input: NewBooking): Promise<Booking> {
    const now = Date.now();
    const row: BookingRow = {
      id: generateBookingId(now),
      service: input.service,
      service_name: input.serviceName,
      detail_label: input.detailLabel,
      est_low: input.estLow,
      est_high: input.estHigh,
      slot_label: input.slotLabel,
      zone: input.zone,
      customer_name: input.customerName,
      otp: generateOtp(),
      status: "pending_offer",
      helper_id: null,
      helper_name: null,
      preferred_helper_id: input.preferredHelperId,
      declined_by: [],
      created_at: now,
      updated_at: now,
      via: input.via,
      amount_paid: input.amountPaid ?? null,
      payment_id: input.paymentId ?? null,
      payment_method: input.paymentMethod ?? null,
    };
    const { error } = await this.client.from("bookings").insert(row);
    if (error && /column|schema cache/i.test(error.message)) {
      // Payment columns not migrated yet (002_payments.sql) — degrade
      // gracefully so bookings never fail, but make the drift loud.
      console.warn(`bookings.create: retrying without payment columns — apply supabase/migrations/002_payments.sql (${error.message})`);
      const legacy = { ...row };
      delete legacy.amount_paid;
      delete legacy.payment_id;
      delete legacy.payment_method;
      const retry = await this.client.from("bookings").insert(legacy);
      if (retry.error) throw new Error(`bookings.create failed: ${retry.error.message}`);
    } else if (error) {
      throw new Error(`bookings.create failed: ${error.message}`);
    }
    return toBooking(row);
  }

  async update(id: string, patch: Partial<Booking>): Promise<Booking | null> {
    const { data, error } = await this.client
      .from("bookings")
      .update(toPatchRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`bookings.update failed: ${error.message}`);
    return data ? toBooking(data as BookingRow) : null;
  }

  subscribe(cb: () => void): () => void {
    this.ensureChannel();
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  async getWallet(helperId: string): Promise<number> {
    const { data, error } = await this.client
      .from("wallets")
      .select("balance")
      .eq("helper_id", helperId)
      .maybeSingle();
    if (error) throw new Error(`wallets.get failed: ${error.message}`);
    return (data?.balance as number | undefined) ?? 0;
  }

  async creditWallet(helperId: string, amount: number): Promise<number> {
    // Atomic server-side increment — no read-modify-write races.
    const { data, error } = await this.client.rpc("increment_wallet", {
      p_helper_id: helperId,
      p_amount: amount,
    });
    if (error) throw new Error(`wallets.credit failed: ${error.message}`);
    return data as number;
  }
}
