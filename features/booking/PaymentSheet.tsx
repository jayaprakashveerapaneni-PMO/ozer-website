"use client";

import { useEffect, useState } from "react";
import { Smartphone, CreditCard, Landmark, Lock, CheckCircle2, X, ShieldCheck } from "lucide-react";
import type { PaymentMethod } from "@/lib/domain";
import {
  getPaymentMode,
  mintBuiltinPayment,
  type PaymentRecord,
} from "@/lib/services/payment-service";
import { payWithRazorpay } from "@/lib/services/razorpay-client";

const METHODS: { id: PaymentMethod; label: string; icon: typeof Smartphone; sub: string }[] = [
  { id: "upi", label: "UPI", icon: Smartphone, sub: "GPay · PhonePe · Paytm" },
  { id: "card", label: "Card", icon: CreditCard, sub: "Credit or debit" },
  { id: "netbanking", label: "NetBanking", icon: Landmark, sub: "All major banks" },
];

type Status = "idle" | "processing" | "success" | "error";

/** Payment-first checkout sheet: no booking exists until this succeeds. */
export default function PaymentSheet({
  amount,
  description,
  onPaid,
  onClose,
}: {
  amount: number;
  description: string;
  onPaid: (rec: PaymentRecord) => void;
  onClose: () => void;
}) {
  const mode = getPaymentMode();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const busy = status === "processing" || status === "success";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "processing" && status !== "success") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, onClose]);

  const payBuiltin = () => {
    setStatus("processing");
    setError(null);
    // Sandbox settlement: resolves locally, clearly labelled below.
    window.setTimeout(() => {
      const rec = mintBuiltinPayment(method, amount);
      setStatus("success");
      window.setTimeout(() => onPaid(rec), 700);
    }, 1400);
  };

  const payGateway = async () => {
    setStatus("processing");
    setError(null);
    try {
      const rec = await payWithRazorpay({ amount, description });
      setStatus("success");
      window.setTimeout(() => onPaid(rec), 700);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Payment failed. Please retry.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Secure payment"
        className="animate-fade-up w-full max-w-md rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Lock className="h-4 w-4 text-primary" aria-hidden /> Secure payment
            </h2>
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          </div>
          <button
            type="button"
            aria-label="Close payment"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-2 text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-surface p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">To pay now</p>
          <p className="mt-1 font-display text-4xl font-bold text-primary">
            ₹{amount.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted">Fixed price · covered by the money-back promise</p>
        </div>

        {status === "success" ? (
          <div className="animate-fade-up mt-6 rounded-2xl bg-success/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden />
            <p className="mt-2 font-semibold text-success">Payment received</p>
            <p className="mt-0.5 text-xs text-muted">Placing your booking…</p>
          </div>
        ) : mode === "builtin" ? (
          <>
            <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={method === m.id}
                  disabled={busy}
                  onClick={() => setMethod(m.id)}
                  className={`rounded-2xl border p-3 text-center transition-all duration-200 ${
                    method === m.id
                      ? "border-primary bg-primary/10"
                      : "border-line bg-white/50 hover:bg-white/90"
                  }`}
                >
                  <m.icon className={`mx-auto h-5 w-5 ${method === m.id ? "text-primary" : "text-muted"}`} aria-hidden />
                  <span className="mt-1 block text-xs font-bold">{m.label}</span>
                  <span className="block text-[10px] text-muted">{m.sub}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={payBuiltin}
              disabled={busy}
              autoFocus
              className="btn-shine mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "processing" ? "Processing payment…" : `Pay ₹${amount.toLocaleString("en-IN")}`}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">
              Sandbox payment — no money moves until the payment gateway goes live.
            </p>
          </>
        ) : (
          <>
            {error && (
              <p className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => void payGateway()}
              disabled={busy}
              autoFocus
              className="btn-shine mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 text-base font-bold text-on-primary glow-primary transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "processing" ? "Opening secure checkout…" : "Continue to secure checkout"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />
              UPI, cards & netbanking via Razorpay — verified server-side.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
