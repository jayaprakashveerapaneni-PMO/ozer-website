import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/domain";
import { ZONES } from "@/lib/domain";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { ActLabel } from "@/components/ui";

// The proof act — the record stated at editorial scale. Numbers get the
// serif display voice (typography as the lead actor, not decorated tiles),
// then one household speaks at pull-quote scale with the rest in an
// asymmetric supporting column. Replaces the old three-card testimonial grid.

const STATS = [
  { end: 2, suffix: " min", label: "average time to book" },
  { end: 100, suffix: "%", label: "helpers police-verified" },
  { end: 48, suffix: " hr", label: "verification turnaround" },
  { end: ZONES.length, suffix: "", label: "zones across Hyderabad" },
];

const stars = (
  <span className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, j) => (
      <Star key={j} className="h-3.5 w-3.5 fill-primary-soft text-primary" aria-hidden />
    ))}
  </span>
);

export default function Proof() {
  const [pull, ...rest] = TESTIMONIALS;
  const cut = pull.quote.indexOf(". ");
  const pullLine = cut === -1 ? pull.quote : pull.quote.slice(0, cut + 1);
  const pullRest = cut === -1 ? "" : pull.quote.slice(cut + 2);

  return (
    <section id="proof" data-sun-stop="0.84,0.16,0.9,0.8" className="relative scroll-mt-16 py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <ActLabel n="08">The record</ActLabel>
          <h2 className="section-display">
            Hyderabad households, <span className="gradient-text">heard.</span>
          </h2>
        </Reveal>

        {/* the record, in numbers */}
        <ul className="mt-14 grid list-none gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <li key={s.label} data-drift={i % 2 ? "0.12" : "0.04"}>
              <Reveal delay={i * 90}>
                <div className="border-l border-line pl-6">
                  <p className="font-serif text-[clamp(3.25rem,2.2rem+4vw,5.5rem)] leading-none text-foreground">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* one household, at full volume */}
        <Reveal className="mt-24 lg:mt-32">
          <figure className="max-w-4xl">
            <span className="font-serif text-7xl leading-none text-primary/30" aria-hidden>
              “
            </span>
            <blockquote className="-mt-6 font-serif text-[clamp(1.8rem,1.15rem+2.6vw,3.25rem)] leading-[1.16] tracking-tight text-foreground/90 [text-wrap:balance]">
              {pullLine}
            </blockquote>
            {pullRest && <p className="mt-5 max-w-xl text-base text-muted">{pullRest}</p>}
            <figcaption className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                {pull.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <span className="font-semibold">{pull.name}</span>
              <span className="text-muted">
                {pull.role} · {pull.area} · {pull.service}
              </span>
              {stars}
            </figcaption>
          </figure>
        </Reveal>

        {/* the supporting voices, asymmetric */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:gap-16">
          {rest.map((t, i) => (
            <div key={t.name} data-drift={i % 2 ? "0.14" : "0.06"} className={i % 2 ? "lg:mt-16" : ""}>
              <Reveal delay={i * 120}>
                <figure className="border-l-2 border-primary/25 pl-6">
                <blockquote className="font-serif text-xl leading-relaxed text-foreground/85 lg:text-2xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-muted">
                    {t.role} · {t.area} · {t.service}
                  </span>
                  {stars}
                </figcaption>
                </figure>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
