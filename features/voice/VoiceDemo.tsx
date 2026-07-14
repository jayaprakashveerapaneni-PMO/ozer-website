"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles, ArrowRight, Volume2 } from "lucide-react";
import {
  parseIntent,
  type ParsedIntent,
} from "@/lib/voice/parser";
import {
  VOICE_LANGS,
  SAMPLE_PHRASES,
  readbackText,
  notUnderstoodText,
  type VoiceLang,
} from "@/lib/voice/responses";
import {
  getRecognition,
  isRecognitionSupported,
  speak,
  type SpeechRecognitionLike,
} from "@/lib/voice/speech";
import { SERVICES } from "@/lib/domain";

type Phase = "idle" | "listening" | "thinking" | "confirm" | "failed";

export default function VoiceDemo() {
  const router = useRouter();
  const [lang, setLang] = useState<VoiceLang>("te-IN");
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [intent, setIntent] = useState<ParsedIntent>({ service: null, slot: null });
  const [micError, setMicError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  // BCP-47 language subtag for the `lang` attribute on Indic content (te/hi/ta/en).
  const langCode = lang.split("-")[0];

  // Browser capability, read without effects/setState. Server snapshot says
  // "supported" so SSR shows the mic; unsupported browsers correct on hydrate.
  const supported = useSyncExternalStore(
    () => () => {},
    isRecognitionSupported,
    () => true
  );

  useEffect(() => {
    return () => {
      recRef.current?.abort();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const process = useCallback(
    (text: string) => {
      setTranscript(text);
      setPhase("thinking");
      setTimeout(() => {
        const parsed = parseIntent(text);
        setIntent(parsed);
        if (parsed.service) {
          setPhase("confirm");
          speak(readbackText(lang, parsed), lang);
        } else {
          setPhase("failed");
          speak(notUnderstoodText(lang), lang);
        }
      }, 700);
    },
    [lang]
  );

  const startListening = useCallback(() => {
    setMicError(null);
    setTranscript("");
    const rec = getRecognition();
    if (!rec) return; // unsupported — `supported` already reflects this
    recRef.current?.abort();
    recRef.current = rec;
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      finalText = text;
      setTranscript(text);
    };
    rec.onerror = (e) => {
      setPhase("idle");
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMicError("Microphone permission denied — tap a sample phrase below instead.");
      } else if (e.error === "no-speech") {
        setMicError("Didn't hear anything — try again closer to the mic, or tap a sample phrase.");
      } else {
        setMicError("Speech service unavailable here — tap a sample phrase below to see the flow.");
      }
    };
    rec.onend = () => {
      if (finalText.trim()) process(finalText.trim());
      else setPhase((p) => (p === "listening" ? "idle" : p));
    };
    setPhase("listening");
    rec.start();
  }, [lang, process]);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const continueBooking = () => {
    const params = new URLSearchParams();
    if (intent.service) params.set("service", intent.service);
    if (intent.slot) params.set("slot", intent.slot);
    params.set("via", "voice");
    router.push(`/book?${params.toString()}`);
  };

  const reset = () => {
    setPhase("idle");
    setTranscript("");
    setIntent({ service: null, slot: null });
  };

  const svcMeta = intent.service ? SERVICES.find((s) => s.id === intent.service) : null;

  return (
    <section id="voice" className="relative scroll-mt-16 overflow-hidden py-20 lg:py-28">
      <div className="blob blob-a left-[-10%] top-[10%] h-96 w-96 bg-orange-500" aria-hidden />
      <div className="blob blob-b right-[-5%] bottom-[0%] h-80 w-80 bg-cyan-400" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            LIVE DEMO — real speech recognition, right in your browser
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Speak. <span className="gradient-text">Ozer books it.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Try it now — pick your language, tap the orb, and ask for help the
            way you&apos;d ask a neighbour.
          </p>
        </div>

        {/* Language selector */}
        <div className="mt-8 flex justify-center">
          <div className="glass inline-flex rounded-2xl p-1.5" role="radiogroup" aria-label="Voice language">
            {VOICE_LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="radio"
                aria-checked={lang === l.code}
                aria-label={l.label}
                onClick={() => { setLang(l.code); reset(); }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  lang === l.code
                    ? "bg-primary text-on-primary glow-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span lang={l.code.split("-")[0]}>{l.native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice stage */}
        <div className="glass mx-auto mt-8 max-w-2xl rounded-3xl p-8 text-center">
          {/* Orb */}
          <div className="relative mx-auto h-28 w-28">
            {phase === "listening" && (
              <>
                <span className="sonar-ring" aria-hidden />
                <span className="sonar-ring delay" aria-hidden />
              </>
            )}
            <button
              type="button"
              onClick={phase === "listening" ? stopListening : startListening}
              disabled={!supported || phase === "thinking"}
              aria-label={phase === "listening" ? "Stop listening" : "Start voice booking"}
              className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 ${
                phase === "listening"
                  ? "bg-primary glow-primary scale-105"
                  : "bg-gradient-to-br from-orange-500 to-orange-700 hover:scale-105 animate-breathe"
              } disabled:opacity-40`}
            >
              {supported ? (
                <Mic className="h-10 w-10 text-white" aria-hidden />
              ) : (
                <MicOff className="h-10 w-10 text-white" aria-hidden />
              )}
            </button>
          </div>

          {/* State line */}
          <div className="mt-6 min-h-[120px]" aria-live="polite">
            {phase === "idle" && !micError && (
              <p className="text-muted">
                {supported
                  ? "Tap the orb and speak — or try a sample phrase below."
                  : "Live mic needs Chrome or Edge — tap a sample phrase below to see the flow."}
              </p>
            )}
            {micError && phase === "idle" && (
              <p className="text-sm text-destructive">{micError}</p>
            )}

            {phase === "listening" && (
              <div>
                <div className="flex h-8 items-end justify-center gap-1" aria-hidden>
                  {[0.0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.2].map((d, i) => (
                    <span key={i} className="voice-bar h-8" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
                <p className="mt-3 font-medium text-foreground" lang={langCode}>
                  {transcript || "Listening…"}
                </p>
                <p className="mt-1 text-xs text-muted">Tap the orb again to stop</p>
              </div>
            )}

            {phase === "thinking" && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="ml-2 text-sm font-medium">Understanding…</span>
              </div>
            )}

            {phase === "confirm" && svcMeta && (
              <div className="animate-fade-up">
                <p className="text-sm text-muted">You said</p>
                <p className="mt-1 font-medium" lang={langCode}>“{transcript}”</p>
                <div className="glow-ring mx-auto mt-4 max-w-md rounded-2xl bg-surface p-4">
                  <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary" lang={langCode}>
                    <Volume2 className="h-4 w-4" aria-hidden />
                    {readbackText(lang, intent)}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {svcMeta.name}
                    {intent.slot ? ` · ${
                      { asap: "ASAP", "today-pm": "Today evening", "tom-am": "Tomorrow morning", "tom-pm": "Tomorrow evening" }[intent.slot]
                    }` : ""} · {svcMeta.pricing}
                  </p>
                </div>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                  >
                    Start over
                  </button>
                  <button
                    type="button"
                    onClick={continueBooking}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary glow-primary transition-transform hover:scale-105"
                  >
                    Continue booking <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Voice never books alone — you confirm every detail before anything is placed.
                </p>
              </div>
            )}

            {phase === "failed" && (
              <div className="animate-fade-up">
                <p className="text-sm text-muted">You said</p>
                <p className="mt-1 font-medium" lang={langCode}>“{transcript}”</p>
                <p className="mt-3 text-sm text-destructive" lang={langCode}>{notUnderstoodText(lang)}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Sample phrases — also the no-mic fallback (FR-28: never a dead end) */}
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Tap to try
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {SAMPLE_PHRASES[lang].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => process(p)}
                  lang={langCode}
                  className="rounded-full glass px-4 py-2 text-sm text-foreground/90 transition-all duration-200 hover:border-primary/50 hover:text-primary"
                >
                  “{p}”
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
