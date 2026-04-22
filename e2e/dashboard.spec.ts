import { test, expect } from "@playwright/test";

test.describe("App pages load correctly", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@wireshield.io");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10_000 });
  });

  test("dashboard loads with heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("dashboard shows quick action links", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "New transaction", exact: true })
    ).toBeVisible();
  });

  test("analytics page loads", async ({ page }) => {
    await page.goto("/analytics");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("compliance page loads", async ({ page }) => {
    await page.goto("/compliance");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("scan page loads", async ({ page }) => {
    await page.goto("/scan");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("training page loads", async ({ page }) => {
    await page.goto("/training");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("intel page loads", async ({ page }) => {
    await page.goto("/intel");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
