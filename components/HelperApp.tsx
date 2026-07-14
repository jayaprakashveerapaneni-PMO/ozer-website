"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ShieldCheck,
  Wallet,
  MapPin,
  Navigation,
  KeyRound,
  Play,
  CheckCircle2,
  X,
  Zap,
  Star,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { HELPERS, type Helper } from "@/lib/data";
import {
  getBookings,
  updateBooking,
  subscribe,
  getWallet,
  creditWallet,
  statusIndex,
  type Booking,
} from "@/lib/store";

type Toast = { id: number; text: string };

export default function HelperApp() {
  const [helper, setHelper] = useState<Helper>(HELPERS[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const knownOffers = useRef<Set<string>>(new Set());
  const toastId = useRef(0);

  const refresh = useCallback(() => {
    setBookings(getBookings());
    setWallet(getWallet(helper.id));
  }, [helper.id]);

  useEffect(() => {
    refresh();
    return subscribe(refresh);
  }, [refresh]);

  // Toast when a NEW offer appears for this helper
  const offers = bookings.filter(
    (b) =>
      b.status === "pending_offer" &&
      helper.services.includes(b.service) &&
      (b.service !== "care" || helper.certified) &&
      !b.declinedBy.includes(helper.id)
  );

  useEffect(() => {
    offers.forEach((o) => {
      if (!knownOffers.current.has(o.id)) {
        knownOffers.current.add(o.id);
        const id = ++toastId.current;
        setToasts((t) => [...t, { id, text: `New job nearby: ${o.serviceName} · ${o.zone}` }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
      }
    });
  }, [offers]);

  const activeJob = bookings.find(
    (b) => b.helperId === helper.id && b.status !== "completed" && b.status !== "pending_offer"
  );
  const completedJobs = bookings.filter((b) => b.helperId === helper.id && b.status === "completed");

  const accept = (b: Booking) => {
    updateBooking(b.id, { status: "assigned", helperId: helper.id, helperName: helper.name });
    setOtpInput("");
    setOtpError(false);
  };
  const decline = (b: Booking) => {
    updateBooking(b.id, { declinedBy: [...b.declinedBy, helper.id] });
  };
  const startJourney = (b: Booking) => updateBooking(b.id, { status: "en_route" });
  const verifyOtp = (b: Booking) => {
    if (otpInput === b.otp) {
      updateBooking(b.id, { status: "arrived" });
      setOtpError(false);
      setOtpInput("");
    } else {
      setOtpError(true);
    }
  };
  const startJob = (b: Booking) => updateBooking(b.id, { status: "in_progress" });
  const complete = (b: Booking) => {
    updateBooking(b.id, { status: "completed" });
    const amount = Math.round((b.estLow + b.estHigh) / 2);
    setWallet(creditWallet(helper.id, amount));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* toasts */}
      <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-80 max-w-[90vw] flex-col gap-2">
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

      {/* header: helper identity switcher */}
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
                {helper.certified && <GraduationCap className="h-4 w-4 text-accent" aria-label="Care certified" />}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Star className="h-3.5 w-3.5 fill-primary-soft text-primary-soft" aria-hidden />
                {helper.rating} · {helper.jobs + completedJobs.length} jobs · {helper.languages.join(", ")}
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
                onClick={() => { setHelper(h); knownOffers.current.clear(); }}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  helper.id === h.id ? "bg-primary text-on-primary glow-primary" : "glass text-muted hover:text-foreground"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE JOB */}
      {activeJob && (
        <div className="glass glow-ring animate-fade-up mt-6 rounded-3xl p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-soft">
            <Zap className="h-3.5 w-3.5" aria-hidden /> Active job
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold">{activeJob.serviceName}</p>
              <p className="mt-0.5 text-sm text-muted">
                {activeJob.detailLabel} · {activeJob.slotLabel}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {activeJob.zone}, Hyderabad · {activeJob.customerName}
              </p>
            </div>
            <p className="font-display text-xl font-bold text-success">
              ₹{Math.round((activeJob.estLow + activeJob.estHigh) / 2).toLocaleString("en-IN")}
            </p>
          </div>

          {/* progress */}
          <ol className="mt-5 flex items-center gap-1.5" aria-label="Job progress">
            {["assigned", "en_route", "arrived", "in_progress", "completed"].map((s) => (
              <li
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  statusIndex(activeJob.status) >= statusIndex(s as Booking["status"])
                    ? "bg-success"
                    : "bg-black/10"
                }`}
              />
            ))}
          </ol>

          <div className="mt-5">
            {activeJob.status === "assigned" && (
              <button
                type="button"
                onClick={() => startJourney(activeJob)}
                className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
              >
                <Navigation className="h-5 w-5" aria-hidden /> Start journey
              </button>
            )}
            {activeJob.status === "en_route" && (
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
                  <KeyRound className="h-4 w-4 text-primary-soft" aria-hidden />
                  Ask the customer for their 4-digit arrival OTP (shown on their booking screen)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(false); }}
                    placeholder="••••"
                    aria-label="Arrival OTP"
                    className={`w-32 rounded-2xl border bg-surface px-4 py-3 text-center font-display text-xl font-bold tracking-[0.4em] text-foreground ${
                      otpError ? "border-destructive" : "border-line focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => verifyOtp(activeJob)}
                    disabled={otpInput.length !== 4}
                    className="flex-1 rounded-2xl bg-primary px-6 py-3 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-40"
                  >
                    Verify arrival
                  </button>
                </div>
                {otpError && (
                  <p className="mt-2 text-sm text-destructive">
                    OTP mismatch — job start blocked (substitute-person protection). Try again.
                  </p>
                )}
              </div>
            )}
            {activeJob.status === "arrived" && (
              <button
                type="button"
                onClick={() => startJob(activeJob)}
                className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
              >
                <Play className="h-5 w-5" aria-hidden /> Start job
              </button>
            )}
            {activeJob.status === "in_progress" && (
              <button
                type="button"
                onClick={() => complete(activeJob)}
                className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-success px-6 py-4 text-base font-bold text-on-primary transition-transform hover:scale-[1.02]"
                style={{ boxShadow: "0 0 28px rgba(52, 211, 153, 0.35)" }}
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden /> Mark done — collect payment
              </button>
            )}
          </div>
        </div>
      )}

      {/* JOB OFFERS */}
      <div className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Bell className="h-5 w-5 text-primary-soft" aria-hidden />
          Job offers
          {offers.length > 0 && (
            <span className="step-live rounded-full bg-primary px-2.5 py-0.5 font-display text-xs font-bold text-on-primary">
              {offers.length}
            </span>
          )}
        </h2>

        {offers.length === 0 ? (
          <div className="glass mt-4 rounded-3xl p-8 text-center">
            <p className="font-semibold">No offers right now</p>
            <p className="mt-1 text-sm text-muted">
              Offers appear here the moment a customer books a {helper.services.join(" or ")} job.
              Try it yourself — open the customer app and book one.
            </p>
            <Link
              href="/book"
              target="_blank"
              className="btn-shine mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary glow-primary transition-transform hover:scale-105"
            >
              Open customer app <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="mt-2 text-xs text-muted">
              Tip: keep both tabs open side by side — the offer lands here instantly.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {offers.map((o) => (
              <div key={o.id} className="glass glow-ring animate-fade-up rounded-3xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-display text-lg font-semibold">
                      {o.serviceName}
                      {o.via === "voice" && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">VOICE BOOKING</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{o.detailLabel} · {o.slotLabel}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="h-3.5 w-3.5" aria-hidden /> {o.zone}, Hyderabad · {o.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">You earn</p>
                    <p className="font-display text-2xl font-bold text-success">
                      ₹{Math.round((o.estLow + o.estHigh) / 2).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => accept(o)}
                    className="btn-shine flex-1 rounded-2xl bg-primary px-5 py-3.5 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
                  >
                    Accept job
                  </button>
                  <button
                    type="button"
                    onClick={() => decline(o)}
                    className="glass inline-flex items-center gap-1.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-muted transition-colors hover:text-destructive"
                  >
                    <X className="h-4 w-4" aria-hidden /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EARNINGS */}
      {completedJobs.length > 0 && (
        <div className="glass mt-6 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Wallet className="h-5 w-5 text-success" aria-hidden /> Today&apos;s completed jobs
          </h2>
          <ul className="mt-3 divide-y divide-line">
            {completedJobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted">{j.serviceName} · {j.zone} · {j.id}</span>
                <span className="font-display font-bold text-success">
                  +₹{Math.round((j.estLow + j.estHigh) / 2).toLocaleString("en-IN")}
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
