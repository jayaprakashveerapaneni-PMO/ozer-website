"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, CheckCircle2, Speaker, Smartphone, CircleDot, BadgeCheck } from "lucide-react";
import { ASSISTANT_ACCENT, ASSISTANT_ACCENT_INK, withAlpha } from "@/lib/design";

type Turn = { who: "user" | "assistant" | "system"; text: string };

interface Platform {
  id: string;
  name: string;
  device: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  ink: string;
  glow: string;
  depth: string;
  langs: string;
  script: Turn[];
}

// Scripts follow FR-54..58: spoken confirmation before booking (FR-56),
// per-platform depth is honest (Alexa full dialog; Siri/Google shortcut-launch).
const PLATFORMS: Platform[] = [
  {
    id: "alexa",
    name: "Amazon Alexa",
    device: "Echo · full voice dialog",
    icon: Speaker,
    accent: ASSISTANT_ACCENT.alexa,
    ink: ASSISTANT_ACCENT_INK.alexa,
    glow: withAlpha(ASSISTANT_ACCENT.alexa, 0.25),
    depth: "Full conversational booking",
    langs: "English + Hindi",
    script: [
      { who: "user", text: "Alexa, ask Ozer to book a cleaner for 4 PM." },
      { who: "assistant", text: "Sure. A verified cleaner today at 4 PM for your saved home in Madhapur — around ₹160 to ₹240, pay after service. Shall I book it?" },
      { who: "user", text: "Yes, book it." },
      { who: "assistant", text: "Done! Meena K., 4.9 stars, is assigned. I've sent the tracking link to your phone." },
      { who: "system", text: "✓ Appointment scheduled — booking OZ-A4T21 created from Alexa" },
    ],
  },
  {
    id: "siri",
    name: "Apple Siri",
    device: "iPhone · App Shortcuts",
    icon: Smartphone,
    accent: ASSISTANT_ACCENT.siri,
    ink: ASSISTANT_ACCENT_INK.siri,
    glow: withAlpha(ASSISTANT_ACCENT.siri, 0.25),
    depth: "Shortcut phrases → in-app booking",
    langs: "English (launch)",
    script: [
      { who: "user", text: "Hey Siri, book my Ozer cook." },
      { who: "assistant", text: "Opening Ozer with your favourite cook, Fatima S., and your usual dinner slot pre-filled." },
      { who: "system", text: "→ Ozer app opens at review screen — one tap to confirm" },
      { who: "user", text: "*taps Confirm*" },
      { who: "system", text: "✓ Appointment scheduled — booking OZ-S7K93 created via Siri Shortcut" },
    ],
  },
  {
    id: "google",
    name: "Google Assistant",
    device: "Android · App Actions",
    icon: CircleDot,
    accent: ASSISTANT_ACCENT.google,
    ink: ASSISTANT_ACCENT_INK.google,
    glow: withAlpha(ASSISTANT_ACCENT.google, 0.25),
    depth: "Deep-links straight into the app",
    langs: "English + Hindi (launch)",
    script: [
      { who: "user", text: "Hey Google, book a cleaner on Ozer." },
      { who: "assistant", text: "Opening Ozer to book a cleaner." },
      { who: "system", text: "→ App opens at cleaning booking, your address & last preferences loaded" },
      { who: "user", text: "*picks slot, taps Confirm*" },
      { who: "system", text: "✓ Appointment scheduled — booking OZ-G2M58 created via App Action" },
    ],
  },
];

function Conversation({ platform }: { platform: Platform }) {
  const [visible, setVisible] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(0);
    setPlaying(true);
    let t = 300;
    platform.script.forEach((turn, i) => {
      if (turn.who === "assistant") {
        timers.current.push(setTimeout(() => setTyping(true), t));
        t += 900;
      }
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setVisible(i + 1);
          if (i === platform.script.length - 1) setPlaying(false);
        }, t)
      );
      t += turn.who === "system" ? 700 : 1100;
    });
  };

  const done = visible === platform.script.length && !playing;

  return (
    <div className="flex min-h-[300px] flex-col">
      <div className="flex-1 space-y-3" aria-live="polite">
        {platform.script.slice(0, visible).map((turn, i) => (
          <div
            key={i}
            className={`animate-fade-up flex ${turn.who === "user" ? "justify-end" : "justify-start"}`}
          >
            {turn.who === "system" ? (
              <p className="mx-auto rounded-full bg-surface px-4 py-1.5 text-center text-xs font-semibold" style={{ color: platform.ink }}>
                {turn.text}
              </p>
            ) : (
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  turn.who === "user"
                    ? "rounded-br-md bg-primary/90 text-on-primary"
                    : "rounded-bl-md bg-surface text-foreground/90"
                }`}
                style={turn.who === "assistant" ? { border: `1px solid ${platform.glow}` } : undefined}
              >
                {turn.text}
              </p>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3" style={{ color: platform.accent }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        {visible === 0 && !playing ? (
          <button
            type="button"
            onClick={play}
            className="btn-shine inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105"
            style={{ background: platform.ink, boxShadow: `0 0 28px ${platform.glow}` }}
          >
            <Play className="h-4 w-4" aria-hidden /> Play conversation
          </button>
        ) : done ? (
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Replay
          </button>
        ) : (
          <p className="text-xs text-muted">Playing…</p>
        )}
      </div>
    </div>
  );
}

export default function Assistants() {
  const [active, setActive] = useState(0);
  const platform = PLATFORMS[active];

  return (
    <section id="assistants" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-b left-[40%] top-[-5%] h-96 w-96 bg-violet-500" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-violet">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            INDUSTRY FIRST — no home-services rival offers this
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Schedule from <span className="gradient-text">Alexa, Siri & Google</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Your smart speaker and phone assistant become booking channels.
            Tap a platform and watch a real appointment get scheduled.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Assistant platforms">
          {PLATFORMS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`tilt-card inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                active === i ? "glass text-foreground" : "border border-transparent text-muted hover:text-foreground"
              }`}
              style={active === i ? { boxShadow: `0 0 32px ${p.glow}`, borderColor: p.accent } : undefined}
            >
              <p.icon className="h-5 w-5" style={{ color: p.accent }} aria-hidden />
              {p.name}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 lg:grid-cols-[1fr_260px]">
          {/* Conversation player */}
          <div className="glass rounded-3xl p-6" role="tabpanel" aria-label={`${platform.name} demo`}>
            <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: platform.glow }}
                >
                  <platform.icon className="h-5 w-5" style={{ color: platform.accent }} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{platform.name}</p>
                  <p className="text-xs text-muted">{platform.device}</p>
                </div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full animate-pulse-dot" style={{ background: platform.accent }} aria-hidden />
            </div>
            <Conversation key={platform.id} platform={platform} />
          </div>

          {/* Honest capability card */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Depth</p>
              <p className="mt-1.5 text-sm font-semibold">{platform.depth}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted">Languages</p>
              <p className="mt-1.5 text-sm font-semibold">{platform.langs}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Always true</p>
              <ul className="mt-2 space-y-2 text-xs text-foreground/80">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                  You confirm before anything is booked
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                  No payments ever via external assistants
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                  All 4 languages always available in-app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
