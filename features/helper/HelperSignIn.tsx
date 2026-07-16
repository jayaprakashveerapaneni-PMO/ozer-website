"use client";

import { useState } from "react";
import { Phone, KeyRound, ShieldCheck, LogIn } from "lucide-react";
import { findHelperByLogin, signIn, HELPER_LOGINS } from "./helper-session";
import { HELPERS } from "@/lib/domain";

/** Phone + PIN gate for the helper portal (interim, pre phone-OTP auth). */
export default function HelperSignIn() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const helper = findHelperByLogin(phone, pin);
    if (!helper) {
      setError("Phone number and PIN don't match. Check and try again.");
      return;
    }
    setError(null);
    signIn(helper);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="glass animate-fade-up rounded-3xl p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Helper sign in</h1>
        <p className="mt-1 text-sm text-muted">
          Your jobs, your earnings, your hours — sign in with your registered
          phone number and 4-digit PIN.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
              <Phone className="h-3.5 w-3.5 text-primary" aria-hidden /> Phone number
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(null); }}
              placeholder="98490 10001"
              className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base font-semibold focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
              <KeyRound className="h-3.5 w-3.5 text-primary" aria-hidden /> PIN
            </span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(null); }}
              placeholder="••••"
              className="w-40 rounded-2xl border border-line bg-surface px-4 py-3 text-center font-display text-xl font-bold tracking-[0.4em] focus:border-primary focus:outline-none"
            />
          </label>
          {error && (
            <p className="rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pin.length !== 4 || phone.replace(/\D/g, "").length < 10}
            className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            <LogIn className="h-5 w-5" aria-hidden /> Sign in
          </button>
        </form>

        <details className="mt-6 rounded-2xl bg-surface p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-muted">
            Pilot roster access
          </summary>
          <p className="mt-2 text-xs text-muted">
            During the pilot, the verified roster signs in with these
            credentials (phone-OTP onboarding replaces this at launch):
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            {HELPERS.map((h) => (
              <li key={h.id} className="flex justify-between">
                <span className="font-semibold">{h.name}</span>
                <span className="text-muted">
                  {HELPER_LOGINS[h.id].phone} · PIN {HELPER_LOGINS[h.id].pin}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
