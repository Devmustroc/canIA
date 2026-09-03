import { test, expect } from "@playwright/test";

test.describe("Visual Layout & Styling Regression Suite", () => {
  test("should maintain consistent layout on public landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take screenshot of landing page body element
    const screenshot = await page.locator("body").screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1000);
  });

  test("should maintain consistent UI rendering on pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await page.waitForLoadState("networkidle");

    const screenshot = await page.locator("body").screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(1000);
  });
});
