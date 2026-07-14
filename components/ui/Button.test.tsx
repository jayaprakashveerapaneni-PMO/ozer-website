// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach } from "vitest";
import Button from "./Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a real <button> for actions", () => {
    render(<Button onClick={() => {}}>Do it</Button>);
    const el = screen.getByRole("button", { name: "Do it" });
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveProperty("type", "button"); // never accidental submit
  });

  it("renders an anchor when href is provided (navigation semantics)", () => {
    render(<Button href="/book">Book now</Button>);
    const el = screen.getByRole("link", { name: "Book now" });
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("href")).toBe("/book");
  });

  it("fires onClick and respects disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Nope
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "Nope" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="glass" size="lg">
        Glass
      </Button>
    );
    const el = screen.getByRole("button", { name: "Glass" });
    expect(el.className).toContain("glass");
    expect(el.className).toContain("rounded-2xl");
  });
});
