// Web Speech API wrappers: speech recognition (ASR) and synthesis (TTS).
// Browser-only; callers handle null recognition (unsupported browsers).

import type { VoiceLang } from "./responses";

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function recognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
}

/** True when the browser exposes SpeechRecognition (no instance created). */
export function isRecognitionSupported(): boolean {
  return recognitionCtor() !== undefined;
}

export function getRecognition(): SpeechRecognitionLike | null {
  const Ctor = recognitionCtor();
  return Ctor ? new Ctor() : null;
}

export function speak(text: string, lang: VoiceLang): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => v.lang === lang) ??
      voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (match) u.voice = match;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // TTS is progressive enhancement — the on-screen summary is authoritative (FR-27)
  }
}
