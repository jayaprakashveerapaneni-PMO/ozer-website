"use client";

import { Bell, MapPin, X } from "lucide-react";
import { bookingEarnings, type Booking } from "@/lib/domain";

export default function OfferList({
  offers,
  serviceLabel,
  onAccept,
  onDecline,
}: {
  offers: Booking[];
  serviceLabel: string;
  onAccept: (b: Booking) => void;
  onDecline: (b: Booking) => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <Bell className="h-5 w-5 text-primary" aria-hidden />
        Job offers
        {offers.length > 0 && (
          <span className="step-live rounded-full bg-primary px-2.5 py-0.5 font-display text-xs font-bold text-on-primary">
            {offers.length}
          </span>
        )}
      </h2>

      {offers.length === 0 ? (
        <div className="glass mt-4 rounded-3xl p-8 text-center">
          <p className="font-semibold">No offers right now</p>
          <p className="mt-1 text-sm text-muted">
            You&apos;re online. The moment a customer books a {serviceLabel} job in your
            zones, it lands here instantly — already paid for, ready to accept.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {offers.map((o) => (
            <div key={o.id} className="glass glow-ring animate-fade-up rounded-3xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">{o.serviceName}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {o.detailLabel} · {o.slotLabel}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" aria-hidden /> {o.zone}, Hyderabad ·{" "}
                    {o.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    You earn
                  </p>
                  <p className="font-display text-2xl font-bold text-success">
                    ₹{bookingEarnings(o).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => onAccept(o)}
                  className="btn-shine flex-1 rounded-2xl bg-primary px-5 py-3.5 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
                >
                  Accept job
                </button>
                <button
                  type="button"
                  onClick={() => onDecline(o)}
                  className="glass inline-flex items-center gap-1.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-muted transition-colors hover:text-destructive"
                >
                  <X className="h-4 w-4" aria-hidden /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
