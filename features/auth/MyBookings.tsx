"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CalendarClock, CheckCircle2, KeyRound, MapPin, Mic } from "lucide-react";
import { Badge } from "@/components/ui";
import { getBookingService } from "@/lib/services/booking-service";
import { serviceChecklist } from "@/lib/domain";
import {
  STATUS_STEPS,
  otpVisibleToCustomer,
  type Booking,
  type BookingStatus,
} from "@/lib/domain/types";
import { bookingsForCustomer } from "./bookings-for-customer";
import { cn } from "@/lib/cn";

function statusLabel(s: BookingStatus): string {
  return STATUS_STEPS.find((x) => x.key === s)?.label ?? s;
}

/** Bookings belonging to THIS signed-in customer only — matched on the
 *  account id (or email for rows made before ids existed). Live-updates via
 *  the booking service's realtime subscription. */
export default function MyBookings({ user }: { user: User }) {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const lastStatuses = useRef<Map<string, BookingStatus>>(new Map());

  const { id: customerId, email: customerEmail } = user;
  useEffect(() => {
    let cancelled = false;
    const svc = getBookingService();
    const load = async () => {
      try {
        const all = await svc.list();
        if (cancelled) return;
        const mine = bookingsForCustomer(all, { id: customerId, email: customerEmail });
        // Live completion notice when a helper finishes while we watch.
        for (const b of mine) {
          const prev = lastStatuses.current.get(b.id);
          if (prev && prev !== "completed" && b.status === "completed") {
            setToast(
              `${b.serviceName} completed${b.helperName ? ` by ${b.helperName}` : ""} — payment was already settled.`
            );
            window.setTimeout(() => {
              if (!cancelled) setToast(null);
            }, 6000);
          }
          lastStatuses.current.set(b.id, b.status);
        }
        setBookings(mine);
      } catch {
        if (!cancelled) setBookings([]);
      }
    };
    void load();
    const unsubscribe = svc.subscribe(() => void load());
    return () => { cancelled = true; unsubscribe(); };
  }, [customerId, customerEmail]);

  if (bookings === null) {
    return <p className="mt-6 text-sm text-muted">Loading your bookings…</p>;
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line p-5 text-center">
        <p className="text-sm font-medium text-muted">
          No bookings yet — your first one takes about two minutes.
        </p>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          role="status"
          className="animate-fade-up motion-reduce:animate-none glass fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-success shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {toast}
        </div>
      )}
    <ul className="mt-6 space-y-3">
      {bookings.map((b) => (
        <li key={b.id} className="rounded-2xl border border-line bg-surface/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold">
              {b.serviceName}
              {b.via === "voice" && (
                <Mic className="h-3.5 w-3.5 text-primary" aria-label="Started by voice" />
              )}
            </p>
            <Badge
              className={cn(
                b.status === "completed" && "bg-success/10 text-success",
                b.status !== "completed" && "bg-primary/10 text-primary"
              )}
            >
              {statusLabel(b.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">{b.detailLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden /> {b.slotLabel}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {b.zone}
            </span>
            {b.amountPaid != null && (
              <span className="font-semibold text-foreground/70">₹{b.amountPaid} paid</span>
            )}
            <span className="ml-auto font-mono text-[11px]">{b.id}</span>
          </div>
          {/* FR-16: recover the arrival OTP after the booking tab is gone —
              same visibility window as the booking screen. */}
          {otpVisibleToCustomer(b.status) && (
            <div className="mt-3 rounded-xl bg-surface p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
                <KeyRound className="h-3.5 w-3.5 text-primary" aria-hidden />
                Your arrival OTP
              </p>
              <p className="mt-1 font-display text-2xl font-bold tracking-[0.35em] text-primary">
                {b.otp}
              </p>
              <p className="mt-1 text-xs text-muted">
                Share only at your door — it proves the arriving person is{" "}
                {b.helperName ?? "your assigned helper"}.
              </p>
            </div>
          )}
          {b.status === "completed" && (
            <details className="mt-3 rounded-xl bg-success/10 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-success">
                Completed{b.helperName ? ` by ${b.helperName}` : ""} — what was covered
              </summary>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-foreground/80">
                {serviceChecklist(b.service).map((task) => (
                  <li key={task} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" aria-hidden />
                    {task}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </li>
      ))}
    </ul>
    </>
  );
}
