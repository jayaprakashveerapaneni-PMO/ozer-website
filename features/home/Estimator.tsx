"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Info } from "lucide-react";
import { SERVICES, formatEstimate, type ServiceId } from "@/lib/domain";
import ServiceDetailsFields from "@/features/booking/ServiceDetailsFields";
import { useServiceDetails } from "@/features/booking/useServiceDetails";

/** Marketing-page price estimator (FR-6): estimate visible before any login. */
export default function Estimator() {
  const [service, setService] = useState<ServiceId>("cleaning");
  const { details, set, estimate } = useServiceDetails(service);

  return (
    <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-a right-[10%] top-[20%] h-72 w-72 bg-cyan-400" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-5xl">
              <Calculator className="h-9 w-9 text-primary-soft" aria-hidden />
              <span>
                Know your price <span className="gradient-text">before you book</span>
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              No login needed to estimate. The final bill is your estimate plus only the
              add-ons you approve — never more.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                Rates are itemized per the published rate card; the version at your booking
                time is honoured even if rates change mid-booking.
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                First booking? A flat ₹50 promo is applied automatically at checkout.
              </li>
            </ul>
          </div>

          <div className="glass rounded-3xl p-6">
            <label htmlFor="est-service" className="mb-1 block text-sm font-medium">
              Service
            </label>
            <select
              id="est-service"
              value={service}
              onChange={(e) => setService(e.target.value as ServiceId)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [&>option]:bg-white"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-4">
              <ServiceDetailsFields service={service} details={details} set={set} idPrefix="est" />
            </div>

            <div className="glow-ring mt-6 rounded-2xl bg-surface p-4" aria-live="polite">
              <p className="text-sm font-medium text-muted">{estimate.label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary-soft text-glow">
                {formatEstimate(estimate.low, estimate.high)}
              </p>
              {estimate.note && <p className="mt-1 text-xs text-muted">{estimate.note}</p>}
            </div>

            <Link
              href={`/book?service=${service}`}
              className="btn-shine mt-4 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-[1.02]"
            >
              Continue to booking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
