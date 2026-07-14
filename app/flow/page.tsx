import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Palette,
  Hammer,
  BadgeCheck,
  Mic,
  Zap,
  Bell,
  KeyRound,
  Wallet,
  ArrowRight,
  ArrowDown,
  Users,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "The build story — Ozer",
  description:
    "How Ozer went from a 131-page requirements suite to a working voice-first home services product: design intelligence, functional flows, and end-to-end verification.",
};

const PIPELINE = [
  {
    icon: FileText,
    title: "1 · Requirements",
    body: "Started from the Ozer v1 Requirements Suite — market analysis, 6 personas, BRD, FR-1..FR-70 across 14 epics, NFRs, and the Alexa/Siri/Google addendum. Every screen traces to an FR.",
    tag: "131-page suite",
  },
  {
    icon: Palette,
    title: "2 · Design intelligence",
    body: "UI/UX Pro Max generated the design system: saffron brand palette, Trust & Authority style, marketplace landing pattern, Space Grotesk/Inter type — then evolved to this light futuristic theme.",
    tag: "AI design system",
  },
  {
    icon: Hammer,
    title: "3 · Build",
    body: "Next.js 16 + Tailwind v4, fully static. Live voice recognition (Web Speech API, 4 languages), a real-time booking store syncing customer and helper screens, and animated everything.",
    tag: "Next.js 16 · zero backend deps",
  },
  {
    icon: BadgeCheck,
    title: "4 · Verify & ship",
    body: "Every flow exercised end-to-end on production with scripted browser runs: booking, voice parsing, offer delivery, OTP mismatch rejection, completion, wallet credit. Deployed on Vercel.",
    tag: "E2E verified on prod",
  },
];

const FLOWS = [
  {
    icon: Zap,
    accent: "#ea580c",
    title: "Instant booking (1 tap)",
    steps: ["Tap ⚡ Instant on any service card", "ASAP booking auto-created with defaults", "Live status screen — helper offer goes out"],
    traces: "FR-7, FR-9, FR-11",
    href: "/book?service=cleaning&instant=1",
    linkLabel: "Try instant booking",
  },
  {
    icon: Users,
    accent: "#f472b6",
    title: "Guided booking (≤ 5 screens)",
    steps: ["Pick service → details with live estimate", "Slot: ASAP or up to 14 days", "Choose verified helper → confirm", "Confetti + live status + arrival OTP"],
    traces: "FR-5..FR-9, FR-16, FR-37",
    href: "/book",
    linkLabel: "Start a booking",
  },
  {
    icon: Mic,
    accent: "#0891b2",
    title: "Voice booking (Te/Hi/Ta/En)",
    steps: ["Tap the orb, speak your request", "Intent + slot parsed, read back in your language", "You confirm — wizard pre-filled, never auto-booked"],
    traces: "FR-26..FR-30, AI-7",
    href: "/#voice",
    linkLabel: "Try the live voice demo",
  },
  {
    icon: Bell,
    accent: "#059669",
    title: "Helper flow (the other side)",
    steps: ["Offer lands with toast notification — instantly", "Accept → start journey → customer sees live status", "OTP handshake at the door (wrong OTP = blocked)", "Complete → wallet credited, earnings listed"],
    traces: "FR-11, FR-12, FR-14, FR-16, FR-20, FR-44, FR-46",
    href: "/helper",
    linkLabel: "Open the helper app",
  },
  {
    icon: Globe,
    accent: "#7c3aed",
    title: "Voice assistants (industry first)",
    steps: ["Alexa: full dialog booking (En + Hi)", "Siri: shortcut phrases → pre-filled app flow", "Google: App Actions deep-link into booking", "Playable conversation demos for each"],
    traces: "FR-54..FR-60 (EP-14 addendum)",
    href: "/#assistants",
    linkLabel: "Play the assistant demos",
  },
];

const VERIFIED = [
  { check: "Booking created & persisted, live 'finding helper' state", result: "✓ pass" },
  { check: "Offer appears in helper app instantly (cross-tab, real-time)", result: "✓ pass" },
  { check: "Accept → assigned; customer screen updates without refresh", result: "✓ pass" },
  { check: "Wrong OTP rejected — job start blocked, trust flag messaging", result: "✓ pass" },
  { check: "Correct OTP → arrived → in progress → completed", result: "✓ pass" },
  { check: "Wallet credited on completion; earnings listed", result: "✓ pass" },
  { check: "Telugu voice phrase → correct service + slot + Telugu read-back", result: "✓ pass" },
  { check: "Certified-carers-only filter on care bookings", result: "✓ pass" },
];

export default function FlowPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="blob blob-a left-[-8%] top-[0%] h-96 w-96 bg-orange-400" aria-hidden />
          <div className="blob blob-b right-[-5%] top-[40%] h-80 w-80 bg-cyan-400" aria-hidden />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary-soft">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                For management & clients — the exact story
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                From requirements to a{" "}
                <span className="gradient-text">working product</span>
              </h1>
              <p className="mt-5 text-lg text-muted">
                What we built, how we built it, and proof that every flow works —
                end to end, on production.
              </p>
            </Reveal>

            {/* pipeline */}
            <div className="mt-14 grid gap-5 md:grid-cols-4">
              {PIPELINE.map((p, i) => (
                <Reveal key={p.title} delay={i * 100}>
                  <div className="glass tilt-card relative h-full rounded-3xl p-5">
                    <p.icon className="h-7 w-7 text-primary-soft" aria-hidden />
                    <h2 className="mt-3 font-semibold">{p.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                    <p className="mt-3 inline-block rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-primary-soft">
                      {p.tag}
                    </p>
                    {i < 3 && (
                      <ArrowRight
                        className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary-soft/60 md:block animate-pulse-dot"
                        aria-hidden
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* flows */}
            <Reveal className="mt-20 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Every flow, <span className="gradient-text">clickable right now</span>
              </h2>
              <p className="mt-3 text-muted">Each card lists the exact steps and the requirement IDs it implements.</p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {FLOWS.map((f, i) => (
                <Reveal key={f.title} delay={i * 60}>
                  <div className="glass tilt-card rounded-3xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{ background: `${f.accent}1a`, color: f.accent }}
                        >
                          <f.icon className="h-6 w-6" aria-hidden />
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                          <ol className="mt-2 space-y-1.5">
                            {f.steps.map((s, j) => (
                              <li key={s} className="flex items-start gap-2 text-sm text-muted">
                                <span
                                  className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                  style={{ background: `${f.accent}1a`, color: f.accent }}
                                >
                                  {j + 1}
                                </span>
                                {s}
                              </li>
                            ))}
                          </ol>
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted/70">
                            Traces: {f.traces}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={f.href}
                        className="btn-shine inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
                        style={{ background: f.accent, boxShadow: `0 8px 24px ${f.accent}44` }}
                      >
                        {f.linkLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* the loop, visualized */}
            <Reveal className="mt-20">
              <div className="glass rounded-3xl p-8">
                <h2 className="text-center text-2xl font-bold sm:text-3xl">
                  The front-to-back loop, <span className="gradient-text">live in two windows</span>
                </h2>
                <div className="mt-8 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-3xl border border-line bg-white/70 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-soft">Customer window</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      <li className="flex gap-2"><Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary-soft" aria-hidden /> Books cleaning (tap, wizard or voice)</li>
                      <li className="flex gap-2"><KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary-soft" aria-hidden /> Sees arrival OTP + live status dots</li>
                      <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> Watches: assigned → en route → done</li>
                    </ul>
                  </div>
                  <div className="flex justify-center md:flex-col md:gap-2">
                    <ArrowRight className="hidden h-6 w-6 text-primary-soft animate-pulse-dot md:block" aria-hidden />
                    <ArrowDown className="h-6 w-6 text-primary-soft animate-pulse-dot md:hidden" aria-hidden />
                    <p className="sr-only">real-time sync</p>
                  </div>
                  <div className="rounded-3xl border border-line bg-white/70 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-success">Helper window</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      <li className="flex gap-2"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> Offer pops with toast + earnings</li>
                      <li className="flex gap-2"><KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> Verifies OTP at the door (fraud-blocked)</li>
                      <li className="flex gap-2"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> Completes → ₹ lands in wallet</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-center text-sm text-muted">
                  Open <Link href="/book" className="font-semibold text-primary-soft underline-offset-2 hover:underline">/book</Link> and{" "}
                  <Link href="/helper" className="font-semibold text-primary-soft underline-offset-2 hover:underline">/helper</Link> side by side — the sync is instant.
                </p>
              </div>
            </Reveal>

            {/* verification table */}
            <Reveal className="mt-20">
              <h2 className="text-center text-2xl font-bold sm:text-3xl">
                Verified end-to-end <span className="gradient-text">on production</span>
              </h2>
              <div className="glass mt-8 overflow-hidden rounded-3xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs font-bold uppercase tracking-widest text-muted">
                      <th className="px-6 py-4">Scenario exercised</th>
                      <th className="px-6 py-4 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {VERIFIED.map((v) => (
                      <tr key={v.check} className="transition-colors hover:bg-surface">
                        <td className="px-6 py-3.5 text-muted">{v.check}</td>
                        <td className="px-6 py-3.5 text-right font-bold text-success">{v.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal className="mt-16 text-center">
              <Link
                href="/"
                className="btn-shine inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-105"
              >
                Explore the product <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
