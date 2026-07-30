import Link from "next/link";
import { ShieldCheck, CalendarCheck, ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import SilkWave from "@/components/layout/SilkWave";
import HeroLiquid from "@/components/motion/HeroLiquid";
import HeroTitle from "@/features/home/HeroTitle";
import { ZONES } from "@/lib/domain";

// LuminaAI-reference hero: elegant serif headline on a clear ivory canvas,
// dark pill CTA, and the silk-dune wave field owning the lower half with the
// trust strip resting on it. Server-rendered; HomeCinema + HeroTitle add the
// GSAP choreography via the data-* hooks.

export default function Hero() {
  return (
    <section data-hero className="cine-vignette relative flex min-h-[92vh] flex-col overflow-hidden">
      {/* WebGL liquid light — behind the dunes; desktop + motion-ok users only */}
      <HeroLiquid />
      <SilkWave />

      {/* volumetric god-rays sweeping the upper canvas (desktop only) */}
      <div data-shafts className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="sun-shaft left-[8%] top-[-22%] h-[85%] w-[34%]"
          style={{ animationDuration: "16s" }}
        />
        <div
          className="sun-shaft right-[10%] top-[-28%] h-[75%] w-[26%]"
          style={{ animationDuration: "21s", animationDelay: "-7s" }}
        />
      </div>

      {/* cursor-tracked light — HomeCinema drives x/y over the silk */}
      <div
        data-hero-glow
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[42rem] w-[42rem] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.16), transparent 62%)" }}
        aria-hidden
      />

      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 pt-20 text-center sm:px-6 lg:pt-24"
      >
        <Badge variant="glass" className="animate-fade-up mb-8">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Every helper police-verified — free, within 48 hours
        </Badge>

        <HeroTitle />

        {/* LCP element — never animate its opacity (Lighthouse LCP penalty). */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Verified cleaners, cooks, laundry and caregivers across Hyderabad —
          booked in about two minutes, priced upfront, and protected by a
          money-back promise on every job.
        </p>

        <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row" style={{ animationDelay: "240ms" }}>
          <span data-magnetic className="inline-block">
            <Button href="/book" variant="pill" size="lg" className="group">
              <CalendarCheck className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
              Book a service
            </Button>
          </span>
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
