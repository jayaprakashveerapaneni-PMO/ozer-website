"use client";

import { useState } from "react";
import { Zap, MapPin, Navigation, KeyRound, Play, CheckCircle2 } from "lucide-react";
import { bookingEarnings, statusIndex, type Booking, type BookingStatus } from "@/lib/domain";

const PROGRESS: BookingStatus[] = ["assigned", "en_route", "arrived", "in_progress", "completed"];

export default function ActiveJobCard({
  job,
  onStartJourney,
  onVerifyOtp,
  onStartJob,
  onComplete,
}: {
  job: Booking;
  onStartJourney: () => void;
  onVerifyOtp: (otp: string) => Promise<boolean>;
  onStartJob: () => void;
  onComplete: () => void;
}) {
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);

  const verify = async () => {
    const ok = await onVerifyOtp(otpInput);
    setOtpError(!ok);
    if (ok) setOtpInput("");
  };

  return (
    <div className="glass glow-ring animate-fade-up mt-6 rounded-3xl p-6">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <Zap className="h-3.5 w-3.5" aria-hidden /> Active job
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold">{job.serviceName}</p>
          <p className="mt-0.5 text-sm text-muted">
            {job.detailLabel} · {job.slotLabel}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {job.zone}, Hyderabad ·{" "}
            {job.customerName}
          </p>
        </div>
        <p className="font-display text-xl font-bold text-success">
          ₹{bookingEarnings(job).toLocaleString("en-IN")}
        </p>
      </div>

      <ol className="mt-5 flex items-center gap-1.5" aria-label="Job progress">
        {PROGRESS.map((s) => (
          <li
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              statusIndex(job.status) >= statusIndex(s) ? "bg-success" : "bg-black/10"
            }`}
          />
        ))}
      </ol>

      <div className="mt-5">
        {job.status === "assigned" && (
          <button
            type="button"
            onClick={onStartJourney}
            className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
          >
            <Navigation className="h-5 w-5" aria-hidden /> Start journey
          </button>
        )}

        {job.status === "en_route" && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted">
              <KeyRound className="h-4 w-4 text-primary" aria-hidden />
              Ask the customer for their 4-digit arrival OTP (shown on their booking screen)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value.replace(/\D/g, ""));
                  setOtpError(false);
                }}
                placeholder="••••"
                aria-label="Arrival OTP"
                className={`w-32 rounded-2xl border bg-surface px-4 py-3 text-center font-display text-xl font-bold tracking-[0.4em] text-foreground ${
                  otpError ? "border-destructive" : "border-line focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => void verify()}
                disabled={otpInput.length !== 4}
                className="flex-1 rounded-2xl bg-primary px-6 py-3 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-40"
              >
                Verify arrival
              </button>
            </div>
            {otpError && (
              <p className="mt-2 text-sm text-destructive" role="alert">
                OTP mismatch — job start blocked (substitute-person protection). Try again.
              </p>
            )}
          </div>
        )}

        {job.status === "arrived" && (
          <button
            type="button"
            onClick={onStartJob}
            className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02]"
          >
            <Play className="h-5 w-5" aria-hidden /> Start job
          </button>
        )}

        {job.status === "in_progress" && (
          <button
            type="button"
            onClick={onComplete}
            className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-success px-6 py-4 text-base font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ boxShadow: "0 8px 28px rgba(5, 150, 105, 0.3)" }}
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden /> Mark done — collect payment
          </button>
        )}
      </div>
    </div>
  );
}
