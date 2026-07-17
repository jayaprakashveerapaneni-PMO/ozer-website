"use client";

import { Mail, KeyRound, ArrowRight } from "lucide-react";
import GoogleButton from "./GoogleButton";
import { useEmailCodeSignIn } from "./useEmailCodeSignIn";

/** The /login sign-in card: Google OAuth first, emailed one-time code as the
 *  universal fallback. Pure client state — on success the auth store emits
 *  and LoginExperience swaps this card for the account panel. */
export default function LoginCard({ nextPath }: { nextPath: string }) {
  const s = useEmailCodeSignIn();

  return (
    <div
      className="glass animate-fade-up rounded-3xl p-6 shadow-xl sm:p-8"
      style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
    >
      <GoogleButton redirectPath={() => nextPath} onError={s.setError} />

      <div
        className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted"
        aria-hidden
      >
        <span className="h-px flex-1 bg-line" />
        or email me a code
        <span className="h-px flex-1 bg-line" />
      </div>

      {s.phase === "idle" || s.phase === "sending" ? (
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => { e.preventDefault(); void s.send(); }}
        >
          <label className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="email"
              required
              autoComplete="email"
              value={s.email}
              onChange={(e) => s.setEmailInput(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-2xl border border-line bg-surface py-3.5 pl-11 pr-4 text-base transition-colors focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={s.phase === "sending" || !s.email.includes("@")}
            className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {s.phase === "sending" ? "Sending…" : "Email me a sign-in code"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="text-center text-xs text-muted">
            No passwords, ever — a link and code land in your inbox.
          </p>
        </form>
      ) : (
        <div className="mt-5">
          <p className="rounded-2xl bg-success/10 p-3 text-sm font-medium text-success">
            Sent to {s.email}. Click the link in the email — or enter the sign-in code:
          </p>
          <div className="mt-3 flex gap-2">
            <label className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={s.code}
                onChange={(e) => s.setCodeInput(e.target.value)}
                placeholder="••••••"
                aria-label="Sign-in code"
                className="w-48 rounded-2xl border border-line bg-surface py-3 pl-10 pr-3 text-center font-display text-lg font-bold tracking-[0.3em] focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => void s.verify()}
              disabled={s.code.length < 6 || s.phase === "verifying"}
              className="flex-1 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {s.phase === "verifying" ? "Verifying…" : "Verify & continue"}
            </button>
          </div>
          <button
            type="button"
            onClick={s.reset}
            className="mt-2 text-xs font-semibold text-muted transition-colors hover:text-primary"
          >
            Use a different email
          </button>
        </div>
      )}

      {s.error && (
        <p className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
          {s.error}
        </p>
      )}
    </div>
  );
}
