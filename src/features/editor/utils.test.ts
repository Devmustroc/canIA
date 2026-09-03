import { describe, it, expect } from "vitest";
import { isTextType, rgbaToString, transformText } from "./utils";

describe("Editor Utility Functions", () => {
  describe("isTextType", () => {
    it("should return true for valid text types", () => {
      expect(isTextType("text")).toBe(true);
      expect(isTextType("i-text")).toBe(true);
      expect(isTextType("textbox")).toBe(true);
    });

    it("should return false for non-text types or undefined", () => {
      expect(isTextType("image")).toBe(false);
      expect(isTextType("rect")).toBe(false);
      expect(isTextType("circle")).toBe(false);
      expect(isTextType(undefined)).toBe(false);
    });
  });

  describe("rgbaToString", () => {
    it("should return transparent rgba string when input is transparent", () => {
      expect(rgbaToString("transparent")).toBe("rgba(0,0,0,0)");
    });

    it("should format RGBColor object into valid rgba string", () => {
      expect(rgbaToString({ r: 255, g: 0, b: 128, a: 0.5 })).toBe("rgba(255,0,128,0.5)");
    });

    it("should default alpha to 1 if a is undefined", () => {
      expect(rgbaToString({ r: 100, g: 150, b: 200 })).toBe("rgba(100,150,200,1)");
    });
  });

  describe("transformText", () => {
    it("should recursively transform i-text and textbox types to text", async () => {
      const objects = [
        { type: "textbox", text: "Hello" },
        { type: "rect" },
        {
          type: "group",
          objects: [
            { type: "i-text", text: "World" },
            { type: "circle" },
          ],
        },
      ];

      await transformText(objects);

      expect(objects[0]?.type).toBe("text");
      expect(objects[1]?.type).toBe("rect");
      expect(objects[2]?.objects?.[0]?.type).toBe("text");
      expect(objects[2]?.objects?.[1]?.type).toBe("circle");
    });

    it("should handle null or undefined input gracefully", async () => {
      await expect(transformText(null)).resolves.toBeUndefined();
      await expect(transformText(undefined)).resolves.toBeUndefined();
    });
  });
});
