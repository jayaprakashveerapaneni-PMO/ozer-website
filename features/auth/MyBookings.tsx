"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui";
import { getBookingService } from "@/lib/services/booking-service";
import { STATUS_STEPS, type Booking, type BookingStatus } from "@/lib/domain/types";
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

  const { id: customerId, email: customerEmail } = user;
  useEffect(() => {
    let cancelled = false;
    const svc = getBookingService();
    const load = async () => {
      try {
        const all = await svc.list();
        if (cancelled) return;
        setBookings(bookingsForCustomer(all, { id: customerId, email: customerEmail }));
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
    <ul className="mt-6 space-y-3">
      {bookings.map((b) => (
        <li key={b.id} className="rounded-2xl border border-line bg-surface/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm font-bold">{b.serviceName}</p>
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
        </li>
      ))}
    </ul>
  );
}
