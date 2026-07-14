// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import SegmentedControl from "./SegmentedControl";

afterEach(cleanup);

const options = [
  { value: "regular", label: "Regular" },
  { value: "deep", label: "Deep clean" },
] as const;

describe("SegmentedControl", () => {
  it("exposes a radiogroup with correct aria-checked state", () => {
    render(
      <SegmentedControl label="Cleaning type" options={[...options]} value="regular" onChange={() => {}} />
    );
    expect(screen.getByRole("radiogroup", { name: "Cleaning type" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Regular" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Deep clean" }).getAttribute("aria-checked")).toBe("false");
  });

  it("reports the selected value on click", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl label="Cleaning type" options={[...options]} value="regular" onChange={onChange} />
    );
    fireEvent.click(screen.getByRole("radio", { name: "Deep clean" }));
    expect(onChange).toHaveBeenCalledWith("deep");
  });
});
