import Link from "next/link";
import { ShieldCheck, MapPin, Mic, Speaker, Smartphone, CircleDot, ArrowDown } from "lucide-react";
import WordRotate from "@/components/motion/WordRotate";
import CountUp from "@/components/motion/CountUp";

// deterministic star field (no Math.random — SSR-safe)
const STARS = [
  { top: "12%", left: "8%", s: 2, d: 0 },
  { top: "22%", left: "28%", s: 1.5, d: 1.2 },
  { top: "8%", left: "55%", s: 2.5, d: 0.6 },
  { top: "30%", left: "72%", s: 1.5, d: 2.1 },
  { top: "15%", left: "88%", s: 2, d: 1.6 },
  { top: "55%", left: "12%", s: 1.5, d: 0.9 },
  { top: "65%", left: "40%", s: 2, d: 2.4 },
  { top: "48%", left: "62%", s: 1.5, d: 0.3 },
  { top: "70%", left: "85%", s: 2.5, d: 1.8 },
  { top: "82%", left: "22%", s: 1.5, d: 2.8 },
  { top: "40%", left: "94%", s: 1.5, d: 1.1 },
  { top: "88%", left: "60%", s: 2, d: 0.5 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="blob blob-a left-[-8%] top-[5%] h-[28rem] w-[28rem] bg-orange-500" aria-hidden />
      <div className="blob blob-b right-[-6%] top-[30%] h-96 w-96 bg-cyan-400" aria-hidden />
      <div className="blob blob-a bottom-[-10%] left-[35%] h-80 w-80 bg-violet-500" aria-hidden />
      {STARS.map((st, i) => (
        <span
          key={i}
          className="star"
          style={{ top: st.top, left: st.left, width: st.s, height: st.s, animationDelay: `${st.d}s` }}
          aria-hidden
        />
      ))}

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
        <div>
          <p className="word-in mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary-soft">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Every helper police-verified — free, within 48 hours
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="word-in" style={{ animationDelay: "80ms" }}>Daily</span>{" "}
            <span className="word-in" style={{ animationDelay: "180ms" }}>help,</span>
            <br />
            <span className="word-in" style={{ animationDelay: "300ms" }}>
              <WordRotate />
            </span>
          </h1>
          <p className="word-in mt-6 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "420ms" }}>
            Verified cleaners, cooks, laundry and caregivers across Hyderabad —
            summoned by <span className="font-semibold text-foreground">your voice</span>, in
            Telugu, Hindi, Tamil or English. Even from your Echo, iPhone or
            Google Assistant. Pay only after the job is done.
          </p>

          <div className="word-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "540ms" }}>
            <Link
              href="/#voice"
              className="btn-shine group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-bold text-on-primary glow-primary transition-all duration-200 hover:scale-[1.03]"
            >
              <Mic className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
              Try voice booking live
            </Link>
            <Link
              href="/book"
              className="glass inline-flex items-center justify-center rounded-2xl px-7 py-4 text-base font-semibold text-foreground transition-all duration-200 hover:border-primary/50 hover:text-primary-soft"
            >
              Book with taps instead
            </Link>
          </div>

          <dl className="word-in mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: "660ms" }}>
            <div>
              <dt className="sr-only">Free police verification</dt>
              <dd className="font-display text-3xl font-bold text-primary-soft text-glow">
                <CountUp end={48} suffix="h" />
              </dd>
              <dd className="mt-1 text-xs font-medium leading-snug text-muted">Free police verification</dd>
            </div>
            <div>
              <dt className="sr-only">Pay nothing until the job is done</dt>
              <dd className="font-display text-3xl font-bold text-primary-soft text-glow">₹0</dd>
              <dd className="mt-1 text-xs font-medium leading-snug text-muted">Until the job is done</dd>
            </div>
            <div>
              <dt className="sr-only">Voice languages</dt>
              <dd className="font-display text-3xl font-bold text-primary-soft text-glow">
                <CountUp end={4} />
              </dd>
              <dd className="mt-1 text-xs font-medium leading-snug text-muted">Voice languages</dd>
            </div>
            <div>
              <dt className="sr-only">Assistant integrations</dt>
              <dd className="font-display text-3xl font-bold text-primary-soft text-glow">
                <CountUp end={3} />
              </dd>
              <dd className="mt-1 text-xs font-medium leading-snug text-muted">Assistants: Alexa · Siri · Google</dd>
            </div>
          </dl>
        </div>

        {/* Right: floating glass stack */}
        <div className="animate-fade-up relative hidden lg:block" style={{ animationDelay: "250ms" }}>
          <div className="relative mx-auto max-w-sm">
            <div className="glass tilt-card animate-float rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 font-display text-sm font-bold text-white">
                  MK
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold">
                    Meena K.
                    <ShieldCheck className="h-4 w-4 text-success" aria-label="Verified" />
                  </p>
                  <p className="text-sm text-muted">House Cleaning · ★ 4.9 · 412 jobs</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-surface p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" aria-hidden />
                  En route — arriving soon
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  Live tracking · shareable with family
                </div>
                <div className="shimmer-line mt-3 h-1.5 rounded-full bg-black/10" aria-hidden />
              </div>
            </div>

            <div className="glass glow-ring animate-float-slow absolute -bottom-8 -left-10 max-w-[240px] rounded-3xl p-4" style={{ animationDelay: "1.2s" }}>
              <p className="flex items-start gap-2 text-sm font-semibold leading-snug">
                <Mic className="mt-0.5 h-4 w-4 shrink-0 text-primary-soft" aria-hidden />
                “ఈ సాయంత్రం క్లీనింగ్ కావాలి”
              </p>
              <p className="mt-1.5 text-xs text-muted">Telugu · booked in one sentence</p>
            </div>

            <div className="absolute -right-6 -top-8 flex flex-col gap-2">
              {[
                { icon: Speaker, label: "Alexa", color: "#38bdf8", delay: "0s" },
                { icon: Smartphone, label: "Siri", color: "#a78bfa", delay: "0.8s" },
                { icon: CircleDot, label: "Google", color: "#34d399", delay: "1.6s" },
              ].map((a) => (
                <span
                  key={a.label}
                  className="glass tilt-card animate-float inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold"
                  style={{ color: a.color, animationDelay: a.delay }}
                >
                  <a.icon className="h-3.5 w-3.5" aria-hidden />
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <Link href="/#services" aria-label="Scroll to services" className="text-muted transition-colors hover:text-primary-soft">
          <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
