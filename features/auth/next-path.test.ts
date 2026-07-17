import { describe, expect, it } from "vitest";
import { sanitizeNextPath } from "./next-path";

describe("sanitizeNextPath (open-redirect guard)", () => {
  it("passes same-site absolute paths", () => {
    expect(sanitizeNextPath("/book")).toBe("/book");
    expect(sanitizeNextPath("/book?resume=1&x=2")).toBe("/book?resume=1&x=2");
    expect(sanitizeNextPath("/")).toBe("/");
  });

  it("rejects empty and null", () => {
    expect(sanitizeNextPath(null)).toBeNull();
    expect(sanitizeNextPath("")).toBeNull();
  });

  it("rejects protocol-relative and absolute URLs", () => {
    expect(sanitizeNextPath("//evil.com")).toBeNull();
    expect(sanitizeNextPath("https://evil.com")).toBeNull();
    expect(sanitizeNextPath("/x?u=https://ok.com")).toBeNull();
    expect(sanitizeNextPath("javascript://alert(1)")).toBeNull();
  });

  it("rejects relative paths and backslash tricks", () => {
    expect(sanitizeNextPath("book")).toBeNull();
    expect(sanitizeNextPath("/\\evil.com")).toBeNull();
  });
});
