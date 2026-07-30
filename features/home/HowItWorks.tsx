import { ListChecks, CalendarClock, UserCheck, CreditCard } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

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

// The four steps are a pinned scroll scene: HomeCinema pins the section on
// desktop and conducts the cards in one-by-one as you scroll through it
// (batch-rise on mobile). Cards render fully visible for no-JS / reduced
// motion / automated agents — GSAP sets the hidden initial states itself.

export default function HowItWorks() {
  return (
    <section id="how-it-works" data-hiw className="flex scroll-mt-16 flex-col justify-center py-20 lg:min-h-screen lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <h2 className="section-display">
            From “I need help” to helped — <span className="gradient-text">in four steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            About two minutes, never more than five screens.
          </p>
        </Reveal>

        <ol data-hiw-grid className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} data-hiw-card className="relative">
              <div className="glass tilt-card relative h-full rounded-3xl p-6">
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 font-display text-xs font-bold text-on-primary glow-primary">
                  {i + 1}
                </span>
                <s.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
