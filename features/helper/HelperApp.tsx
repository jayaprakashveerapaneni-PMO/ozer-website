"use client";

import { Bell, ShieldCheck, Star, GraduationCap, Wallet } from "lucide-react";
import { HELPERS, bookingEarnings } from "@/lib/domain";
import { useHelperPortal } from "./useHelperPortal";
import ActiveJobCard from "./ActiveJobCard";
import OfferList from "./OfferList";

/** The helper portal (FR-44, FR-46): offers, active job, wallet, earnings. */
export default function HelperApp() {
  const portal = useHelperPortal();
  const { helper, wallet, toasts, offers, activeJob, completedJobs } = portal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* toasts */}
      <div
        className="pointer-events-none fixed right-4 top-20 z-50 flex w-80 max-w-[90vw] flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div key={t.id} className="glass glow-ring animate-fade-up flex items-center gap-3 rounded-2xl p-4">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <Bell className="h-4 w-4 text-primary-soft" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary step-live" aria-hidden />
            </span>
            <p className="text-sm font-semibold">{t.text}</p>
          </div>
        ))}
      </div>

      {/* identity + wallet + switcher */}
      <div className="glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold text-white"
              style={{ background: `hsl(${helper.hue} 70% 45%)` }}
              aria-hidden
            >
              {helper.initials}
            </span>
            <div>
              <p className="flex items-center gap-1.5 font-display text-lg font-semibold">
                {helper.name}
                <ShieldCheck className="h-4 w-4 text-success" aria-label="Verified" />
                {helper.certified && (
                  <GraduationCap className="h-4 w-4 text-accent" aria-label="Care certified" />
                )}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Star className="h-3.5 w-3.5 fill-primary-soft text-primary-soft" aria-hidden />
                {helper.rating} · {helper.jobs + completedJobs.length} jobs ·{" "}
                {helper.languages.join(", ")}
              </p>
            </div>
          </div>
          <div className="glow-ring rounded-2xl bg-surface px-5 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Wallet</p>
            <p className="font-display text-2xl font-bold text-success">
              ₹{wallet.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-muted">Withdraw anytime · min ₹100</p>
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
            Viewing as
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose helper">
            {HELPERS.slice(0, 4).map((h) => (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={helper.id === h.id}
                onClick={() => portal.switchHelper(h)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  helper.id === h.id
                    ? "bg-primary text-on-primary glow-primary"
                    : "glass text-muted hover:text-foreground"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeJob && (
        <ActiveJobCard
          job={activeJob}
          onStartJourney={() => portal.startJourney(activeJob)}
          onVerifyOtp={(otp) => portal.verifyOtp(activeJob, otp)}
          onStartJob={() => portal.startJob(activeJob)}
          onComplete={() => void portal.complete(activeJob)}
        />
      )}

      <OfferList
        offers={offers}
        serviceLabel={helper.services.join(" or ")}
        onAccept={portal.accept}
        onDecline={portal.decline}
      />

      {completedJobs.length > 0 && (
        <div className="glass mt-6 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Wallet className="h-5 w-5 text-success" aria-hidden /> Today&apos;s completed jobs
          </h2>
          <ul className="mt-3 divide-y divide-line">
            {completedJobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted">
                  {j.serviceName} · {j.zone} · {j.id}
                </span>
                <span className="font-display font-bold text-success">
                  +₹{bookingEarnings(j).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-2xl bg-surface p-3 text-xs text-muted">
            Payouts batch daily (T+0) — withdraw to your bank anytime from ₹100.
          </p>
        </div>
      )}
    </div>
  );
}
