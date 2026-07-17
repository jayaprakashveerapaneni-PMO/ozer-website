"use client";

import { useEffect, useState } from "react";
import { Mail, KeyRound, ShieldCheck, ArrowRight } from "lucide-react";
import { sendSignInEmail, verifyEmailCode } from "@/lib/services/auth-service";

type Phase = "idle" | "sending" | "sent" | "verifying";

/** Inline customer sign-in: emails a magic link + one-time code. On success the
 *  auth store updates and the parent re-renders signed-in — no callback needed. */
/** Reads a Supabase auth error from the URL hash (e.g. an expired magic
 *  link redirecting back) so the user gets words, not silence. */
function authErrorFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.get("error")) return null;
  if (params.get("error_code") === "otp_expired") {
    return "That sign-in link has expired or was already used — request a fresh one below.";
  }
  return params.get("error_description")?.replace(/\+/g, " ") ?? "Sign-in failed — request a fresh link below.";
}

/** Maps raw Supabase auth errors to words a customer can act on. */
function friendlyAuthError(raw: string): string {
  if (/rate limit|too many|60 seconds|security purposes/i.test(raw)) {
    return "Too many sign-in emails just now — please wait a minute or two and try again.";
  }
  if (/invalid|expired/i.test(raw) && /token|otp|code/i.test(raw)) {
    return "That code didn't match or has expired — check the latest email and retry.";
  }
  return raw;
}

export default function SignInCard({
  title = "Sign in to pay & book",
  onBeforeSend,
}: {
  title?: string;
  /** Called right before the email is requested (e.g. save the booking draft). */
  onBeforeSend?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  // Hash is client-only — read after mount (async, so hydration stays clean).
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      const fromUrl = authErrorFromUrl();
      if (fromUrl) {
        setError(fromUrl);
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const send = async () => {
    setPhase("sending");
    setError(null);
    try {
      onBeforeSend?.();
      // Return to this exact page, flagged so the wizard restores the draft.
      const search = new URLSearchParams(window.location.search);
      search.set("resume", "1");
      await sendSignInEmail(email, `${window.location.pathname}?${search.toString()}`);
      setPhase("sent");
    } catch (e) {
      setPhase("idle");
      setError(friendlyAuthError(e instanceof Error ? e.message : "Could not send the email. Retry."));
    }
  };

  const verify = async () => {
    setPhase("verifying");
    setError(null);
    try {
      await verifyEmailCode(email, code);
      // Auth store emits; parent re-renders as signed-in.
    } catch (e) {
      setPhase("sent");
      setError(friendlyAuthError(e instanceof Error ? e.message : "Code didn't match. Check and retry."));
    }
  };

  return (
    <div className="glass animate-fade-up mt-6 rounded-3xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden /> {title}
      </h2>
      <p className="mt-1 text-sm text-muted">
        Your booking, receipt and live tracking are tied to your account. We&apos;ll
        email you a sign-in link and code — no password needed.
      </p>

      {phase === "idle" || phase === "sending" ? (
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); void send(); }}
        >
          <label className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-base focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={phase === "sending" || !email.includes("@")}
            className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {phase === "sending" ? "Sending…" : "Email sign-in link"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <p className="rounded-2xl bg-success/10 p-3 text-sm font-medium text-success">
            Sent to {email}. Click the link in the email — or enter the sign-in code:
          </p>
          <div className="mt-3 flex gap-2">
            <label className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(null); }}
                placeholder="••••••"
                aria-label="Sign-in code"
                className="w-48 rounded-2xl border border-line bg-surface py-3 pl-10 pr-3 text-center font-display text-lg font-bold tracking-[0.3em] focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => void verify()}
              disabled={code.length < 6 || phase === "verifying"}
              className="flex-1 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {phase === "verifying" ? "Verifying…" : "Verify & continue"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setPhase("idle"); setCode(""); }}
            className="mt-2 text-xs font-semibold text-muted transition-colors hover:text-primary"
          >
            Use a different email
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
