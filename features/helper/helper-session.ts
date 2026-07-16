// Helper sign-in session — interim identity until Supabase phone-OTP auth
// lands (next sprint). Credentials cover the pilot helper roster only; the
// session lives in localStorage and is exposed via a subscribe/snapshot pair
// so components can consume it with useSyncExternalStore (SSR-safe).

import { HELPERS, type Helper } from "@/lib/domain";

const KEY = "ozer-helper-session";
const EVT = "ozer-helper-session";

/** Pilot roster credentials (mock supply). Replaced by phone-OTP onboarding. */
export const HELPER_LOGINS: Record<string, { phone: string; pin: string }> = {
  h1: { phone: "98490 10001", pin: "1111" },
  h2: { phone: "98490 10002", pin: "2222" },
  h3: { phone: "98490 10003", pin: "3333" },
  h4: { phone: "98490 10004", pin: "4444" },
  h5: { phone: "98490 10005", pin: "5555" },
  h6: { phone: "98490 10006", pin: "6666" },
};

function normalizePhone(p: string): string {
  return p.replace(/\D/g, "").slice(-10);
}

/** Pure credential check — returns the helper on a phone+PIN match. */
export function findHelperByLogin(phone: string, pin: string): Helper | null {
  const target = normalizePhone(phone);
  if (target.length !== 10) return null;
  for (const [id, cred] of Object.entries(HELPER_LOGINS)) {
    if (normalizePhone(cred.phone) === target && cred.pin === pin) {
      return HELPERS.find((h) => h.id === id) ?? null;
    }
  }
  return null;
}

export function getSessionHelperId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function getServerSessionSnapshot(): null {
  return null;
}

export function subscribeSession(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}

export function signIn(helper: Helper): void {
  window.localStorage.setItem(KEY, helper.id);
  window.dispatchEvent(new Event(EVT));
}

export function signOut(): void {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}
