"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, KeyRound, MapPin, ArrowRight, Star } from "lucide-react";
import { HIW_STEP_EVENT, isAutomatedAgent, prefersReducedMotion } from "@/lib/motion";

// The booking phone — the live stage of the How-It-Works act. On desktop the
// pinned scroll director broadcasts the active step and the screen follows
// the scrub; elsewhere (mobile, no pin) it auto-plays the same four screens.
// The stage height is fixed so screen swaps can never shift layout.

const SCREENS = [
  <div key="pick" className="space-y-2.5">
    {["House Cleaning · from ₹149", "Home Cook · from ₹199", "Laundry & Ironing · from ₹99"].map((s, i) => (
      <div key={s} className={`rounded-2xl p-3 text-[11px] font-semibold ${i === 0 ? "bg-orange-500 text-black" : "bg-white/8 text-white"}`}>
        {s} {i === 0 && "✓"}
      </div>
    ))}
  </div>,
  <div key="slot" className="space-y-2.5">
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
  </div>,
  <div key="pay" className="space-y-2.5">
    <div className="rounded-2xl bg-white/8 p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">To pay now</p>
      <p className="mt-1 text-xl font-bold text-white">₹298</p>
      <p className="text-[10px] text-white/50">Fixed at booking · no cash, no haggling</p>
    </div>
    <div className="rounded-2xl bg-emerald-400 py-2 text-center text-[11px] font-bold text-black">Pay with UPI ✓</div>
    <p className="flex items-center justify-center gap-1 text-[10px] text-white/60"><Star className="h-3 w-3 text-emerald-300" aria-hidden /> Money-back promise applies</p>
  </div>,
  <div key="track" className="space-y-2.5">
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
  </div>,
];

const CYCLE_MS = 3400;

export default function HiwPhone() {
  const [active, setActive] = useState(0);
  const [driven, setDriven] = useState(false);

  useEffect(() => {
    const onStep = (e: Event) => {
      setDriven(true);
      setActive((e as CustomEvent<{ step: number }>).detail.step);
    };
    window.addEventListener(HIW_STEP_EVENT, onStep);
    return () => window.removeEventListener(HIW_STEP_EVENT, onStep);
  }, []);

  // Self-play only until the scroll director takes over (and never for
  // reduced-motion users or automated agents — quiet main thread for audits).
  useEffect(() => {
    if (driven || prefersReducedMotion() || isAutomatedAgent()) return;
    const id = setInterval(() => setActive((v) => (v + 1) % SCREENS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [driven]);

  return (
    <div data-hiw-phone className="relative mx-auto w-full max-w-[300px]">
      {/* warm halo bleeding behind the device — ties it to the page's light */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="device-frame relative rounded-[2.4rem] border-4 border-white/10 p-4 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/15" aria-hidden />
        <p className="mb-3 flex items-center justify-between text-[10px] font-bold text-white/40">
          <span>OZER · STEP {active + 1} OF 4</span>
          <span className="text-orange-300">●</span>
        </p>
        {/* fixed-height stage so step swaps never shift layout (CLS) */}
        <div key={active} className="word-swap h-[200px] overflow-hidden">{SCREENS[active]}</div>
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {SCREENS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-orange-400" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>
        <Link
          href="/book"
          className="btn-shine mt-3 block rounded-2xl bg-orange-500 py-2.5 text-center text-xs font-bold text-black transition-transform hover:scale-[1.03]"
        >
          Start a real booking <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
