"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  HeartHandshake,
  Users,
  Sparkles,
  ShieldCheck,
  Bell,
  ArrowRight,
  Camera,
  MapPin,
  Wallet,
  KeyRound,
} from "lucide-react";
import Spotlight from "@/components/motion/Spotlight";
import { PERSONA_ACCENT, PERSONA_ACCENT_INK } from "@/lib/design";

interface Persona {
  id: string;
  name: string;
  who: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  quote: string;
  cta: { label: string; href: string; external?: boolean };
  screen: React.ReactNode;
}

const PERSONAS: Persona[] = [
  {
    id: "divya",
    name: "Divya, 32",
    who: "IT professional · Madhapur · books on her commute",
    icon: Briefcase,
    accent: PERSONA_ACCENT[0],
    quote: "I book the cook before my cab reaches the office. Same cook, every day, zero renegotiation.",
    cta: { label: "Book like Divya", href: "/book?service=cook" },
    screen: (
      <div className="space-y-3">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300">Rebook favourite</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-600 text-[10px] font-bold text-white">FS</span>
            <div>
              <p className="text-xs font-semibold text-white">Fatima S. · Home Cook</p>
              <p className="text-[10px] text-white/50">★ 5.0 · your usual 7 PM slot</p>
            </div>
          </div>
          <div className="mt-2 rounded-xl bg-orange-500 py-1.5 text-center text-[11px] font-bold text-black">Book again — 3 taps</div>
        </div>
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
            <MapPin className="h-3 w-3 text-emerald-400" aria-hidden /> Meena is en route · 12 min
          </p>
          <div className="shimmer-line mt-2 h-1 rounded-full bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    id: "anjali",
    name: "Anjali, 40",
    who: "Caring for her father-in-law · Kondapur",
    icon: HeartHandshake,
    accent: PERSONA_ACCENT[1],
    quote: "The check-in photos while I'm at work are everything. Certified carers, proof I can see.",
    cta: { label: "Book care like Anjali", href: "/book?service=care" },
    screen: (
      <div className="space-y-3">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300">Care timeline · live</p>
          <div className="mt-2 space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] text-white"><ShieldCheck className="h-3 w-3 text-emerald-400" aria-hidden /> 9:00 — Radha checked in (OTP ✓)</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white"><Camera className="h-3 w-3 text-violet-300" aria-hidden /> 11:30 — photo update: medicines taken</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/60"><Bell className="h-3 w-3" aria-hidden /> next update at 14:00</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[11px] font-semibold text-white">Radha P. · First-aid certified ✓</p>
          <p className="text-[10px] text-white/50">Certification verified · expires 2027</p>
        </div>
      </div>
    ),
  },
  {
    id: "rao",
    name: "Rao garu, 68",
    who: "Retired · Kukatpally · his daughter books for him",
    icon: Users,
    accent: PERSONA_ACCENT[2],
    quote: "మా అమ్మాయి బెంగళూరు నుండి బుక్ చేస్తుంది. I just open the door — the OTP tells me it's the right person.",
    cta: { label: "Book for your parents", href: "/book?service=care" },
    screen: (
      <div className="space-y-3">
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">Booked by family</p>
          <p className="mt-1.5 text-[11px] font-semibold text-white">House Cleaning · tomorrow 9 AM</p>
          <p className="text-[10px] text-white/50">Swathi (daughter, Bengaluru) · paid online ✓</p>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white">
            <MapPin className="h-3 w-3 text-emerald-400" aria-hidden /> Lakshmi is en route · tracking shared
          </p>
        </div>
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
            <KeyRound className="h-3 w-3" aria-hidden /> At the door
          </p>
          <p className="mt-1 text-[11px] text-white">Helper says the OTP, Rao garu matches it. No app needed on his side.</p>
          <div className="mt-2 flex gap-1.5">
            {["4", "8", "2", "6"].map((d, i) => (
              <span key={i} className="flex-1 rounded-lg bg-cyan-400 py-1 text-center text-[11px] font-bold text-black">{d}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "meena",
    name: "Meena, 35",
    who: "Cleaning professional · earns on her hours",
    icon: Sparkles,
    accent: PERSONA_ACCENT[3],
    quote: "Jobs come straight to my phone, I pick the ones near home, and money lands the same day.",
    cta: { label: "See Meena's helper app", href: "/helper" },
    screen: (
      <div className="space-y-3">
        <div className="glow-ring rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            <Bell className="h-3 w-3 step-live rounded-full" aria-hidden /> కొత్త జాబ్ ఆఫర్
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-white">House Cleaning · 2 hrs · Madhapur</p>
          <p className="text-[10px] text-white/50">1.2 km · this evening</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400">₹200</span>
            <span className="rounded-lg bg-emerald-400 px-3 py-1 text-[10px] font-bold text-black">Accept ✓</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white/8 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
            <Wallet className="h-3 w-3 text-emerald-400" aria-hidden /> Today: ₹640 · withdraw anytime
          </p>
        </div>
      </div>
    ),
  },
];

export default function Personas() {
  const [active, setActive] = useState(0);
  const p = PERSONAS[active];

  return (
    <section id="personas" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-a right-[15%] top-[0%] h-80 w-80 bg-violet-500" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            One app. <span className="gradient-text">Four very different lives.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Tap a person to see Ozer exactly the way they see it — then jump
            straight into their flow.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
          {/* persona cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {PERSONAS.map((per, i) => (
              <Spotlight key={per.id} color={`${per.accent}33`} className="rounded-3xl">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`tilt-card h-full w-full rounded-3xl border p-5 text-left transition-all duration-200 ${
                    active === i ? "glass" : "border-line bg-white/60 hover:bg-white/90"
                  }`}
                  style={active === i ? { borderColor: per.accent, boxShadow: `0 0 32px ${per.accent}33` } : undefined}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 hover:rotate-6"
                    style={{ background: `${per.accent}22`, color: per.accent }}
                  >
                    <per.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-display font-semibold">{per.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{per.who}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">“{per.quote}”</p>
                  <span
                    className="mt-4 inline-flex items-center gap-1 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 hover:gap-2"
                    style={{ color: PERSONA_ACCENT_INK[i], borderColor: `${per.accent}55`, background: `${per.accent}11` }}
                  >
                    {per.cta.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </button>
              </Spotlight>
            ))}
          </div>

          {/* phone frame preview */}
          <div className="mx-auto w-full max-w-[300px]">
            <div
              key={p.id}
              className="device-frame word-swap animate-float-slow rounded-[2.4rem] border-4 border-white/10 p-4 shadow-2xl"
              style={{ boxShadow: `0 24px 80px ${p.accent}22` }}
            >
              <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/15" aria-hidden />
              <p className="mb-3 flex items-center justify-between text-[10px] font-bold text-white/40">
                <span>OZER · {p.name.split(",")[0].toUpperCase()}&apos;S VIEW</span>
                <span style={{ color: p.accent }}>●</span>
              </p>
              {p.screen}
              <Link
                href={p.cta.href}
                className="btn-shine mt-4 block rounded-2xl py-2.5 text-center text-xs font-bold text-black transition-transform hover:scale-[1.03]"
                style={{ background: p.accent, boxShadow: `0 0 24px ${p.accent}44` }}
              >
                {p.cta.label} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
