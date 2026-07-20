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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="cine max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            From “I need help” to helped — <span className="gradient-text">in four steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            About two minutes, never more than five screens.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 90} className="h-full">
                <div className="glass tilt-card relative h-full rounded-3xl p-6">
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 font-display text-xs font-bold text-on-primary glow-primary">
                    {i + 1}
                  </span>
                  <s.icon className="h-7 w-7 text-primary" aria-hidden />
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
