import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hint } from "./hint";

describe("Hint Tooltip Component", () => {
  it("should render child elements properly", () => {
    render(
      <Hint label="Export Image">
        <button>Export</button>
      </Hint>
    );

    const button = screen.getByRole("button", { name: "Export" });
    expect(button).toBeTruthy();
  });
});
