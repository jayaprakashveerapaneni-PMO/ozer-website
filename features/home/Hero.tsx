import Link from "next/link";
import { ShieldCheck, CalendarCheck, ArrowRight } from "lucide-react";
import HeroStage from "@/components/layout/HeroStage";
import HeroLiquid from "@/components/motion/HeroLiquid";
import HeroTitle from "@/features/home/HeroTitle";
import { NOCTURNE } from "@/lib/design";

// Act I — the nocturne. The film opens in a warm dark chamber where ribbons
// of liquid gold stream out of a single light and a still pool catches them
// below; scrolling out of it dawns into the ivory page. HeroStage carries the
// composition in server-rendered SVG (so it is complete without JS);
// HeroLiquid layers the live WebGL field on top for motion-ok users, and
// HomeCinema/LightDirector add the scroll and cursor choreography.
//
// All type here is AA-enforced against NOCTURNE.bgLift — the ceiling both the
// shader and the stage clamp their headline band to. See lib/design.

export default function Hero() {
  return (
    <section
      data-hero
      data-sun-stop="0.32,0.52,1,0"
      className="relative flex min-h-[96vh] flex-col overflow-hidden"
    >
      <HeroStage />
      <HeroLiquid />

      {/* cursor-tracked light — HomeCinema drives x/y over the stage */}
      <div
        data-hero-glow
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[42rem] w-[42rem] rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(251,191,110,0.16), transparent 62%)" }}
        aria-hidden
      />

      <div
        data-hero-copy
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-[46vh] pt-20 text-center sm:px-6 lg:pt-24"
      >
        <div className="relative flex flex-col items-center">
          {/* The contrast guarantee. It wraps the copy itself, so it holds at
              every viewport no matter where the light landed — a band clamped
              in the shader's UV space cannot know where the text ended up.
              Worst case is a blown-white ribbon under 0.86 of NOCTURNE.bg,
              compositing to #433c36: ivory 10.2:1, textSoft 7.0:1, gold 7.4:1.
              It stays fully opaque past the type and only feathers outside it. */}
          <div
            className="pointer-events-none absolute inset-x-[-18%] inset-y-[-14%] -z-10"
            style={{
              background:
                "radial-gradient(ellipse 58% 54% at 50% 50%, rgba(36,28,21,0.86) 0%, rgba(36,28,21,0.86) 62%, transparent 100%)",
            }}
            aria-hidden
          />

        <span
          className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md"
          style={{
            color: NOCTURNE.text,
            borderColor: "rgba(251,191,110,0.28)",
            background: "rgba(244,239,231,0.07)",
          }}
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: NOCTURNE.gold }} aria-hidden />
          Every helper police-verified — free, within 48 hours
        </span>

        <HeroTitle />

        {/* LCP element — never animate its opacity (Lighthouse LCP penalty). */}
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: NOCTURNE.textSoft }}
        >
          Verified cleaners, cooks, laundry and caregivers across Hyderabad —
          booked in about two minutes, priced upfront, and protected by a
          money-back promise on every job.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <span data-magnetic className="inline-block">
            <Link
              href="/book"
              className="group inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold backdrop-blur-md transition-all duration-200 hover:scale-[1.03]"
              style={{
                color: NOCTURNE.text,
                borderColor: "rgba(251,191,110,0.45)",
                background: "rgba(244,239,231,0.10)",
                boxShadow: "0 1px 0 rgba(255,233,194,0.25) inset, 0 10px 40px rgba(217,160,76,0.22)",
              }}
            >
              <CalendarCheck className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
              Book a service
            </Link>
          </span>
          <Link
            href="/#services"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: NOCTURNE.gold }}
          >
            Explore services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          </div>
        </div>
      </div>

      {/* Below the copy the stage is deliberately empty: the pool, the
          reflection and the dawn get the whole lower half to themselves.
          Nothing is placed over the dawn ramp, where ivory type would lose
          its contrast as the background lifts toward the page. */}
    </section>
  );
}
