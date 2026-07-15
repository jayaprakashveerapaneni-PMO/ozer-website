import Link from "next/link";
import { ShieldCheck, MapPin, Mic, Speaker, Smartphone, CircleDot, ArrowDown } from "lucide-react";
import WordRotate from "@/components/motion/WordRotate";
import CountUp from "@/components/motion/CountUp";
import { Button, Badge } from "@/components/ui";
import SilkWave from "@/components/layout/SilkWave";
import FlowRibbons from "@/components/layout/FlowRibbons";
import { ASSISTANT_ACCENT } from "@/lib/design";

// Centered, cinematic hero: headline over a flowing silk wave, with the
// product cards floating at the sides for depth (Lumina-style composition).

const STATS = [
  { end: 48, suffix: "h", label: "Free police verification" },
  { end: 0, prefix: "₹", label: "Until the job is done" },
  { end: 4, label: "Voice languages" },
  { end: 3, label: "Assistants: Alexa · Siri · Google" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* the spectacle: layered silk wave with light-strings above it */}
      <SilkWave />
      <div className="opacity-60">
        <FlowRibbons />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 text-center sm:px-6 lg:pb-32 lg:pt-28">
        <Badge variant="glass" className="animate-fade-up mb-6">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Every helper police-verified — free, within 48 hours
        </Badge>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="word-in">Daily help that</span>
          <br />
          <span className="word-in" style={{ animationDelay: "120ms" }}>
            flows — <WordRotate />
          </span>
        </h1>

        {/* LCP element — never animate its opacity (Lighthouse LCP penalty). */}
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          Verified cleaners, cooks, laundry and caregivers across Hyderabad —
          summoned by <span className="font-semibold text-foreground">your voice</span>, in
          Telugu, Hindi, Tamil or English. Even from your Echo, iPhone or Google
          Assistant. Pay only after the job is done.
        </p>

        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
          <Button href="/#voice" size="lg" className="group">
            <Mic className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
            Try voice booking live
          </Button>
          <Button href="/book" variant="glass" size="lg">
            Book with taps instead
          </Button>
        </div>

        <dl className="animate-fade-up mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4" style={{ animationDelay: "340ms" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-primary text-glow">
                {s.prefix}
                <CountUp end={s.end} suffix={s.suffix ?? ""} />
              </dd>
              <dd className="mt-1 text-xs font-medium leading-snug text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        {/* floating depth cards — flanking the centered composition */}
        <div className="animate-float absolute left-2 top-40 hidden w-64 text-left xl:block" aria-hidden>
          <div className="glass tilt-card rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 font-display text-xs font-bold text-white">
                MK
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  Meena K.
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                </p>
                <p className="text-xs text-muted">★ 4.9 · 412 jobs</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-surface p-2.5">
              <p className="flex items-center gap-2 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                En route — arriving soon
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
                <MapPin className="h-3 w-3" />
                Live tracking · shareable
              </div>
              <div className="shimmer-line mt-2 h-1 rounded-full bg-black/10" />
            </div>
          </div>
        </div>

        <div className="animate-float-slow absolute bottom-44 left-10 hidden max-w-[230px] text-left xl:block" style={{ animationDelay: "1.2s" }} aria-hidden>
          <div className="glass glow-ring rounded-3xl p-4">
            <p className="flex items-start gap-2 text-sm font-semibold leading-snug">
              <Mic className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span lang="te">“ఈ సాయంత్రం క్లీనింగ్ కావాలి”</span>
            </p>
            <p className="mt-1.5 text-xs text-muted">Telugu · booked in one sentence</p>
          </div>
        </div>

        <div className="absolute right-4 top-44 hidden flex-col gap-2 xl:flex" aria-hidden>
          {[
            { icon: Speaker, label: "Alexa", color: ASSISTANT_ACCENT.alexa, delay: "0s" },
            { icon: Smartphone, label: "Siri", color: ASSISTANT_ACCENT.siri, delay: "0.8s" },
            { icon: CircleDot, label: "Google", color: ASSISTANT_ACCENT.google, delay: "1.6s" },
          ].map((a) => (
            <span
              key={a.label}
              className="glass tilt-card animate-float inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold"
              style={{ color: a.color, animationDelay: a.delay }}
            >
              <a.icon className="h-3.5 w-3.5" />
              {a.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <Link href="/#services" aria-label="Scroll to services" className="text-muted transition-colors hover:text-primary">
          <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
