import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/domain";
import Reveal from "@/components/motion/Reveal";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="cine max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Hyderabad households, <span className="gradient-text">heard.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="glass tilt-card flex h-full flex-col rounded-3xl p-6">
                <Quote className="h-6 w-6 text-primary/50" aria-hidden />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted">{t.role} · {t.area}</p>
                    </div>
                    <div className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-primary-soft text-primary" aria-hidden />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-primary">
                    {t.service}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
