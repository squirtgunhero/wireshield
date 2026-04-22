import { test, expect } from "@playwright/test";

test.describe("Marketing landing page", () => {
  test("homepage loads and renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/WireShield/i);
    await expect(
      page.getByText(/every wire transfer/i)
    ).toBeVisible();
  });

  test("homepage has signup CTA", async ({ page }) => {
    await page.goto("/");
    const ctaLinks = page.getByRole("link", { name: /start free trial/i });
    await expect(ctaLinks.first()).toBeVisible();
    await expect(ctaLinks.first()).toHaveAttribute("href", "/signup");
  });

  test("homepage has navigation header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /wireshield/i })).toBeVisible();
  });

  test("homepage renders features section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /AI threat scanner/i })
    ).toBeVisible();
  });

  test("homepage renders how-it-works section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/how.*works/i)).toBeVisible();
  });

  test("homepage renders footer", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("health API returns ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});
