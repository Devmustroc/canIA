import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button UI Primitive", () => {
  it("should render default button element", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeTruthy();
  });

  it("should apply variant classes correctly", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button", { name: "Outline Button" });
    expect(button.className).toContain("border");
  });

  it("should handle disabled state", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: "Disabled Button" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
