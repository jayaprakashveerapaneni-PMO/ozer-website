import { NextResponse } from "next/server";
import { handleAlexa, type AlexaEnvelope } from "@/lib/services/assistant/alexa";
import {
  AssistantNotProvisionedError,
  assistantConfigured,
  attachDevice,
  createDraft,
  linkByCode,
  linkByDevice,
} from "@/lib/services/assistant/store";

// Alexa custom-skill endpoint. Point the skill (docs/alexa/) at
// https://ozer-website.vercel.app/api/assistant/alexa
//
// ⚠ Certification gap (documented, deliberate for the pilot): Amazon requires
// SP-800-style request-signature verification (SignatureCertChainUrl) before
// PUBLIC distribution. Dev/test skills work without it. Set ALEXA_SKILL_ID in
// the environment to at least pin the application id.

export async function POST(req: Request): Promise<NextResponse> {
  if (!assistantConfigured()) {
    return NextResponse.json({ error: "assistant not configured" }, { status: 503 });
  }
  let env: AlexaEnvelope;
  try {
    env = (await req.json()) as AlexaEnvelope;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const expectedApp = process.env.ALEXA_SKILL_ID;
  const gotApp = env.session?.application?.applicationId;
  if (expectedApp && gotApp && expectedApp !== gotApp) {
    return NextResponse.json({ error: "unknown application" }, { status: 403 });
  }

  try {
    const response = await handleAlexa(env, {
      linkByCode,
      linkByDevice,
      attachDevice,
      createDraft,
    });
    return NextResponse.json(response);
  } catch (e) {
    const text =
      e instanceof AssistantNotProvisionedError
        ? "Ozer voice booking is still being set up. Please try again soon."
        : "Something went wrong on Ozer's side. Your account and payments are untouched — please try again.";
    return NextResponse.json({
      version: "1.0",
      response: {
        outputSpeech: { type: "PlainText", text },
        shouldEndSession: true,
      },
    });
  }
}
