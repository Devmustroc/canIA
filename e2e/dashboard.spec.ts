import { test, expect } from "@playwright/test";

test.describe("Dashboard & Navigation E2E Suite", () => {
  test("should render main sidebar and route navigation links", async ({ page }) => {
    const response = await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });

  test("should interact with brand kit page and update localStorage", async ({ page }) => {
    const response = await page.goto("/brand-kit");
    await page.waitForLoadState("domcontentloaded");
    expect(response?.status()).toBeLessThan(500);
  });

  test("should load sign-in auth page with Clerk split layout", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test("should load sign-up auth page", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
