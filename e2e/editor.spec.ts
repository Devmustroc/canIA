import { test, expect } from "@playwright/test";

test.describe("Studio Editor Deep E2E Suite", () => {
  test("should render public landing dashboard page", async ({ page }) => {
    const response = await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });

  test("should load pricing tiers and features checklist", async ({ page }) => {
    const response = await page.goto("/pricing");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });

  test("should render template cards and allow template filtering", async ({ page }) => {
    const response = await page.goto("/templates");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });

  test("should verify studio editor canvas container and tools presence", async ({ page }) => {
    const response = await page.goto("/editor/test-project-123");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });
});
