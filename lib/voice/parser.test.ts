import { describe, expect, it } from "vitest";
import { parseIntent } from "./parser";

describe("voice intent parser (FR-26)", () => {
  it("parses Telugu cleaning + this-evening", () => {
    expect(parseIntent("ఈ సాయంత్రం ఇల్లు శుభ్రం చేయడానికి ఎవరైనా కావాలి")).toEqual({
      service: "cleaning",
      slot: "today-pm",
    });
  });

  it("parses Telugu cook + tomorrow-morning", () => {
    expect(parseIntent("రేపు ఉదయం వంట మనిషి కావాలి")).toEqual({
      service: "cook",
      slot: "tom-am",
    });
  });

  it("parses Hindi cook + tomorrow-evening", () => {
    expect(parseIntent("कल शाम खाना बनाने वाली चाहिए")).toEqual({
      service: "cook",
      slot: "tom-pm",
    });
  });

  it("parses Tamil laundry + asap", () => {
    expect(parseIntent("இப்போது துணி எடுக்க லாண்டரி புக் செய்")).toEqual({
      service: "laundry",
      slot: "asap",
    });
  });

  it("parses English care requests", () => {
    expect(parseIntent("I need a babysitter tomorrow morning").service).toBe("care");
  });

  it("handles Telugu-English code switching (EC)", () => {
    expect(parseIntent("evening lo cleaning kavali").service).toBe("cleaning");
  });

  it("returns nulls for out-of-scope requests (scoped refusal, FR-26 EC)", () => {
    expect(parseIntent("play some music")).toEqual({ service: null, slot: null });
  });

  it("prefers specific slot phrases over generic ones", () => {
    // "tomorrow morning" must win over generic "tomorrow"
    expect(parseIntent("book a cleaner tomorrow morning").slot).toBe("tom-am");
  });
});
