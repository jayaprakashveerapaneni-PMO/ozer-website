// Alexa custom-skill fulfillment (EP-14) as a pure handler — the API route
// supplies real store functions; tests inject fakes. Dialog contract:
//   "alexa, open ozer"                       → welcome + how to pair/book
//   "pair five one two three four five"      → links this Alexa device
//   "book two hours of cleaning in madhapur" → creates a DRAFT (FR-27)
// Payment always happens on the website — speech must never suggest otherwise.

import {
  clampSpokenHours,
  draftSpeech,
  matchService,
  matchZone,
  type ServiceId,
} from "@/lib/domain";
import type { AssistantLink } from "./store";

interface AlexaSlot {
  value?: string;
  resolutions?: {
    resolutionsPerAuthority?: {
      status?: { code?: string };
      values?: { value?: { name?: string } }[];
    }[];
  };
}

export interface AlexaEnvelope {
  version?: string;
  session?: {
    user?: { userId?: string };
    application?: { applicationId?: string };
  };
  request?: {
    type?: string;
    intent?: { name?: string; slots?: Record<string, AlexaSlot> };
  };
}

export interface AlexaDeps {
  linkByCode(code: string): Promise<AssistantLink | null>;
  linkByDevice(deviceRef: string): Promise<AssistantLink | null>;
  attachDevice(code: string, deviceRef: string): Promise<void>;
  createDraft(input: {
    linkCode: string;
    source: "alexa";
    service: ServiceId;
    hours: number | null;
    zone: string;
  }): Promise<unknown>;
}

/** Canonical slot value: entity resolution first, raw utterance second. */
export function slotValue(slot: AlexaSlot | undefined): string | null {
  const resolved = slot?.resolutions?.resolutionsPerAuthority?.find(
    (a) => a.status?.code === "ER_SUCCESS_MATCH"
  )?.values?.[0]?.value?.name;
  return resolved ?? slot?.value ?? null;
}

function speak(text: string, endSession: boolean, reprompt?: string) {
  return {
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text },
      ...(reprompt
        ? { reprompt: { outputSpeech: { type: "PlainText", text: reprompt } } }
        : {}),
      shouldEndSession: endSession,
    },
  };
}

const WELCOME =
  "Welcome to Ozer. You can say things like: book two hours of cleaning in Madhapur. " +
  "First time? Get a pairing code from your account page on the Ozer website, then say: pair, followed by the code.";

const HELP =
  "I can start a home-services booking for you — cleaning, cooking, laundry, or care. " +
  "Say: book cleaning in Madhapur. I'll prepare it as a draft; you confirm and pay on the Ozer website. " +
  "To link your account, say: pair, followed by the 6-digit code from your Ozer account page.";

export async function handleAlexa(env: AlexaEnvelope, deps: AlexaDeps): Promise<object> {
  const type = env.request?.type;

  if (type === "LaunchRequest") return speak(WELCOME, false, HELP);
  if (type === "SessionEndedRequest") return speak("", true);
  if (type !== "IntentRequest") return speak(HELP, false, HELP);

  const intent = env.request?.intent?.name ?? "";
  const slots = env.request?.intent?.slots ?? {};
  const deviceRef = env.session?.user?.userId ?? null;

  if (intent === "AMAZON.StopIntent" || intent === "AMAZON.CancelIntent") {
    return speak("Okay. Your drafts stay on your Ozer account page.", true);
  }
  if (intent === "AMAZON.HelpIntent" || intent === "AMAZON.FallbackIntent") {
    return speak(HELP, false, HELP);
  }

  if (intent === "PairDeviceIntent") {
    const code = (slotValue(slots.code) ?? "").replace(/\D/g, "");
    if (!code || !deviceRef) {
      return speak(
        "Tell me the 6-digit pairing code from your Ozer account page — say: pair, followed by the code.",
        false,
        HELP
      );
    }
    const link = await deps.linkByCode(code);
    if (!link) {
      return speak(
        "I couldn't find that code. Open your Ozer account page, generate a pairing code, and try again.",
        false,
        HELP
      );
    }
    await deps.attachDevice(code, deviceRef);
    return speak(
      `Done — this Alexa is now linked to ${link.customerName}'s Ozer account. Try: book cleaning in Madhapur.`,
      false,
      HELP
    );
  }

  if (intent === "BookServiceIntent") {
    const link = deviceRef ? await deps.linkByDevice(deviceRef) : null;
    if (!link) {
      return speak(
        "Let's link your account first. Get the pairing code from your Ozer account page, then say: pair, followed by the code.",
        false,
        HELP
      );
    }
    const service = matchService(slotValue(slots.service));
    if (!service) {
      return speak(
        "I can book cleaning, cooking, laundry, or child and elder care. Which one would you like?",
        false,
        HELP
      );
    }
    const hours = clampSpokenHours(slotValue(slots.hours));
    const zone = matchZone(slotValue(slots.zone));
    await deps.createDraft({ linkCode: link.code, source: "alexa", service, hours, zone });
    return speak(draftSpeech(service, hours, zone), true);
  }

  return speak(HELP, false, HELP);
}
