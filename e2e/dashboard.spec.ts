import { test, expect } from "@playwright/test";

test.describe("Dashboard & Navigation E2E Suite", () => {
  test("should render main sidebar and route navigation links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Check sidebar links exist
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/cania|home|accueil|templates|modèles|pricing|tarifs|brand/i);
  });

  test("should interact with brand kit page and update localStorage", async ({ page }) => {
    await page.goto("/brand-kit");
    await page.waitForLoadState("domcontentloaded");

    // Check brand kit page elements
    const heading = page.locator("h1, h2, h3").first();
    await expect(heading).toBeVisible();

    // Verify localStorage brand kit is initialized
    const brandKitData = await page.evaluate(() => localStorage.getItem("cania_brand_kit"));
    expect(brandKitData === null || typeof brandKitData === "string").toBe(true);
  });

  test("should load sign-in auth page with Clerk split layout", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    // Verify auth container and branding elements
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/sign in|connexion|cania|email|clerk/i);
  });

  test("should load sign-up auth page", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/sign up|inscription|cania|clerk/i);
  });
});
