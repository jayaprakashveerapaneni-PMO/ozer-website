import Link from "next/link";
import { Mic, ShieldCheck, ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

// EP-14 surface. Honest per-platform depth: Alexa = custom skill, Siri =
// Apple Shortcut. Google Assistant is intentionally absent — Google retired
// third-party voice actions in 2023 (an Android app unlocks App Actions
// later). FR-27: voice starts a booking; payment always happens here.

const PLATFORMS = [
  {
    name: "Amazon Alexa",
    tag: "Custom skill",
    say: "“Alexa, ask Ozer to book two hours of cleaning in Madhapur”",
    body: "Pair once with the code from your account page. Alexa drafts the booking and it appears on your Ozer account instantly.",
  },
  {
    name: "Siri",
    tag: "Apple Shortcut",
    say: "“Hey Siri, Ozer cleaning”",
    body: "Add the Ozer shortcut to your iPhone in two minutes — your voice starts the draft, your thumb approves the payment.",
  },
];

export default function Assistants() {
  return (
    <section id="assistants" className="relative scroll-mt-16 py-24 lg:py-36">
      <div className="blob blob-b right-[8%] top-[15%] h-72 w-72 bg-violet-500" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary">
            <Mic className="h-3.5 w-3.5" aria-hidden /> Voice assistants
          </p>
          <h2 className="section-display">
            Say it to your speaker. <span className="gradient-text">Approve it here.</span>
          </h2>
          <p className="mt-4 text-muted">
            Start a booking from Alexa or Siri while your hands are full. The draft lands on
            your Ozer account — you review, pay securely, and only then is anything booked.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PLATFORMS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90} className="h-full">
              <div className="glass tilt-card flex h-full flex-col rounded-3xl p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display font-bold">{p.name}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {p.tag}
                  </span>
                </div>
                <p
                  className="mt-4 rounded-2xl bg-surface p-4 text-lg italic leading-snug"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {p.say}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/assistants"
            className="btn-shine inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-105"
          >
            Set up voice booking <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
            Voice never books alone — payment stays on Ozer, with the same money-back promise.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
