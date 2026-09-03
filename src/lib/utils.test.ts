import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge tailwind classes properly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("should resolve tailwind class conflicts correctly", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
