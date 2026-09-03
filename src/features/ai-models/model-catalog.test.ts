import { describe, it, expect } from "vitest";
import { CHAT_MODELS, IMAGE_MODELS, DEFAULT_CHAT_MODEL, DEFAULT_IMAGE_MODEL } from "./model-catalog";

describe("AI Model Catalog", () => {
  it("should contain non-empty chat models list", () => {
    expect(CHAT_MODELS.length).toBeGreaterThan(0);
  });

  it("should contain non-empty image models list", () => {
    expect(IMAGE_MODELS.length).toBeGreaterThan(0);
  });

  it("should have a default chat model present in the catalog", () => {
    const found = CHAT_MODELS.some((m) => m.id === DEFAULT_CHAT_MODEL);
    expect(found).toBe(true);
  });

  it("should have a default image model present in the catalog", () => {
    const found = IMAGE_MODELS.some((m) => m.id === DEFAULT_IMAGE_MODEL);
    expect(found).toBe(true);
  });

  it("should ensure every model has required properties", () => {
    [...CHAT_MODELS, ...IMAGE_MODELS].forEach((model) => {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(model.provider).toBeTruthy();
      expect(model.category).toMatch(/^(text|image)$/);
    });
  });
});
