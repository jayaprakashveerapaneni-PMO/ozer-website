import { ShieldCheck, MapPin, Wallet, KeyRound, RotateCcw, FileCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Police-verified helpers",
    body: "Government-ID KYC plus police verification before a helper can take a single job. Free for helpers, done within 48 hours — re-checked on expiry.",
  },
  {
    icon: KeyRound,
    title: "OTP arrival handshake",
    body: "The person at your door proves they're the assigned helper with a one-time code before the job starts. No substitutes, ever.",
  },
  {
    icon: MapPin,
    title: "Live tracking, shareable",
    body: "Follow your helper from en route to arrival, and share a read-only tracking link with family — no app install needed on their side.",
  },
  {
    icon: Wallet,
    title: "Pay after service",
    body: "UPI, cards or netbanking — only after you confirm the job is done. Your money never moves before your satisfaction does.",
  },
  {
    icon: RotateCcw,
    title: "Money-back promise",
    body: "Raise an issue within 48 hours and choose: full refund or a replacement helper. Refunds initiated within 24 hours of approval.",
  },
  {
    icon: FileCheck,
    title: "Certified care, proven",
    body: "Child & elder carers hold verified first-aid and training certifications, with timestamped check-ins so you always know care is happening.",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="scroll-mt-16 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Trust isn&apos;t a feature. <span className="gradient-text">It&apos;s the product.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            The informal market runs on hope. Ozer runs on verification,
            visibility and guarantees — at every step.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 90}>
              <div className="glass tilt-card h-full rounded-3xl p-6">
                <p.icon className="h-7 w-7 text-primary-soft" aria-hidden />
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
