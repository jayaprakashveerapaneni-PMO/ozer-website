"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CookingPot,
  Shirt,
  HeartHandshake,
  ShieldCheck,
  Star,
  MapPin,
  Zap,
  CalendarDays,
  ChevronLeft,
  CheckCircle2,
  BellRing,
  GraduationCap,
  Mic,
} from "lucide-react";
import {
  SERVICES,
  HELPERS,
  ZONES,
  estimate,
  type EstimateInput,
  type ServiceId,
  type Helper,
} from "@/lib/data";
import {
  createBooking,
  getBooking,
  subscribe,
  statusIndex,
  STATUS_STEPS,
  type Booking,
} from "@/lib/store";
import { useEffect } from "react";

const ICONS: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  cleaning: Sparkles,
  cook: CookingPot,
  laundry: Shirt,
  care: HeartHandshake,
};

const STEPS = ["Service", "Details", "Slot", "Helper", "Confirm"];

type Slot = { id: string; label: string; sub: string; asap?: boolean };

const SLOT_PRESETS: Slot[] = [
  { id: "asap", label: "ASAP", sub: "Earliest available helper", asap: true },
  { id: "today-pm", label: "Today, 4–6 PM", sub: "Evening slot" },
  { id: "tom-am", label: "Tomorrow, 8–10 AM", sub: "Morning slot" },
  { id: "tom-pm", label: "Tomorrow, 4–6 PM", sub: "Evening slot" },
  { id: "custom", label: "Pick a date", sub: "Up to 14 days ahead" },
];

export default function BookingWizard() {
  const params = useSearchParams();
  const initial = params.get("service") as ServiceId | null;
  const validInitial = SERVICES.some((s) => s.id === initial) ? initial : null;
  const slotParam = params.get("slot");
  const initialSlot = SLOT_PRESETS.find((s) => s.id === slotParam) ?? null;
  const viaVoice = params.get("via") === "voice";

  const [step, setStep] = useState(validInitial ? 1 : 0);
  const [service, setService] = useState<ServiceId>(validInitial ?? "cleaning");

  // details
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
  const [zone, setZone] = useState(ZONES[0]);

  // slot + helper
  const [slot, setSlot] = useState<Slot | null>(initialSlot);
  const [customDate, setCustomDate] = useState("");
  const [helper, setHelper] = useState<Helper | null>(null);

  // confirm
  const [placing, setPlacing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [liveBooking, setLiveBooking] = useState<Booking | null>(null);

  // Live status: react to helper-side actions (same tab or another tab)
  useEffect(() => {
    if (!bookingId) return;
    const sync = () => setLiveBooking(getBooking(bookingId) ?? null);
    sync();
    return subscribe(sync);
  }, [bookingId]);

  // ⚡ Instant booking: ?instant=1 creates an ASAP booking with sensible
  // defaults and lands straight on the live status screen — one tap total.
  const instant = params.get("instant") === "1";
  const instantFired = useRef(false);
  useEffect(() => {
    if (!instant || !validInitial || instantFired.current) return;
    instantFired.current = true;
    setSlot(SLOT_PRESETS[0]);
    setPlacing(true);
    const svc = SERVICES.find((s) => s.id === validInitial)!;
    const inp: EstimateInput = { service: validInitial, hours: 2, cleaningType: "regular", cookMode: "person", people: 3, laundryMode: "kg", kg: 4, careMode: "hourly", careHours: 4 };
    const e = estimate(inp);
    const t = setTimeout(() => {
      const b = createBooking({
        service: validInitial,
        serviceName: svc.name,
        detailLabel: e.label,
        estLow: e.low,
        estHigh: e.high,
        slotLabel: "ASAP",
        zone: ZONES[0],
        customerName: "You (instant customer)",
        preferredHelperId: null,
        via: "app",
      });
      setBookingId(b.id);
      setPlacing(false);
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instant, validInitial]);

  const input: EstimateInput = useMemo(
    () => ({
      service, hours, cleaningType, cookMode, people, dishes,
      laundryMode, kg, pieces, careMode, careHours, days,
    }),
    [service, hours, cleaningType, cookMode, people, dishes, laundryMode, kg, pieces, careMode, careHours, days]
  );
  const est = estimate(input);

  // FR-8: only verified helpers; care requires certification (FR-37)
  const available = HELPERS.filter(
    (h) => h.services.includes(service) && (service !== "care" || h.certified)
  );

  const svcMeta = SERVICES.find((s) => s.id === service)!;

  const placeBooking = () => {
    setPlacing(true);
    setTimeout(() => {
      const b = createBooking({
        service,
        serviceName: svcMeta.name,
        detailLabel: est.label,
        estLow: est.low,
        estHigh: est.high,
        slotLabel: slot?.id === "custom" ? customDate : slot?.label ?? "ASAP",
        zone,
        customerName: "You (demo customer)",
        preferredHelperId: helper?.id ?? null,
        via: viaVoice ? "voice" : "app",
      });
      setBookingId(b.id);
      setPlacing(false);
    }, 900);
  };

  const clampNum = (v: number, lo: number, hi: number) =>
    Math.min(Math.max(Math.round(v) || lo, lo), hi);

  const numField = (
    id: string, label: string, value: number, set: (n: number) => void,
    min: number, max: number, unit?: string
  ) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id} type="number" inputMode="numeric" min={min} max={max} value={value}
          onChange={(e) => set(clampNum(Number(e.target.value), min, max))}
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

  // ---------- SUCCESS ----------
  if (bookingId) {
    const confetti = [
      { l: "6%", c: "#f97316", d: 0 }, { l: "14%", c: "#22d3ee", d: 0.2 },
      { l: "24%", c: "#a78bfa", d: 0.05 }, { l: "33%", c: "#34d399", d: 0.35 },
      { l: "42%", c: "#fb923c", d: 0.15 }, { l: "51%", c: "#f472b6", d: 0.4 },
      { l: "60%", c: "#22d3ee", d: 0.1 }, { l: "69%", c: "#f97316", d: 0.3 },
      { l: "78%", c: "#34d399", d: 0.2 }, { l: "86%", c: "#a78bfa", d: 0.45 },
      { l: "93%", c: "#fb923c", d: 0.08 }, { l: "48%", c: "#f97316", d: 0.55 },
      { l: "20%", c: "#f472b6", d: 0.6 }, { l: "72%", c: "#fb923c", d: 0.5 },
    ];
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="glass animate-fade-up relative overflow-hidden rounded-3xl p-8 text-center glow-ring">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden>
            {confetti.map((f, i) => (
              <span
                key={i}
                className="confetti"
                style={{ left: f.l, background: f.c, animationDelay: `${f.d}s` }}
              />
            ))}
          </div>
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden />
          <h1 className="mt-4 text-2xl font-bold">Booking confirmed</h1>
          <p className="mt-1 font-display text-lg font-bold text-primary-soft text-glow">{bookingId}</p>

          <div className="mt-6 space-y-3 rounded-2xl bg-surface p-5 text-left text-sm">
            <div className="flex justify-between"><span className="text-muted">Service</span><span className="font-semibold">{svcMeta.name} — {est.label}</span></div>
            <div className="flex justify-between"><span className="text-muted">Slot</span><span className="font-semibold">{slot?.id === "custom" ? customDate : slot?.label}</span></div>
            <div className="flex justify-between">
              <span className="text-muted">Helper</span>
              <span className="font-semibold">
                {liveBooking?.helperName ? (
                  <span className="text-success">{liveBooking.helperName} ✓ accepted</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-primary-soft">
                    <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                    <span className="ml-1">Offering to nearby helpers…</span>
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-muted">Area</span><span className="font-semibold">{zone}, Hyderabad</span></div>
            <div className="flex justify-between border-t border-line pt-3"><span className="text-muted">Estimate (pay after)</span>
              <span className="font-display font-bold text-primary-soft">
                {est.low === est.high ? `₹${est.low.toLocaleString("en-IN")}` : `₹${est.low.toLocaleString("en-IN")} – ₹${est.high.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>

          {/* LIVE status timeline — driven by real helper actions */}
          <ol className="mt-6 flex items-center justify-between text-xs text-muted" aria-label="Booking status timeline" aria-live="polite">
            {STATUS_STEPS.map((s, i) => {
              const cur = liveBooking ? statusIndex(liveBooking.status) : 0;
              return (
                <li key={s.key} className="flex flex-col items-center gap-1">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${
                      i < cur ? "bg-success" : i === cur ? "bg-primary step-live" : "bg-black/10"
                    }`}
                    aria-hidden
                  />
                  <span className={i <= cur ? "font-semibold text-foreground" : ""}>{s.label}</span>
                </li>
              );
            })}
          </ol>

          {/* Arrival OTP (FR-16) — customer shows this at the door */}
          {liveBooking && (liveBooking.status === "en_route" || liveBooking.status === "assigned") && (
            <div className="glow-ring animate-fade-up mx-auto mt-6 max-w-xs rounded-2xl bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Your arrival OTP</p>
              <p className="mt-1 font-display text-4xl font-bold tracking-[0.35em] text-primary-soft text-glow">
                {liveBooking.otp}
              </p>
              <p className="mt-1.5 text-xs text-muted">
                Share only at your door — it proves the arriving person is {liveBooking.helperName ?? "your assigned helper"}.
              </p>
            </div>
          )}

          {liveBooking?.status === "completed" && (
            <p className="animate-fade-up mt-6 rounded-2xl bg-success/10 p-4 text-sm font-semibold text-success">
              Job completed! Pay via UPI/card now — and rate {liveBooking.helperName} to save them as a favourite.
            </p>
          )}

          <p className="mt-6 rounded-2xl bg-surface p-3 text-xs text-muted">
            <BellRing className="mr-1 inline h-3.5 w-3.5 text-primary-soft" aria-hidden />
            This screen updates <strong className="text-foreground/80">live</strong> as the helper acts.
            Open the helper app to accept this job and watch the timeline move.
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
              onClick={() => { setBookingId(null); setLiveBooking(null); setStep(0); setSlot(null); setHelper(null); }}
              className="glass rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:text-primary-soft"
            >
              Book another service
            </button>
            <Link href="/" className="glass rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:text-primary-soft">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- INSTANT PLACING ----------
  if (instant && !bookingId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="relative mx-auto h-24 w-24">
          <span className="sonar-ring" aria-hidden />
          <span className="sonar-ring delay" aria-hidden />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-breathe">
            <Zap className="h-9 w-9 text-white" aria-hidden />
          </span>
        </div>
        <h1 className="mt-6 text-2xl font-bold">
          Instant booking <span className="gradient-text">{svcMeta.name}</span>
        </h1>
        <p className="mt-2 text-muted">ASAP slot · {ZONES[0]}, Hyderabad · offering to verified helpers…</p>
      </div>
    );
  }

  // ---------- WIZARD ----------
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {viaVoice && step === 1 && (
        <p className="animate-fade-up mb-6 flex items-center gap-2 rounded-2xl glass px-4 py-3 text-sm font-medium text-primary-soft">
          <Mic className="h-4 w-4 shrink-0" aria-hidden />
          Filled in by voice — review the details, everything stays in your control.
          {initialSlot && <span className="ml-auto rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold">{initialSlot.label}</span>}
        </p>
      )}

      <nav aria-label="Booking progress">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  i < step ? "bg-success" : i === step ? "bg-primary glow-primary" : "bg-black/10"
                }`}
                aria-hidden
              />
              <span className={`text-xs ${i === step ? "font-bold text-primary-soft" : "text-muted"}`}>
                {s}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 min-h-[420px]">
        {/* STEP 0 — service */}
        {step === 0 && (
          <div className="animate-fade-up">
            <h1 className="text-2xl font-bold">What do you need help with?</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {SERVICES.map((s) => {
                const Icon = ICONS[s.id];
                const selected = service === s.id;
                return (
                  <button
                    key={s.id} type="button"
                    onClick={() => { setService(s.id); setHelper(null); }}
                    aria-pressed={selected}
                    className={`tilt-card rounded-3xl border p-5 text-left transition-all duration-200 ${
                      selected ? "border-primary bg-primary/10 glow-ring" : "border-line glass hover:border-primary/40"
                    }`}
                  >
                    <Icon className={`h-7 w-7 ${selected ? "text-primary-soft" : "text-muted"}`} aria-hidden />
                    <p className="mt-2 font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{s.pricing}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — details */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h1 className="text-2xl font-bold">{svcMeta.name} — details</h1>
            <div className="mt-6 space-y-5">
              {service === "cleaning" && (
                <>
                  {segmented("Cleaning type", [
                    { value: "regular", label: "Regular" },
                    { value: "vessel", label: "Vessel wash" },
                    { value: "deep", label: "Deep clean ₹400" },
                  ], cleaningType, setCleaningType)}
                  {cleaningType !== "deep" && numField("bw-hours", "Hours", hours, setHours, 1, 8, "hrs (min 1)")}
                </>
              )}
              {service === "cook" && (
                <>
                  {segmented("Pricing mode", [
                    { value: "person", label: "Per person" },
                    { value: "dish", label: "Per dish" },
                  ], cookMode, setCookMode)}
                  {cookMode === "person"
                    ? numField("bw-people", "How many people?", people, setPeople, 1, 20)
                    : numField("bw-dishes", "How many dishes?", dishes, setDishes, 1, 20)}
                </>
              )}
              {service === "laundry" && (
                <>
                  {segmented("Service", [
                    { value: "kg", label: "Wash & fold ₹60/kg" },
                    { value: "piece", label: "Ironing ₹8/pc" },
                  ], laundryMode, setLaundryMode)}
                  {laundryMode === "kg"
                    ? numField("bw-kg", "Approx. weight", kg, setKg, 1, 50, "kg (confirmed at pickup)")
                    : numField("bw-pieces", "Pieces", pieces, setPieces, 1, 200)}
                </>
              )}
              {service === "care" && (
                <>
                  {segmented("Duration", [
                    { value: "hourly", label: "Hourly" },
                    { value: "day", label: "Full day ₹600" },
                  ], careMode, setCareMode)}
                  {careMode === "hourly"
                    ? numField("bw-care-hours", "Hours", careHours, setCareHours, 1, 12, "hrs (6 AM – 10 PM)")
                    : numField("bw-days", "Days", days, setDays, 1, 14)}
                  <p className="rounded-2xl bg-surface p-3 text-xs text-muted">
                    <GraduationCap className="mr-1 inline h-3.5 w-3.5 text-primary-soft" aria-hidden />
                    Only certified, first-aid-trained carers can take care bookings.
                    Service window is 6 AM – 10 PM.
                  </p>
                </>
              )}

              <div>
                <label htmlFor="bw-zone" className="mb-1 block text-sm font-medium">Your area</label>
                <select
                  id="bw-zone" value={zone} onChange={(e) => setZone(e.target.value)}
                  className="w-full max-w-xs rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [&>option]:bg-white"
                >
                  {ZONES.map((z) => <option key={z}>{z}</option>)}
                </select>
                <p className="mt-1 text-xs text-muted">All Hyderabad zones shown are serviceable.</p>
              </div>

              <div className="glow-ring rounded-2xl bg-surface p-4" aria-live="polite">
                <p className="text-sm text-muted">{est.label}</p>
                <p className="font-display text-2xl font-bold text-primary-soft">
                  {est.low === est.high ? `₹${est.low.toLocaleString("en-IN")}` : `₹${est.low.toLocaleString("en-IN")} – ₹${est.high.toLocaleString("en-IN")}`}
                </p>
                {est.note && <p className="mt-1 text-xs text-muted">{est.note}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — slot */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h1 className="text-2xl font-bold">When should we come?</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SLOT_PRESETS.map((s) => {
                const selected = slot?.id === s.id;
                return (
                  <button
                    key={s.id} type="button" onClick={() => setSlot(s)} aria-pressed={selected}
                    className={`tilt-card flex items-center gap-3 rounded-3xl border p-4 text-left transition-all duration-200 ${
                      selected ? "border-primary bg-primary/10 glow-ring" : "border-line glass hover:border-primary/40"
                    }`}
                  >
                    {s.asap
                      ? <Zap className={`h-6 w-6 ${selected ? "text-primary-soft" : "text-muted"}`} aria-hidden />
                      : <CalendarDays className={`h-6 w-6 ${selected ? "text-primary-soft" : "text-muted"}`} aria-hidden />}
                    <span>
                      <span className="block font-semibold">{s.label}</span>
                      <span className="block text-sm text-muted">{s.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {slot?.id === "custom" && (
              <div className="mt-4">
                <label htmlFor="bw-date" className="mb-1 block text-sm font-medium">Choose date & time</label>
                <input
                  id="bw-date" type="datetime-local" value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground [color-scheme:light]"
                />
                <p className="mt-1 text-xs text-muted">Bookable up to 14 days ahead.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — helper */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h1 className="text-2xl font-bold">Choose your verified helper</h1>
            <p className="mt-1 text-sm text-muted">
              Only background-verified helpers are ever shown. {service === "care" && "Care bookings additionally require certification."}
            </p>
            {available.length === 0 ? (
              <div className="glass mt-8 rounded-3xl border-dashed p-8 text-center">
                <p className="font-semibold">No verified helpers free for this slot</p>
                <p className="mt-1 text-sm text-muted">
                  Try the next slot, or tap notify-me and we&apos;ll alert you the moment one frees up.
                </p>
                <button type="button" className="mt-4 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary-soft">
                  <BellRing className="mr-1.5 inline h-4 w-4" aria-hidden /> Notify me
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {available.map((h) => {
                  const selected = helper?.id === h.id;
                  return (
                    <button
                      key={h.id} type="button" onClick={() => setHelper(h)} aria-pressed={selected}
                      className={`tilt-card rounded-3xl border p-5 text-left transition-all duration-200 ${
                        selected ? "border-primary bg-primary/10 glow-ring" : "border-line glass hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                          style={{ background: `hsl(${h.hue} 70% 45%)` }}
                          aria-hidden
                        >
                          {h.initials}
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 font-semibold">
                            {h.name}
                            <ShieldCheck className="h-4 w-4 text-success" aria-label="Police verified" />
                            {h.certified && <GraduationCap className="h-4 w-4 text-accent" aria-label="Care certified" />}
                          </span>
                          <span className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3.5 w-3.5 fill-primary-soft text-primary-soft" aria-hidden /> {h.rating}
                            </span>
                            · {h.jobs} jobs
                          </span>
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5">
                          <MapPin className="h-3 w-3" aria-hidden /> {h.distanceBand}
                        </span>
                        <span className="rounded-full bg-surface px-2 py-0.5">{h.languages.join(", ")}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — confirm */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h1 className="text-2xl font-bold">Review & confirm</h1>
            <div className="glass mt-6 space-y-3 rounded-3xl p-6 text-sm">
              <div className="flex justify-between"><span className="text-muted">Service</span><span className="font-semibold">{svcMeta.name} — {est.label}</span></div>
              <div className="flex justify-between"><span className="text-muted">Slot</span><span className="font-semibold">{slot?.id === "custom" ? (customDate || "—") : slot?.label}</span></div>
              <div className="flex justify-between"><span className="text-muted">Helper</span><span className="font-semibold">{helper?.name} · ★ {helper?.rating}</span></div>
              <div className="flex justify-between"><span className="text-muted">Area</span><span className="font-semibold">{zone}, Hyderabad</span></div>
              <div className="flex justify-between"><span className="text-muted">First-booking promo</span><span className="font-semibold text-success">− ₹50 applied at checkout</span></div>
              <div className="flex justify-between border-t border-line pt-3">
                <span className="text-muted">Estimate — pay after service</span>
                <span className="font-display text-lg font-bold text-primary-soft">
                  {est.low === est.high ? `₹${est.low.toLocaleString("en-IN")}` : `₹${est.low.toLocaleString("en-IN")} – ₹${est.high.toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-surface p-3 text-xs text-muted">
              Free cancellation until a helper is assigned; a small fee applies once they&apos;re
              en route. Final bill = estimate + only add-ons you approve.
            </p>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button" onClick={() => setStep(step - 1)}
            className="glass inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:text-primary-soft"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Back
          </button>
        ) : <span />}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 2 && (!slot || (slot.id === "custom" && !customDate))) ||
              (step === 3 && !helper)
            }
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Continue
          </button>
        ) : (
          <button
            type="button" onClick={placeBooking} disabled={placing}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform duration-200 hover:scale-105 disabled:opacity-60"
          >
            {placing ? "Placing booking…" : "Confirm booking"}
          </button>
        )}
      </div>
    </div>
  );
}
