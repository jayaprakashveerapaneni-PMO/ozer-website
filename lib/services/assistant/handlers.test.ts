import { describe, expect, it, vi } from "vitest";
import { handleAlexa, slotValue, type AlexaEnvelope } from "./alexa";
import { handleSiri } from "./siri";
import type { AssistantLink } from "./store";

const LINK: AssistantLink = {
  code: "512345",
  customerId: "user-1",
  customerEmail: "me@x.com",
  customerName: "Jaya",
  deviceRef: null,
  createdAt: 1,
};

const deps = () => ({
  linkByCode: vi.fn(async (code: string) => (code === LINK.code ? LINK : null)),
  linkByDevice: vi.fn(async (ref: string) => (ref === "amzn1.device" ? LINK : null)),
  attachDevice: vi.fn(async () => {}),
  createDraft: vi.fn(async () => ({ id: "VD-TEST123" })),
});

const intentEnv = (name: string, slots: Record<string, { value?: string }> = {}): AlexaEnvelope => ({
  session: { user: { userId: "amzn1.device" }, application: { applicationId: "app" } },
  request: { type: "IntentRequest", intent: { name, slots } },
});

function speech(res: object): string {
  return (res as { response: { outputSpeech: { text: string } } }).response.outputSpeech.text;
}

describe("Alexa handler", () => {
  it("welcomes on launch and keeps the session open", async () => {
    const res = await handleAlexa({ request: { type: "LaunchRequest" } }, deps());
    expect(speech(res)).toContain("Welcome to Ozer");
    expect((res as { response: { shouldEndSession: boolean } }).response.shouldEndSession).toBe(false);
  });

  it("pairs a device with a valid code", async () => {
    const d = deps();
    const res = await handleAlexa(intentEnv("PairDeviceIntent", { code: { value: "512345" } }), d);
    expect(d.attachDevice).toHaveBeenCalledWith("512345", "amzn1.device");
    expect(speech(res)).toContain("linked");
  });

  it("rejects an unknown pairing code without linking", async () => {
    const d = deps();
    const res = await handleAlexa(intentEnv("PairDeviceIntent", { code: { value: "999999" } }), d);
    expect(d.attachDevice).not.toHaveBeenCalled();
    expect(speech(res)).toContain("couldn't find that code");
  });

  it("refuses to draft for an unpaired device (FR-27 identity)", async () => {
    const d = deps();
    const env = intentEnv("BookServiceIntent", { service: { value: "cleaning" } });
    env.session!.user!.userId = "amzn1.stranger";
    const res = await handleAlexa(env, d);
    expect(d.createDraft).not.toHaveBeenCalled();
    expect(speech(res)).toContain("pairing code");
  });

  it("creates a DRAFT (never a booking) and routes payment to the website", async () => {
    const d = deps();
    const res = await handleAlexa(
      intentEnv("BookServiceIntent", {
        service: { value: "maid" },
        hours: { value: "2" },
        zone: { value: "gachibowli" },
      }),
      d
    );
    expect(d.createDraft).toHaveBeenCalledWith({
      linkCode: "512345",
      source: "alexa",
      service: "cleaning",
      hours: 2,
      zone: "Gachibowli",
    });
    expect(speech(res).toLowerCase()).toContain("voice never completes a booking");
  });

  it("prefers entity-resolution values over raw utterances", () => {
    expect(
      slotValue({
        value: "clean my house",
        resolutions: {
          resolutionsPerAuthority: [
            { status: { code: "ER_SUCCESS_MATCH" }, values: [{ value: { name: "cleaning" } }] },
          ],
        },
      })
    ).toBe("cleaning");
  });
});

describe("Siri handler", () => {
  it("creates a draft for a valid request", async () => {
    const d = deps();
    const res = await handleSiri({ code: "512345", service: "laundry" }, d);
    expect(res.ok).toBe(true);
    expect(d.createDraft).toHaveBeenCalledWith(
      expect.objectContaining({ source: "siri", service: "laundry" })
    );
  });

  it("rejects missing/unknown codes and unknown services", async () => {
    const d = deps();
    expect((await handleSiri({ service: "cleaning" }, d)).ok).toBe(false);
    expect((await handleSiri({ code: "111111", service: "cleaning" }, d)).ok).toBe(false);
    expect((await handleSiri({ code: "512345", service: "plumbing" }, d)).ok).toBe(false);
    expect(d.createDraft).not.toHaveBeenCalled();
  });
});
