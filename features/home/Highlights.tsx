"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ListChecks,
  CalendarClock,
  CreditCard,
  MapPin,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Star,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { isAutomatedAgent, prefersReducedMotion } from "@/lib/motion";
import { ZONES } from "@/lib/domain";

// Booking highlights — an auto-playing walkthrough of the real 4-step flow.
// Replaces the old voice demo as the homepage centrepiece: what you see here
// is exactly what /book does, ending in secure upfront payment.

const STEPS = [
  {
    icon: ListChecks,
    title: "Pick a service",
    body: "Cleaning, cook, laundry or care — the full price is on screen before you even sign in.",
    screen: (
      <div className="space-y-2.5">
        {["House Cleaning · from ₹149", "Home Cook · from ₹199", "Laundry & Ironing · from ₹99"].map((s, i) => (
          <div key={s} className={`rounded-2xl p-3 text-[11px] font-semibold ${i === 0 ? "bg-orange-500 text-black" : "bg-white/8 text-white"}`}>
            {s} {i === 0 && "✓"}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CalendarClock,
    title: "Choose slot & helper",
    body: "ASAP or up to 14 days ahead. Every helper shows a photo, rating and verification badge.",
    screen: (
      <div className="space-y-2.5">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300">Tomorrow · 9:00 AM</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-[10px] font-bold text-white">MK</span>
            <div>
              <p className="text-xs font-semibold text-white">Meena K. · ★ 4.9</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-300"><ShieldCheck className="h-3 w-3" aria-hidden /> Police-verified</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/8 p-3 text-[11px] text-white/70">312 jobs done · 1.2 km away</div>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: "Pay securely upfront",
    body: "UPI, card or netbanking when you book — every rupee protected by the money-back promise.",
    screen: (
      <div className="space-y-2.5">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">To pay now</p>
          <p className="mt-1 text-xl font-bold text-white">₹298</p>
          <p className="text-[10px] text-white/50">Fixed at booking · no cash, no haggling</p>
        </div>
        <div className="rounded-2xl bg-emerald-400 py-2 text-center text-[11px] font-bold text-black">Pay with UPI ✓</div>
        <p className="flex items-center justify-center gap-1 text-[10px] text-white/60"><Star className="h-3 w-3 text-emerald-300" aria-hidden /> Money-back promise applies</p>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: "Track to your door",
    body: "Follow your helper live from en route; the OTP handshake proves it's the right person.",
    screen: (
      <div className="space-y-2.5">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
            <MapPin className="h-3 w-3 text-emerald-400" aria-hidden /> Meena is en route · 12 min
          </p>
          <div className="shimmer-line mt-2 h-1 rounded-full bg-white/10" />
        </div>
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
            <KeyRound className="h-3 w-3 text-orange-300" aria-hidden /> Arrival OTP: 4 · 8 · 2 · 6
          </p>
          <p className="mt-1 text-[10px] text-white/50">Share it only at your door</p>
        </div>
      </div>
    ),
  },
];

const STATS = [
  { end: 2, suffix: " min", label: "average time to book" },
  { end: 100, suffix: "%", label: "helpers police-verified" },
  { end: 48, suffix: " hr", label: "verification turnaround" },
  { end: ZONES.length, suffix: "", label: "zones across Hyderabad" },
];

const CYCLE_MS = 3400;

export default function Highlights() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion() || isAutomatedAgent()) return;
    const id = setInterval(() => setActive((v) => (v + 1) % STEPS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const step = STEPS[active];

  return (
    <section id="highlights" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-a left-[10%] top-[10%] h-72 w-72 bg-orange-400" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Booking help takes <span className="gradient-text">about two minutes.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            No calls, no haggling, no waiting for callbacks. This is the whole flow —
            it plays out below exactly as it does in the app.
          </p>
        </Reveal>

        <div
          className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* step rail */}
          <div className="grid gap-3" aria-label="Booking steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => { setActive(i); setPaused(true); }}
                  onFocus={() => setPaused(true)}
                  className={`group flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition-all duration-300 ${
                    active === i ? "glass border-primary/40 shadow-lg" : "border-line bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                      active === i ? "bg-primary text-on-primary glow-primary" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-display font-semibold">
                      <span className="text-xs text-muted">0{i + 1}</span> {s.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{s.body}</span>
                    {/* per-step progress track (scaleX only — zero layout shift) */}
                    <span className="mt-3 block h-1 overflow-hidden rounded-full bg-black/10" aria-hidden>
                      <span className={`block h-full w-full rounded-full bg-primary ${active === i ? "highlight-progress" : "scale-x-0"}`} />
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          {/* phone preview of the active step */}
          <Reveal className="mx-auto w-full max-w-[300px]">
            <div key={active} className="device-frame word-swap animate-float-slow rounded-[2.4rem] border-4 border-white/10 p-4 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/15" aria-hidden />
              <p className="mb-3 flex items-center justify-between text-[10px] font-bold text-white/40">
                <span>OZER · STEP {active + 1} OF 4</span>
                <span className="text-orange-300">●</span>
              </p>
              {/* fixed-height stage so step swaps never shift layout (CLS) */}
              <div className="h-[200px] overflow-hidden">{step.screen}</div>
              <Link
                href="/book"
                className="btn-shine mt-4 block rounded-2xl bg-orange-500 py-2.5 text-center text-xs font-bold text-black transition-transform hover:scale-[1.03]"
              >
                Start a real booking <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* proof band */}
        <dl className="mt-16 grid gap-6 rounded-3xl border border-line bg-white/50 p-8 text-center sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="order-2 mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-3xl font-bold text-primary">
                <CountUp end={s.end} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
