// Creates a Razorpay order server-side (the key secret never reaches the
// browser). Returns 503 until RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET are set —
// the client uses the builtin sandbox provider in that case and never calls
// this route.

const MAX_AMOUNT_INR = 50_000;

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return Response.json({ error: "Payment gateway not configured" }, { status: 503 });
  }

  let amount: unknown;
  try {
    ({ amount } = (await req.json()) as { amount?: unknown });
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT_INR) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `ozer-${Date.now()}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`razorpay order failed (${res.status}): ${detail}`);
    return Response.json({ error: "Gateway order failed" }, { status: 502 });
  }

  const order = (await res.json()) as { id: string };
  return Response.json({ orderId: order.id });
}
