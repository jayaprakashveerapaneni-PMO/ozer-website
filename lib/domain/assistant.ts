// Voice-assistant domain logic (EP-14). Pure and unit-tested — no IO.
//
// FR-27 / AI-7 guardrail: a voice assistant NEVER books alone. It may only
// create a DRAFT; the customer confirms & pays on the website (payment-first,
// TR-20). Every speech string here must keep that promise explicit.

import type { ServiceId } from "./types";
import { SERVICES, ZONES } from "./catalog";
import { estimate, type Estimate } from "./estimator";

export type AssistantSource = "alexa" | "siri";

export interface AssistantDraft {
  id: string;
  linkCode: string;
  source: AssistantSource;
  service: ServiceId;
  hours: number | null;
  zone: string;
  slotLabel: string;
  status: "open" | "consumed";
  createdAt: number;
  updatedAt: number;
}

/** What an assistant heard, before validation. */
export interface AssistantIntent {
  service?: string | null;
  hours?: number | string | null;
  zone?: string | null;
  slot?: string | null;
}

// Spoken names an assistant may hand us for each service (English + common
// Hyderabad Hindi/Telugu transliterations). Matching is substring-based on
// the normalized utterance, so "house cleaning" and "clean my house" work.
const SERVICE_SYNONYMS: Record<ServiceId, string[]> = {
  cleaning: ["cleaning", "clean", "maid", "safai", "bathroom", "mopping", "sweeping"],
  cook: ["cook", "cooking", "meal", "meals", "food", "khana", "vanta", "tiffin", "chef"],
  laundry: ["laundry", "washing", "wash", "ironing", "iron", "istri", "clothes"],
  care: ["care", "caretaker", "caregiver", "babysit", "babysitter", "nanny", "ayah", "elder", "child care"],
};

const normalize = (s: string): string => s.toLowerCase().trim();

/** Map a spoken service phrase to a catalog service, or null if unclear. */
export function matchService(text: string | null | undefined): ServiceId | null {
  if (!text) return null;
  const t = normalize(text);
  for (const svc of SERVICES) {
    if (t.includes(normalize(svc.name))) return svc.id;
  }
  for (const [id, synonyms] of Object.entries(SERVICE_SYNONYMS) as [ServiceId, string[]][]) {
    if (synonyms.some((syn) => t.includes(syn))) return id;
  }
  return null;
}

/** Map a spoken area to a serviceable zone; defaults to the first zone
 *  (Madhapur) when unspecified — the customer can change it at confirm time. */
export function matchZone(text: string | null | undefined): string {
  if (!text) return ZONES[0];
  const t = normalize(text);
  return ZONES.find((z) => t.includes(normalize(z))) ?? ZONES[0];
}

/** Clamp spoken hours to the bookable range; null when not given (the
 *  service's default applies at confirm time). */
export function clampSpokenHours(value: number | string | null | undefined): number | null {
  const n = typeof value === "string" ? parseInt(value, 10) : value;
  if (n == null || Number.isNaN(n)) return null;
  return Math.min(Math.max(Math.round(n), 1), 12);
}

/** Estimate band for a draft — hours only apply where the service is hourly. */
export function draftEstimate(service: ServiceId, hours: number | null): Estimate {
  return estimate({
    service,
    hours: hours ?? undefined,
    careHours: hours ?? undefined,
  });
}

/** The confirmation an assistant speaks after creating a draft. Must always
 *  send the customer to the website to pay (FR-27). */
export function draftSpeech(service: ServiceId, hours: number | null, zone: string): string {
  const name = SERVICES.find((s) => s.id === service)?.name ?? service;
  const est = draftEstimate(service, hours);
  const band =
    est.low === est.high
      ? `${est.low} rupees`
      : `${est.low} to ${est.high} rupees`;
  return (
    `I've started a ${name} booking in ${zone}, estimated at ${band}. ` +
    `To keep your money safe, voice never completes a booking — open Ozer on the web, ` +
    `and it's waiting on your account to confirm and pay.`
  );
}

/** 6-digit speakable pairing code (never starts with 0 so it reads naturally).
 *  `random` is injectable for tests. */
export function makePairingCode(random: () => number = Math.random): string {
  const first = 1 + Math.floor(random() * 9);
  let rest = "";
  for (let i = 0; i < 5; i++) rest += Math.floor(random() * 10);
  return `${first}${rest}`;
}

/** Draft ids are visibly distinct from booking ids (OZ-… vs VD-…). */
export function makeDraftId(random: () => number = Math.random): string {
  let suffix = "";
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 7; i++) suffix += alphabet[Math.floor(random() * alphabet.length)];
  return `VD-${suffix}`;
}
