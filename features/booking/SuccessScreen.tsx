"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, BellRing } from "lucide-react";
import {
  STATUS_STEPS,
  formatEstimate,
  statusIndex,
  type Booking,
} from "@/lib/domain";
import { getBookingService } from "@/lib/services/booking-service";
import { CONFETTI } from "./booking.constants";

/**
 * Post-confirmation screen: live status timeline driven by real helper
 * actions (FR-14), arrival OTP (FR-16), and the handoff into the helper app.
 */
export default function SuccessScreen({
  bookingId,
  onReset,
}: {
  bookingId: string;
  onReset: () => void;
}) {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const svc = getBookingService();
    let alive = true;
    const sync = () => {
      void svc.get(bookingId).then((b) => {
        if (alive) setBooking(b);
      });
    };
    sync();
    const unsub = svc.subscribe(sync);
    return () => {
      alive = false;
      unsub();
    };
  }, [bookingId]);

  const cur = booking ? statusIndex(booking.status) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="glass animate-fade-up relative overflow-hidden rounded-3xl p-8 text-center glow-ring">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden>
          {CONFETTI.map((f, i) => (
            <span
              key={i}
              className="confetti"
              style={{ left: f.l, background: f.c, animationDelay: `${f.d}s` }}
            />
          ))}
        </div>
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Booking confirmed</h1>
        <p className="mt-1 font-display text-lg font-bold text-primary text-glow">
          {bookingId}
        </p>

        {booking && (
          <div className="mt-6 space-y-3 rounded-2xl bg-surface p-5 text-left text-sm">
            <Row label="Service" value={`${booking.serviceName} — ${booking.detailLabel}`} />
            <Row label="Slot" value={booking.slotLabel} />
            <div className="flex justify-between">
              <span className="text-muted">Helper</span>
              <span className="font-semibold">
                {booking.helperName ? (
                  <span className="text-success">{booking.helperName} ✓ accepted</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="ml-1">Offering to nearby helpers…</span>
                  </span>
                )}
              </span>
            </div>
            <Row label="Area" value={`${booking.zone}, Hyderabad`} />
            <div className="flex justify-between border-t border-line pt-3">
              <span className="text-muted">Estimate (pay after)</span>
              <span className="font-display font-bold text-primary">
                {formatEstimate(booking.estLow, booking.estHigh)}
              </span>
            </div>
          </div>
        )}

        {/* live status timeline */}
        <ol
          className="mt-6 flex items-center justify-between text-xs text-muted"
          aria-label="Booking status timeline"
          aria-live="polite"
        >
          {STATUS_STEPS.map((s, i) => (
            <li key={s.key} className="flex flex-col items-center gap-1">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${
                  i < cur ? "bg-success" : i === cur ? "bg-primary step-live" : "bg-black/10"
                }`}
                aria-hidden
              />
              <span className={i <= cur ? "font-semibold text-foreground" : ""}>{s.label}</span>
            </li>
          ))}
        </ol>

        {/* arrival OTP (FR-16) */}
        {booking && (booking.status === "en_route" || booking.status === "assigned") && (
          <div className="glow-ring animate-fade-up mx-auto mt-6 max-w-xs rounded-2xl bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Your arrival OTP
            </p>
            <p className="mt-1 font-display text-4xl font-bold tracking-[0.35em] text-primary text-glow">
              {booking.otp}
            </p>
            <p className="mt-1.5 text-xs text-muted">
              Share only at your door — it proves the arriving person is{" "}
              {booking.helperName ?? "your assigned helper"}.
            </p>
          </div>
        )}

        {booking?.status === "completed" && (
          <p className="animate-fade-up mt-6 rounded-2xl bg-success/10 p-4 text-sm font-semibold text-success">
            Job completed! Pay via UPI/card now — and rate {booking.helperName} to save
            them as a favourite.
          </p>
        )}

        <p className="mt-6 rounded-2xl bg-surface p-3 text-xs text-muted">
          <BellRing className="mr-1 inline h-3.5 w-3.5 text-primary" aria-hidden />
          This screen updates <strong className="text-foreground/80">live</strong> as the
          helper acts. Open the helper app to accept this job and watch the timeline move.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/helper"
            target="_blank"
            className="btn-shine inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-105"
          >
            <BellRing className="h-4 w-4" aria-hidden /> See the helper&apos;s notification →
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="glass rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:text-primary"
          >
            Book another service
          </button>
          <Link
            href="/"
            className="glass rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:text-primary"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
