"use client";

import { ZONES, formatEstimate, type Estimate, type ServiceId } from "@/lib/domain";
import ServiceDetailsFields from "../ServiceDetailsFields";
import type { ServiceDetails } from "../useServiceDetails";

export default function DetailsStep({
  service,
  serviceName,
  details,
  set,
  estimate,
  zone,
  onZoneChange,
}: {
  service: ServiceId;
  serviceName: string;
  details: ServiceDetails;
  set: <K extends keyof ServiceDetails>(field: K, value: ServiceDetails[K]) => void;
  estimate: Estimate;
  zone: string;
  onZoneChange: (z: string) => void;
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold">{serviceName} — details</h1>
      <div className="mt-6 space-y-5">
        <ServiceDetailsFields service={service} details={details} set={set} idPrefix="bw" />

        <div>
          <label htmlFor="bw-zone" className="mb-1 block text-sm font-medium">
            Your area
          </label>
          <select
            id="bw-zone"
            value={zone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [&>option]:bg-white"
          >
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">All Hyderabad zones shown are serviceable.</p>
        </div>

        <div className="glow-ring rounded-2xl bg-surface p-4" aria-live="polite">
          <p className="text-sm text-muted">{estimate.label}</p>
          <p className="font-display text-2xl font-bold text-primary-soft">
            {formatEstimate(estimate.low, estimate.high)}
          </p>
          {estimate.note && <p className="mt-1 text-xs text-muted">{estimate.note}</p>}
        </div>
      </div>
    </div>
  );
}
