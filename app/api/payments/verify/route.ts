// Verifies a Razorpay payment signature server-side (per Razorpay docs:
// HMAC-SHA256 of "order_id|payment_id" keyed by the key secret must equal
// the signature the checkout handler received). The booking is only created
// client-side after this returns ok.

import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return Response.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  let body: { orderId?: unknown; paymentId?: unknown; signature?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { orderId, paymentId, signature } = body;
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  const valid = a.length === b.length && timingSafeEqual(a, b);

  if (!valid) {
    console.warn(`payment signature mismatch for order ${orderId}`);
    return Response.json({ error: "Signature mismatch" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
