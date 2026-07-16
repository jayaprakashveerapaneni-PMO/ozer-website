// PaymentService — the seam between the booking UI and money movement.
//
// Payment is FIRST-CLASS and FIRST-IN-FLOW: a booking is only ever created
// after a payment record exists (TR-20). Two providers:
//   • razorpay — real gateway. Active when NEXT_PUBLIC_RAZORPAY_KEY_ID is set
//     (plus RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET server-side for the API routes).
//   • builtin  — sandbox processor used until gateway keys are configured.
//     It is clearly labelled in the UI; no money moves.
//
// UI code depends only on these types + payWithRazorpay/mintBuiltinPayment.

import type { PaymentMethod } from "@/lib/domain/types";

export interface PaymentIntent {
  /** Rupees (not paise). */
  amount: number;
  description: string;
}

export interface PaymentRecord {
  paymentId: string;
  /** Null when the gateway owns method selection (Razorpay modal). */
  method: PaymentMethod | null;
  amount: number;
  provider: "razorpay" | "builtin";
}

export type PaymentMode = "razorpay" | "builtin";

export function getPaymentMode(): PaymentMode {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "razorpay" : "builtin";
}

/** Time-ordered, collision-resistant sandbox payment id. */
export function generatePaymentId(now: number = Date.now()): string {
  const time = now.toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PAY-${time}${rand}`;
}

/** Mint a sandbox payment record (builtin provider only). */
export function mintBuiltinPayment(method: PaymentMethod, amount: number): PaymentRecord {
  return { paymentId: generatePaymentId(), method, amount, provider: "builtin" };
}
