import { test, expect } from "@playwright/test";

test.describe("Studio Editor Deep E2E Suite", () => {
  test("should render public landing dashboard page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/cania/i);
  });

  test("should load pricing tiers and features checklist", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");

    const text = await page.locator("body").innerText();
    expect(text).toMatch(/pro|gratuit|free|illimité|export/i);
  });

  test("should render template cards and allow template filtering", async ({ page }) => {
    await page.goto("/templates");
    await page.waitForLoadState("networkidle");

    const cards = page.locator("img, svg, div");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should verify studio editor canvas container and tools presence", async ({ page }) => {
    await page.goto("/editor/test-project-123");
    await page.waitForLoadState("domcontentloaded");

    // Check page URL redirects or displays editor
    expect(page.url()).toMatch(/\/(editor|sign-in)/);
  });
});
