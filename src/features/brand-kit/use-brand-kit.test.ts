import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBrandKit, getStoredBrandKit, saveStoredBrandKit, DEFAULT_BRAND_KIT } from "./use-brand-kit";

describe("useBrandKit Hook & Storage Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return default brand kit when localStorage is empty", () => {
    expect(getStoredBrandKit()).toEqual(DEFAULT_BRAND_KIT);
  });

  it("should persist brand kit changes to localStorage", () => {
    const customKit = {
      ...DEFAULT_BRAND_KIT,
      name: "Acme Corp Studio",
    };
    saveStoredBrandKit(customKit);

    const loaded = getStoredBrandKit();
    expect(loaded.name).toBe("Acme Corp Studio");
  });

  it("should load brand kit state and allow color updates via hook", () => {
    const { result } = renderHook(() => useBrandKit());

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.brandKit.name).toBe(DEFAULT_BRAND_KIT.name);

    act(() => {
      result.current.updateColor("primary", "#FF0000");
    });

    expect(result.current.brandKit.colors.primary).toBe("#FF0000");
    expect(getStoredBrandKit().colors.primary).toBe("#FF0000");
  });

  it("should allow font updates via hook", () => {
    const { result } = renderHook(() => useBrandKit());

    act(() => {
      result.current.updateFont("heading", "Impact");
    });

    expect(result.current.brandKit.fonts.heading).toBe("Impact");
    expect(getStoredBrandKit().fonts.heading).toBe("Impact");
  });
});
