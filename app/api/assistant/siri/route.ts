import { NextResponse } from "next/server";
import { handleSiri, type SiriRequest } from "@/lib/services/assistant/siri";
import {
  AssistantNotProvisionedError,
  assistantConfigured,
  createDraft,
  linkByCode,
} from "@/lib/services/assistant/store";

// Siri Shortcuts endpoint — the shortcut ("Get contents of URL") POSTs
// { code, service, hours?, zone? } and speaks/shows `speech` back.
// Setup recipe lives at /assistants.

export async function POST(req: Request): Promise<NextResponse> {
  if (!assistantConfigured()) {
    return NextResponse.json({ error: "assistant not configured" }, { status: 503 });
  }
  let body: SiriRequest;
  try {
    body = (await req.json()) as SiriRequest;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", speech: "The shortcut sent an invalid request." },
      { status: 400 }
    );
  }
  try {
    const result = await handleSiri(body, { linkByCode, createDraft });
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (e) {
    if (e instanceof AssistantNotProvisionedError) {
      return NextResponse.json(
        { ok: false, error: "not_provisioned", speech: "Ozer voice booking is still being set up." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "internal", speech: "Something went wrong — please try again." },
      { status: 500 }
    );
  }
}
