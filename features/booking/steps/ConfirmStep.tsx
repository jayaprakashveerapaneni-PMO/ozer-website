"use client";

import { formatEstimate, type Estimate, type Helper } from "@/lib/domain";
import type { SlotOption } from "../booking.constants";

export default function ConfirmStep({
  serviceName,
  estimate,
  slot,
  customDate,
  helper,
  zone,
}: {
  serviceName: string;
  estimate: Estimate;
  slot: SlotOption | null;
  customDate: string;
  helper: Helper | null;
  zone: string;
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold">Review & confirm</h1>
      <div className="glass mt-6 space-y-3 rounded-3xl p-6 text-sm">
        <Row label="Service" value={`${serviceName} — ${estimate.label}`} />
        <Row label="Slot" value={slot?.id === "custom" ? customDate || "—" : slot?.label ?? "—"} />
        <Row label="Helper" value={helper ? `${helper.name} · ★ ${helper.rating}` : "—"} />
        <Row label="Area" value={`${zone}, Hyderabad`} />
        <div className="flex justify-between">
          <span className="text-muted">First-booking promo</span>
          <span className="font-semibold text-success">− ₹50 applied at checkout</span>
        </div>
        <div className="flex justify-between border-t border-line pt-3">
          <span className="text-muted">Estimate — pay after service</span>
          <span className="font-display text-lg font-bold text-primary-soft">
            {formatEstimate(estimate.low, estimate.high)}
          </span>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-surface p-3 text-xs text-muted">
        Free cancellation until a helper is assigned; a small fee applies once they&apos;re
        en route. Final bill = estimate + only add-ons you approve.
      </p>
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
