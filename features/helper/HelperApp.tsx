"use client";

import { useState, useSyncExternalStore } from "react";
import { Bell, ShieldCheck, Star, GraduationCap, Wallet, LogOut, Moon, TrendingUp, BadgeCheck } from "lucide-react";
import { HELPERS, bookingEarnings } from "@/lib/domain";
import { useHelperPortal } from "./useHelperPortal";
import {
  getServerSessionSnapshot,
  getSessionHelperId,
  signOut,
  subscribeSession,
} from "./helper-session";
import ActiveJobCard from "./ActiveJobCard";
import OfferList from "./OfferList";
import HelperSignIn from "./HelperSignIn";

/** The helper app (FR-44, FR-46): sign in → offers, active job, earnings. */
export default function HelperApp() {
  const helperId = useSyncExternalStore(
    subscribeSession,
    getSessionHelperId,
    getServerSessionSnapshot
  );
  const helper = HELPERS.find((h) => h.id === helperId) ?? null;

  if (!helper) return <HelperSignIn />;
  return <HelperPortal key={helper.id} helperId={helper.id} />;
}

/** Rendered only client-side after sign-in, so localStorage init is safe. */
function HelperPortal({ helperId }: { helperId: string }) {
  const helper = HELPERS.find((h) => h.id === helperId)!;
  const portal = useHelperPortal(helper);
  const { wallet, toasts, offers, activeJob, completedJobs } = portal;

  const onlineKey = `ozer-helper-online-${helper.id}`;
  const [online, setOnline] = useState(() => localStorage.getItem(onlineKey) !== "0");
  const toggleOnline = () => {
    setOnline((v) => {
      localStorage.setItem(onlineKey, v ? "0" : "1");
      return !v;
    });
  };

  const todaysEarnings = completedJobs.reduce((sum, j) => sum + bookingEarnings(j), 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* toasts */}
      <div
        className="pointer-events-none fixed right-4 top-20 z-50 flex w-80 max-w-[90vw] flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {online &&
          toasts.map((t) => (
            <div key={t.id} className="glass glow-ring animate-fade-up flex items-center gap-3 rounded-2xl p-4">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Bell className="h-4 w-4 text-primary" aria-hidden />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary step-live" aria-hidden />
              </span>
              <p className="text-sm font-semibold">{t.text}</p>
            </div>
          ))}
      </div>

      {/* identity + availability */}
      <div className="glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold text-white"
              style={{ background: `hsl(${helper.hue} 65% 30%)` }}
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
                <Star className="h-3.5 w-3.5 fill-primary-soft text-primary" aria-hidden />
                {helper.rating} · {helper.jobs + completedJobs.length} jobs ·{" "}
                {helper.languages.join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={online}
              onClick={toggleOnline}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                online
                  ? "bg-success/15 text-success"
                  : "glass text-muted hover:text-foreground"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${online ? "bg-success step-live" : "bg-black/20"}`}
                aria-hidden
              />
              {online ? "Online — receiving offers" : "Offline"}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="glass inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-destructive"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </div>
        </div>

        {/* earnings strip */}
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Wallet</p>
            <p className="font-display text-xl font-bold text-success">
              ₹{wallet.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-muted">Withdraw anytime · min ₹100</p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Today</p>
            <p className="font-display text-xl font-bold text-foreground">
              ₹{todaysEarnings.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-muted">
              {completedJobs.length} {completedJobs.length === 1 ? "job" : "jobs"} completed
            </p>
          </div>
          <div className="rounded-2xl bg-surface px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Payouts</p>
            <p className="flex items-center justify-center gap-1 font-display text-xl font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-success" aria-hidden /> T+0
            </p>
            <p className="text-[10px] text-muted">Customer pays at booking</p>
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

      {online ? (
        <OfferList
          offers={offers}
          serviceLabel={helper.services.join(" or ")}
          onAccept={portal.accept}
          onDecline={portal.decline}
        />
      ) : (
        <div className="glass mt-6 rounded-3xl p-8 text-center">
          <Moon className="mx-auto h-8 w-8 text-muted" aria-hidden />
          <p className="mt-2 font-semibold">You&apos;re offline</p>
          <p className="mt-1 text-sm text-muted">
            New job offers are paused. Go online whenever you&apos;re ready to work —
            {offers.length > 0 && ` ${offers.length} matching job${offers.length > 1 ? "s are" : " is"} waiting right now —`}{" "}
            your rating and favourites are unaffected.
          </p>
        </div>
      )}

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
                <span className="flex items-center gap-1.5 font-display font-bold text-success">
                  {j.amountPaid != null && (
                    <BadgeCheck className="h-4 w-4" aria-label="Paid by customer at booking" />
                  )}
                  +₹{bookingEarnings(j).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-2xl bg-surface p-3 text-xs text-muted">
            Customers pay at booking, so completed jobs settle to your wallet
            immediately (T+0). Withdraw to your bank anytime from ₹100.
          </p>
        </div>
      )}
    </div>
  );
}
