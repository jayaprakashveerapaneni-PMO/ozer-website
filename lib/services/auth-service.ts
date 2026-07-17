// Customer auth — Supabase email sign-in (magic link + one-time code, both
// verified server-side by Supabase). Exposed as a subscribe/snapshot pair so
// components consume it with useSyncExternalStore (SSR-safe: server sees
// signed-out). Phone-OTP replaces email once an SMS provider is configured.

import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase-client";

let currentUser: User | null = null;
let started = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((cb) => cb());
}

function start(): void {
  if (started) return;
  started = true;
  const client = getSupabaseClient();
  if (!client) return;
  void client.auth.getSession().then(({ data }) => {
    currentUser = data.session?.user ?? null;
    emit();
  });
  client.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    emit();
  });
}

export function subscribeAuth(cb: () => void): () => void {
  start();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getAuthUser(): User | null {
  return currentUser;
}

export function getServerAuthSnapshot(): null {
  return null;
}

/** Auth errors arrive with empty bodies ("{}") on rate limits — translate
 *  status codes and junk messages into words a customer can act on. */
function toFriendlyAuthError(error: { message?: string; status?: number }): Error {
  const msg = error.message && error.message.trim() !== "{}" ? error.message : "";
  if (
    error.status === 429 ||
    /rate limit|too many|60 seconds|security purposes/i.test(msg)
  ) {
    return new Error(
      "The email service has hit its hourly limit — please wait a few minutes and try once more."
    );
  }
  return new Error(msg || "Could not send the email right now. Please retry in a minute.");
}

/** Email a sign-in link (and code, if the template includes it). */
export async function sendSignInEmail(email: string, redirectPath = "/book"): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Accounts are unavailable — backend not configured.");
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${redirectPath}` },
  });
  if (error) throw toFriendlyAuthError(error);
}

/** Verify the one-time code from the sign-in email (6 digits via custom SMTP, 8 via Supabase's built-in mailer). */
export async function verifyEmailCode(email: string, code: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Accounts are unavailable — backend not configured.");
  const { error } = await client.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) throw toFriendlyAuthError(error);
}

const GOOGLE_DISABLED_MSG =
  "Google sign-in isn't switched on for this project yet — use the email code instead.";

/** Start Google OAuth. On success the browser navigates to Google and returns
 *  signed in at `redirectPath`; this promise only rejects, it never resolves
 *  into a signed-in state in-place. */
export async function signInWithGoogle(redirectPath = "/book"): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Accounts are unavailable — backend not configured.");
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    // Don't auto-redirect: a misconfigured provider would land the customer on
    // a raw JSON error page. Preflight the authorize URL first.
    options: { redirectTo: `${window.location.origin}${redirectPath}`, skipBrowserRedirect: true },
  });
  if (error) {
    if (/not enabled|unsupported provider/i.test(error.message ?? "")) throw new Error(GOOGLE_DISABLED_MSG);
    throw toFriendlyAuthError(error);
  }
  if (!data?.url) throw new Error(GOOGLE_DISABLED_MSG);
  try {
    // Enabled provider → 302 to Google (opaqueredirect); disabled → 400 JSON.
    const probe = await fetch(data.url, { redirect: "manual" });
    if (probe.status === 400) throw new Error(GOOGLE_DISABLED_MSG);
  } catch (e) {
    if (e instanceof Error && e.message === GOOGLE_DISABLED_MSG) throw e;
    // Network/CORS opacity — fall through and let the real navigation decide.
  }
  window.location.assign(data.url);
}

export async function signOutUser(): Promise<void> {
  await getSupabaseClient()?.auth.signOut();
}

/** Display name for a signed-in customer. */
export function customerNameFromUser(u: Pick<User, "email" | "user_metadata">): string {
  const meta = (u.user_metadata?.full_name ?? u.user_metadata?.name) as string | undefined;
  if (meta && meta.trim()) return meta.trim();
  const prefix = u.email?.split("@")[0] ?? "";
  if (!prefix) return "Customer";
  return prefix
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
