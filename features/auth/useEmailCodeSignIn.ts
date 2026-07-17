"use client";

// Shared email-code sign-in state machine — one source of truth for the
// booking wizard's SignInCard and the /login page, so send/verify behavior
// and error wording never drift between the two.

import { useEffect, useState } from "react";
import { sendSignInEmail, verifyEmailCode } from "@/lib/services/auth-service";

export type SignInPhase = "idle" | "sending" | "sent" | "verifying";

/** Reads a Supabase auth error from the URL hash (e.g. an expired magic
 *  link redirecting back) so the user gets words, not silence. */
export function authErrorFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  if (!params.get("error")) return null;
  if (params.get("error_code") === "otp_expired") {
    return "That sign-in link has expired or was already used — request a fresh one below.";
  }
  return params.get("error_description")?.replace(/\+/g, " ") ?? "Sign-in failed — request a fresh link below.";
}

/** Maps raw Supabase auth errors to words a customer can act on. */
export function friendlyAuthError(raw: string): string {
  if (/rate limit|too many|60 seconds|security purposes/i.test(raw)) {
    return "Too many sign-in emails just now — please wait a minute or two and try again.";
  }
  if (/invalid|expired/i.test(raw) && /token|otp|code/i.test(raw)) {
    return "That code didn't match or has expired — check the latest email and retry.";
  }
  return raw;
}

export function useEmailCodeSignIn(onBeforeSend?: () => void) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<SignInPhase>("idle");
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

  const setEmailInput = (v: string) => { setEmail(v); setError(null); };
  const setCodeInput = (v: string) => { setCode(v.replace(/\D/g, "")); setError(null); };

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
      // Auth store emits; the consuming component re-renders as signed-in.
    } catch (e) {
      setPhase("sent");
      setError(friendlyAuthError(e instanceof Error ? e.message : "Code didn't match. Check and retry."));
    }
  };

  const reset = () => { setPhase("idle"); setCode(""); };

  return { email, code, phase, error, setError, setEmailInput, setCodeInput, send, verify, reset };
}
