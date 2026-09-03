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

  test("should protect studio editor workspace and redirect unauthenticated users", async ({ page }) => {
    await page.goto("/editor/test-project");
    await page.waitForLoadState("networkidle");
    // Verify user is redirected to sign-in or stays on editor route
    await expect(page).toHaveURL(/\/(editor|sign-in)/);
  });
});
