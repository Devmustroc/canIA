import { describe, it, expect } from "vitest";
import { STYLE_PROFILES, HARNESS_SYSTEM_PROMPT } from "./design-knowledge";

describe("Design Knowledge Agent Harness", () => {
  it("should contain style profiles for essential design themes", () => {
    expect(STYLE_PROFILES).toHaveProperty("minimalist");
    expect(STYLE_PROFILES).toHaveProperty("editorial_luxury");
    expect(STYLE_PROFILES).toHaveProperty("modern_saas");
    expect(STYLE_PROFILES).toHaveProperty("neo_brutalist");
    expect(STYLE_PROFILES).toHaveProperty("warm_artisan");
  });

  it("should ensure every style profile has complete color palette and typography", () => {
    Object.values(STYLE_PROFILES).forEach((profile) => {
      expect(profile.id).toBeTruthy();
      expect(profile.name).toBeTruthy();
      expect(profile.background).toMatch(/^#[0-9A-Fa-f]{6}$/);

      expect(profile.palette.primary).toBeTruthy();
      expect(profile.palette.secondary).toBeTruthy();
      expect(profile.palette.accent).toBeTruthy();
      expect(profile.palette.text).toBeTruthy();

      expect(profile.typography.titleFont).toBeTruthy();
      expect(profile.typography.bodyFont).toBeTruthy();
      expect(profile.typography.titleWeight).toBeGreaterThan(0);
    });
  });

  it("should include core anti-slop guidelines in system prompt", () => {
    expect(HARNESS_SYSTEM_PROMPT).toContain("Anti-Slop Standard");
    expect(HARNESS_SYSTEM_PROMPT).toContain("SPATIAL BALANCE");
    expect(HARNESS_SYSTEM_PROMPT).toContain("COLOR CALIBRATION");
    expect(HARNESS_SYSTEM_PROMPT).toContain("TYPOGRAPHY HIERARCHY");
  });
});
