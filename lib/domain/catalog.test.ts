import { describe, expect, it } from "vitest";
import { SERVICES, serviceChecklist } from "./catalog";
import type { ServiceId } from "./types";

describe("serviceChecklist (completion summary source)", () => {
  it("returns the published inclusions for every service", () => {
    for (const s of SERVICES) {
      expect(serviceChecklist(s.id)).toEqual(s.bullets);
      expect(serviceChecklist(s.id).length).toBeGreaterThan(0);
    }
  });

  it("returns an empty list for an unknown service id", () => {
    expect(serviceChecklist("plumbing" as ServiceId)).toEqual([]);
  });
});
