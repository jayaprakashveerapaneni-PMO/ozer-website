import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import SilkWave from "@/components/layout/SilkWave";
import Reveal from "@/components/motion/Reveal";

// The closing moment: the hero's silk dunes return to bookend the page, with
// one confident serif line and a single CTA. data-magnetic picks up the
// cursor-magnetism HomeCinema already wires sitewide.

export default function FinalCta() {
  return (
    <section
      data-finale
      data-sun-stop="0.5,0.78,1.3,1"
      className="relative flex min-h-[76vh] flex-col overflow-hidden"
    >
      <SilkWave />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 pb-32 pt-24 text-center sm:px-6 lg:pb-44 lg:pt-32">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            Verified helpers · Fixed price · Money-back promise
          </p>
          <h2 className="section-display mx-auto max-w-3xl">
            Your evening back, <span className="gradient-text">in about two minutes.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Pick a service, pay one transparent price, and a police-verified helper is on the
            way. Cancel any time before assignment for a full instant refund.
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <span data-magnetic className="inline-block">
            <Button href="/book" variant="pill" size="lg" className="group">
              <CalendarCheck className="h-5 w-5 transition-transform group-hover:scale-125" aria-hidden />
              Book a service
            </Button>
          </span>
          <Link
            href="/assistants"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
          >
            or just ask Alexa
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
