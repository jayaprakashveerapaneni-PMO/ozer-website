import Link from "next/link";
import { Sparkles, CookingPot, Shirt, HeartHandshake, Check, ArrowRight, Zap } from "lucide-react";
import { SERVICES, type ServiceId } from "@/lib/domain";
import { SERVICE_ACCENT, withAlpha } from "@/lib/design";
import Reveal from "@/components/motion/Reveal";
import Spotlight from "@/components/motion/Spotlight";

const ICONS: Record<ServiceId, React.ComponentType<{ className?: string }>> = {
  cleaning: Sparkles,
  cook: CookingPot,
  laundry: Shirt,
  care: HeartHandshake,
};

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-16 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Four services. <span className="gradient-text">One tap — or one sentence.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Every card is clickable — tap anywhere on it to start booking.
            Transparent, pre-known rates; the price you see is the price you approve.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.id];
            const accent = SERVICE_ACCENT[s.id];
            return (
              <Reveal key={s.id} delay={i * 80}>
                <Spotlight color={withAlpha(accent, 0.19)} className="h-full rounded-3xl">
                  {/* whole card is one link — clickable anywhere */}
                  <Link
                    href={`/book?service=${s.id}`}
                    aria-label={`Book ${s.name}`}
                    className="glass tilt-card group relative block h-full overflow-hidden rounded-3xl p-6 transition-colors duration-200 hover:border-primary/30"
                  >
                    <div
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
                      style={{ background: accent }}
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                        style={{ background: withAlpha(accent, 0.13), color: accent }}
                      >
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                        {s.minNote}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                    <p className="mt-3 font-display text-lg font-bold" style={{ color: accent }}>
                      {s.pricing}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground/70">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {/* boxed, highlighted CTA */}
                    <span
                      className="btn-shine mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-5 py-3.5 text-sm font-bold transition-all duration-200 group-hover:scale-[1.02]"
                      style={{
                        color: "white",
                        background: accent,
                        borderColor: accent,
                        boxShadow: `0 0 24px ${withAlpha(accent, 0.27)}`,
                      }}
                    >
                      Book {s.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                  {/* ⚡ one-tap instant booking — sibling overlay, not nested in the card link */}
                  <Link
                    href={`/book?service=${s.id}&instant=1`}
                    aria-label={`Instant book ${s.name} — ASAP`}
                    className="btn-shine absolute right-4 top-16 z-10 inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition-all duration-200 hover:scale-110"
                    style={{ color: accent, borderColor: withAlpha(accent, 0.4) }}
                  >
                    <Zap className="h-3.5 w-3.5" aria-hidden /> Instant — ASAP
                  </Link>
                </Spotlight>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
