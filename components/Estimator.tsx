"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Info } from "lucide-react";
import { SERVICES, estimate, type EstimateInput, type ServiceId } from "@/lib/data";

export default function Estimator() {
  const [service, setService] = useState<ServiceId>("cleaning");
  const [hours, setHours] = useState(2);
  const [cleaningType, setCleaningType] = useState<"regular" | "vessel" | "deep">("regular");
  const [cookMode, setCookMode] = useState<"person" | "dish">("person");
  const [people, setPeople] = useState(3);
  const [dishes, setDishes] = useState(3);
  const [laundryMode, setLaundryMode] = useState<"kg" | "piece">("kg");
  const [kg, setKg] = useState(4);
  const [pieces, setPieces] = useState(10);
  const [careMode, setCareMode] = useState<"hourly" | "day">("hourly");
  const [careHours, setCareHours] = useState(4);
  const [days, setDays] = useState(1);

  const input: EstimateInput = useMemo(
    () => ({
      service, hours, cleaningType, cookMode, people, dishes,
      laundryMode, kg, pieces, careMode, careHours, days,
    }),
    [service, hours, cleaningType, cookMode, people, dishes, laundryMode, kg, pieces, careMode, careHours, days]
  );

  const est = estimate(input);

  const numberField = (
    id: string, label: string, value: number, set: (n: number) => void,
    min: number, max: number, unit?: string
  ) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id} type="number" inputMode="numeric" min={min} max={max} value={value}
          onChange={(e) => set(Number(e.target.value))}
          className="w-24 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground focus:border-primary"
        />
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
    </div>
  );

  const segmented = <T extends string>(
    label: string, options: { value: T; label: string }[], current: T, set: (v: T) => void
  ) => (
    <fieldset>
      <legend className="mb-1 block text-sm font-medium">{label}</legend>
      <div className="inline-flex flex-wrap rounded-xl border border-line bg-surface p-1" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value} type="button" role="radio" aria-checked={current === o.value}
            onClick={() => set(o.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
              current === o.value ? "bg-primary text-on-primary" : "text-muted hover:text-primary-soft"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <section id="pricing" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-a right-[10%] top-[20%] h-72 w-72 bg-cyan-400" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-5xl">
              <Calculator className="h-9 w-9 text-primary-soft" aria-hidden />
              <span>Know your price <span className="gradient-text">before you book</span></span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              No login needed to estimate. The final bill is your estimate plus
              only the add-ons you approve — never more.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                Rates are itemized per the published rate card; the version at
                your booking time is honoured even if rates change mid-booking.
              </li>
              <li className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                First booking? A flat ₹50 promo is applied automatically at checkout.
              </li>
            </ul>
          </div>

          <div className="glass rounded-3xl p-6">
            <label htmlFor="est-service" className="mb-1 block text-sm font-medium">Service</label>
            <select
              id="est-service"
              value={service}
              onChange={(e) => setService(e.target.value as ServiceId)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [&>option]:bg-white"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <div className="mt-4 space-y-4">
              {service === "cleaning" && (
                <>
                  {segmented("Cleaning type", [
                    { value: "regular", label: "Regular" },
                    { value: "vessel", label: "Vessel wash" },
                    { value: "deep", label: "Deep clean" },
                  ], cleaningType, setCleaningType)}
                  {cleaningType !== "deep" &&
                    numberField("est-hours", "Hours", hours, setHours, 1, 8, "hrs (min 1)")}
                </>
              )}
              {service === "cook" && (
                <>
                  {segmented("Pricing mode", [
                    { value: "person", label: "Per person" },
                    { value: "dish", label: "Per dish" },
                  ], cookMode, setCookMode)}
                  {cookMode === "person"
                    ? numberField("est-people", "People", people, setPeople, 1, 20)
                    : numberField("est-dishes", "Dishes", dishes, setDishes, 1, 20)}
                </>
              )}
              {service === "laundry" && (
                <>
                  {segmented("Service", [
                    { value: "kg", label: "Wash & fold" },
                    { value: "piece", label: "Ironing" },
                  ], laundryMode, setLaundryMode)}
                  {laundryMode === "kg"
                    ? numberField("est-kg", "Weight", kg, setKg, 1, 50, "kg")
                    : numberField("est-pieces", "Pieces", pieces, setPieces, 1, 200)}
                </>
              )}
              {service === "care" && (
                <>
                  {segmented("Duration", [
                    { value: "hourly", label: "Hourly" },
                    { value: "day", label: "Full day" },
                  ], careMode, setCareMode)}
                  {careMode === "hourly"
                    ? numberField("est-care-hours", "Hours", careHours, setCareHours, 1, 12, "hrs")
                    : numberField("est-days", "Days", days, setDays, 1, 14)}
                </>
              )}
            </div>

            <div className="glow-ring mt-6 rounded-2xl bg-surface p-4" aria-live="polite">
              <p className="text-sm font-medium text-muted">{est.label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary-soft text-glow">
                {est.low === est.high
                  ? `₹${est.low.toLocaleString("en-IN")}`
                  : `₹${est.low.toLocaleString("en-IN")} – ₹${est.high.toLocaleString("en-IN")}`}
              </p>
              {est.note && <p className="mt-1 text-xs text-muted">{est.note}</p>}
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
