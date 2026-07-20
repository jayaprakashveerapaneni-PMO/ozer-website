import Link from "next/link";
import { ShieldCheck, CalendarCheck, ArrowRight } from "lucide-react";
import WordRotate from "@/components/motion/WordRotate";
import { Button, Badge } from "@/components/ui";
import SilkWave from "@/components/layout/SilkWave";
import { ZONES } from "@/lib/domain";

// LuminaAI-reference hero: elegant serif headline on a clear ivory canvas,
// dark pill CTA, and the silk-dune wave field owning the lower half with the
// trust strip resting on it. Text and wave never meet.

export default function Hero() {
  return (
    <section className="cine-vignette relative flex min-h-[92vh] flex-col overflow-hidden">
      <SilkWave />

      {/* volumetric god-rays sweeping the upper canvas (desktop only) */}
      <div
        className="sun-shaft left-[8%] top-[-22%] h-[85%] w-[34%]"
        style={{ animationDuration: "16s" }}
        aria-hidden
      />
      <div
        className="sun-shaft right-[10%] top-[-28%] h-[75%] w-[26%]"
        style={{ animationDuration: "21s", animationDelay: "-7s" }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 pt-20 text-center sm:px-6 lg:pt-24">
        <Badge variant="glass" className="animate-fade-up mb-8">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Every helper police-verified — free, within 48 hours
        </Badge>

        {/* Title-card entrance: each line rises out of its own mask. The
            lines start clipped, so the (unanimated) subcopy below stays LCP. */}
        <h1
          className="mx-auto max-w-4xl text-6xl leading-[1.02] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="cine-mask">
            <span className="cine-line">Daily Help That</span>
          </span>
          <span className="cine-mask">
            <span className="cine-line" style={{ "--cine-delay": "180ms" } as React.CSSProperties}>
              Flows With <em className="not-italic"><WordRotate /></em>
            </span>
          </span>
        </h1>

        {/* LCP element — never animate its opacity (Lighthouse LCP penalty). */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Verified cleaners, cooks, laundry and caregivers across Hyderabad —
          booked in about two minutes, priced upfront, and protected by a
          money-back promise on every job.
        </p>

        <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row" style={{ animationDelay: "240ms" }}>
          <Button href="/book" variant="pill" size="lg" className="group">
            <CalendarCheck className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
            Book a service
          </Button>
          <Link
            href="/#services"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
          >
            Explore services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        {/* trust strip resting on the wave (reference: logo row) */}
        <div className="animate-fade-up mt-auto pb-14 pt-24" style={{ animationDelay: "380ms" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
            Serving households across
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {ZONES.slice(0, 6).map((z) => (
              <li key={z} className="font-display text-sm font-semibold text-foreground/70">
                {z}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
