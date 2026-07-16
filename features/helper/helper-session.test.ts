// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  findHelperByLogin,
  getSessionHelperId,
  signIn,
  signOut,
  HELPER_LOGINS,
} from "./helper-session";
import { HELPERS } from "@/lib/domain";

describe("helper sign-in", () => {
  it("matches phone + PIN across common phone formats", () => {
    expect(findHelperByLogin("98490 10001", "1111")?.id).toBe("h1");
    expect(findHelperByLogin("9849010001", "1111")?.id).toBe("h1");
    expect(findHelperByLogin("+91 98490 10001", "1111")?.id).toBe("h1");
  });

  it("rejects a wrong PIN, unknown phone, and short numbers", () => {
    expect(findHelperByLogin("98490 10001", "9999")).toBeNull();
    expect(findHelperByLogin("90000 00000", "1111")).toBeNull();
    expect(findHelperByLogin("10001", "1111")).toBeNull();
  });

  it("every pilot helper has a credential entry", () => {
    for (const h of HELPERS) {
      expect(HELPER_LOGINS[h.id], `credentials for ${h.id}`).toBeDefined();
    }
  });
});

describe("helper session persistence", () => {
  beforeEach(() => signOut());

  it("round-trips sign-in and sign-out through storage", () => {
    expect(getSessionHelperId()).toBeNull();
    signIn(HELPERS[2]);
    expect(getSessionHelperId()).toBe(HELPERS[2].id);
    signOut();
    expect(getSessionHelperId()).toBeNull();
  });
});
