// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import NumberField from "./NumberField";

afterEach(cleanup);

function setup(onChange = vi.fn()) {
  render(
    <NumberField id="hrs" label="Hours" value={2} onChange={onChange} min={1} max={8} unit="hrs" />
  );
  return { input: screen.getByLabelText("Hours"), onChange };
}

describe("NumberField", () => {
  it("is a labeled numeric input (a11y + mobile keyboard)", () => {
    const { input } = setup();
    expect(input.getAttribute("inputmode")).toBe("numeric");
    expect(input.getAttribute("type")).toBe("number");
  });

  it("clamps values above max (FR-6 EC)", () => {
    const { input, onChange } = setup();
    fireEvent.change(input, { target: { value: "24" } });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  it("clamps zero/negative/garbage to min (FR-6 EC)", () => {
    const { input, onChange } = setup();
    fireEvent.change(input, { target: { value: "0" } });
    expect(onChange).toHaveBeenCalledWith(1);
    fireEvent.change(input, { target: { value: "-5" } });
    expect(onChange).toHaveBeenCalledWith(1);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
