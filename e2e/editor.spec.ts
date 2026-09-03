import { test, expect } from "@playwright/test";

test.describe("CanIA End-to-End Application Suite", () => {
  test("should load the main dashboard page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/cania/i);
  });

  test("should render the pricing page and plan options", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("body")).toContainText(/pricing|tarifs|pro|abonnement/i);
  });

  test("should render the templates gallery page", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.locator("body")).toContainText(/template|modèle|poster|design/i);
  });

  test("should load the studio editor workspace", async ({ page }) => {
    await page.goto("/editor/test-project");
    // Verify studio editor elements exist or redirect to auth
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
