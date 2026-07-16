// Razorpay browser client: loads checkout.js on demand, creates an order via
// our server route (which holds the secret), opens the Razorpay modal, and
// verifies the payment signature server-side before resolving.
//
// No SDK dependency — checkout.js is Razorpay's only supported browser entry,
// and orders/verification use their REST API from our API routes.

import type { PaymentIntent, PaymentRecord } from "./payment-service";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = CHECKOUT_SRC;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error("Could not load the payment gateway. Check your connection and retry."));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export async function payWithRazorpay(intent: PaymentIntent): Promise<PaymentRecord> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Payment gateway is not configured.");

  await loadCheckout();

  const orderRes = await fetch("/api/payments/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: intent.amount }),
  });
  if (!orderRes.ok) throw new Error("Could not start the payment. Please retry.");
  const { orderId } = (await orderRes.json()) as { orderId: string };

  return new Promise<PaymentRecord>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: keyId,
      order_id: orderId,
      name: "Ozer",
      description: intent.description,
      theme: { color: "#c2410c" },
      handler: (resp: RazorpayHandlerResponse) => {
        void fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: resp.razorpay_order_id,
            paymentId: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          }),
        })
          .then((v) => {
            if (!v.ok) throw new Error("Payment verification failed — contact support with your payment id.");
            resolve({
              paymentId: resp.razorpay_payment_id,
              method: null, // method chosen inside the Razorpay modal
              amount: intent.amount,
              provider: "razorpay",
            });
          })
          .catch(reject);
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
    });
    rzp.open();
  });
}
