import { ListChecks, CalendarClock, UserCheck, CreditCard } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import HiwPhone from "@/features/home/HiwPhone";
import { ActLabel } from "@/components/ui";

const steps = [
  {
    icon: ListChecks,
    title: "Pick your service",
    body: "Cleaning, cook, laundry or care. See the full price before you even sign in.",
  },
  {
    icon: CalendarClock,
    title: "Pick your slot",
    body: "ASAP or up to 14 days ahead. Choose from verified helpers near you — photo, rating and badge shown.",
  },
  {
    icon: CreditCard,
    title: "Pay securely upfront",
    body: "UPI, card or netbanking at booking. Every rupee is protected by the money-back promise.",
  },
  {
    icon: UserCheck,
    title: "Track & verify arrival",
    body: "Watch your helper live from en route, share tracking with family, OTP handshake at the door.",
  },
];

// The How-It-Works act: a pinned scroll scene on desktop. HomeCinema pins the
// section and conducts the step cards in one by one while broadcasting the
// active step to the phone stage, which plays the matching app screen — the
// steps and the product moving as one shot. Mobile gets batch-rise cards and
// a self-playing phone. Everything renders fully visible for no-JS / reduced
// motion / automated agents; GSAP sets the hidden initial states itself.

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-hiw
      data-sun-stop="0.12,0.26,1,0.85"
      className="flex scroll-mt-16 flex-col justify-center py-20 lg:min-h-screen lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <ActLabel n="03">How it flows</ActLabel>
          <h2 className="section-display">
            From “I need help” to helped — <span className="gradient-text">in four steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            About two minutes, never more than five screens. Watch it happen →
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:items-center">
          <ol data-hiw-grid className="grid gap-6 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} data-hiw-card className="relative">
                <div className="glass tilt-card relative h-full overflow-hidden rounded-3xl p-6">
                  <span
                    className="pointer-events-none absolute -right-2 -top-5 font-serif text-[5.5rem] leading-none text-primary/10"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="font-serif text-2xl italic text-primary/80" aria-hidden>
                    0{i + 1}
                  </span>
                  <s.icon className="mt-2 h-7 w-7 text-primary" aria-hidden />
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <HiwPhone />
        </div>
      </div>
    </section>
  );
}
