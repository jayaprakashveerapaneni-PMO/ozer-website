import { BadgeCheck, CalendarCheck, Banknote, GraduationCap } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Free verification",
    body: "Police verification and KYC at zero cost to you, completed within 48 hours of your documents.",
  },
  {
    icon: Banknote,
    title: "Daily payouts",
    body: "Earnings credited on job completion. Withdraw to your bank anytime, from ₹100.",
  },
  {
    icon: CalendarCheck,
    title: "Your hours, your area",
    body: "Choose your working hours, days off and neighbourhoods. Pause anytime with vacation mode.",
  },
  {
    icon: GraduationCap,
    title: "App in your language",
    body: "Telugu, Hindi, Tamil or English — with voice guidance on every step. No reading required.",
  },
];

export default function Helpers() {
  return (
    <section id="helpers" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-b left-[-5%] bottom-[10%] h-80 w-80 bg-orange-500" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary">
              For helpers · సహాయకుల కోసం · सहायकों के लिए
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Steady work. Daily pay. <span className="gradient-text">Real respect.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Join Ozer as a cleaning professional, cook, laundry or care
              worker. Get matched to jobs near you that fit your skills and
              your hours — with no agency fees, ever.
            </p>
            <Button href="/helper" size="lg" className="mt-7">
              Open the helper app →
            </Button>
            <p className="mt-3 text-xs text-muted">
              Live job offers, OTP arrival verification, daily payouts — try it
              as Meena, Lakshmi, Fatima or Radha.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 90}>
                <div className="glass tilt-card h-full rounded-3xl p-5">
                  <b.icon className="h-6 w-6 text-primary" aria-hidden />
                  <h3 className="mt-3 text-sm font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
