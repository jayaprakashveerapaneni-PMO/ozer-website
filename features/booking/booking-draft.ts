// Booking draft — preserves wizard state across the sign-in email round-trip
// (a magic link may open in a fresh tab; localStorage is shared per origin).

import type { ServiceId } from "@/lib/domain";
import type { ServiceDetails } from "./useServiceDetails";

const KEY = "ozer-booking-draft";
const MAX_AGE_MS = 30 * 60 * 1000;

export interface BookingDraft {
  service: ServiceId;
  details: ServiceDetails;
  zone: string;
  slotId: string | null;
  customDate: string;
  helperId: string | null;
  savedAt: number;
}

export function saveDraft(draft: Omit<BookingDraft, "savedAt">): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* storage unavailable — draft is best-effort */
  }
}

export function readDraft(): BookingDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as BookingDraft;
    if (!draft.service || Date.now() - draft.savedAt > MAX_AGE_MS) {
      clearDraft();
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
