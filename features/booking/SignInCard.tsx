"use client";

import { Mail, KeyRound, ShieldCheck, ArrowRight } from "lucide-react";
import GoogleButton from "@/features/auth/GoogleButton";
import { useEmailCodeSignIn } from "@/features/auth/useEmailCodeSignIn";

/** Inline customer sign-in: Google OAuth or an emailed magic link + one-time
 *  code. On success the auth store updates and the parent re-renders
 *  signed-in — no callback needed. */
export default function SignInCard({
  title = "Sign in to pay & book",
  onBeforeSend,
}: {
  title?: string;
  /** Called right before the email is requested (e.g. save the booking draft). */
  onBeforeSend?: () => void;
}) {
  const s = useEmailCodeSignIn(onBeforeSend);

  /** Google returns to this exact page, flagged so the wizard restores the draft. */
  const googleReturnPath = () => {
    const search = new URLSearchParams(window.location.search);
    search.set("resume", "1");
    return `${window.location.pathname}?${search.toString()}`;
  };

  return (
    <div className="glass animate-fade-up mt-6 rounded-3xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden /> {title}
      </h2>
      <p className="mt-1 text-sm text-muted">
        Your booking, receipt and live tracking are tied to your account. Continue
        with Google, or get a sign-in link and code by email — no password needed.
      </p>

      {s.phase === "idle" || s.phase === "sending" ? (
        <div className="mt-4">
          <GoogleButton
            redirectPath={googleReturnPath}
            onBeforeRedirect={onBeforeSend}
            onError={s.setError}
          />
          <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted" aria-hidden>
            <span className="h-px flex-1 bg-line" />
            or email me a code
            <span className="h-px flex-1 bg-line" />
          </div>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => { e.preventDefault(); void s.send(); }}
          >
            <label className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="email"
                required
                autoComplete="email"
                value={s.email}
                onChange={(e) => s.setEmailInput(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-base focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={s.phase === "sending" || !s.email.includes("@")}
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {s.phase === "sending" ? "Sending…" : "Email sign-in link"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4">
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
        <p className="mt-3 rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
          {s.error}
        </p>
      )}
    </div>
  );
}
