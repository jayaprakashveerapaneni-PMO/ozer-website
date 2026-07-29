// Siri Shortcuts fulfillment (EP-14, honest depth: Apple Shortcuts, not
// SiriKit — a native iOS app is a later milestone). The shortcut POSTs JSON
// with the pairing code it stored at setup; the response `speech` is what
// the shortcut shows or speaks back. Drafts only — payment on the website.

import {
  clampSpokenHours,
  draftSpeech,
  matchService,
  matchZone,
  type ServiceId,
} from "@/lib/domain";
import type { AssistantLink } from "./store";

export interface SiriRequest {
  code?: string;
  service?: string;
  hours?: number | string;
  zone?: string;
}

export interface SiriDeps {
  linkByCode(code: string): Promise<AssistantLink | null>;
  createDraft(input: {
    linkCode: string;
    source: "siri";
    service: ServiceId;
    hours: number | null;
    zone: string;
  }): Promise<{ id: string }>;
}

export type SiriResult =
  | { ok: true; speech: string; draftId: string }
  | { ok: false; speech: string; error: string };

export async function handleSiri(body: SiriRequest, deps: SiriDeps): Promise<SiriResult> {
  const code = String(body.code ?? "").replace(/\D/g, "");
  if (!code) {
    return {
      ok: false,
      error: "missing_code",
      speech:
        "Your shortcut isn't linked yet. Get a pairing code from your Ozer account page and add it to the shortcut.",
    };
  }
  const link = await deps.linkByCode(code);
  if (!link) {
    return {
      ok: false,
      error: "unknown_code",
      speech:
        "That pairing code wasn't recognised. Generate a fresh one on your Ozer account page.",
    };
  }
  const service = matchService(body.service);
  if (!service) {
    return {
      ok: false,
      error: "unknown_service",
      speech: "Ozer can book cleaning, cooking, laundry, or child and elder care.",
    };
  }
  const hours = clampSpokenHours(body.hours);
  const zone = matchZone(body.zone);
  const draft = await deps.createDraft({ linkCode: link.code, source: "siri", service, hours, zone });
  return { ok: true, draftId: draft.id, speech: draftSpeech(service, hours, zone) };
}
