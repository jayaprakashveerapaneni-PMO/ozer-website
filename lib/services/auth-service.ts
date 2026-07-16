// Customer auth — Supabase email sign-in (magic link + 6-digit code, both
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

/** Email a sign-in link (and code, if the template includes it). */
export async function sendSignInEmail(email: string, redirectPath = "/book"): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Accounts are unavailable — backend not configured.");
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${redirectPath}` },
  });
  if (error) throw new Error(error.message);
}

/** Verify the 6-digit code from the sign-in email. */
export async function verifyEmailCode(email: string, code: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Accounts are unavailable — backend not configured.");
  const { error } = await client.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) throw new Error(error.message);
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
