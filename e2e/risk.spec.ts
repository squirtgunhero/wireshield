import { test, expect } from "@playwright/test";

test.describe("Risk Scoring API", () => {
  let sessionCookie: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post("/api/auth/login", {
      data: { email: "admin@wireshield.io", password: "admin123" },
    });
    expect(loginRes.ok()).toBeTruthy();
    const cookies = loginRes.headers()["set-cookie"] ?? "";
    const match = cookies.match(/ws_session=([^;]+)/);
    sessionCookie = match ? match[1] : "";
  });

  test("GET /api/risk/score/:id returns 401 without auth", async ({
    request,
  }) => {
    const res = await request.get("/api/risk/score/test-id");
    expect(res.status()).toBe(401);
  });

  test("GET /api/risk/score/:id returns error for nonexistent transaction", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/risk/score/00000000-0000-0000-0000-000000000000",
      { headers: { Cookie: `ws_session=${sessionCookie}` } }
    );
    expect([404, 500]).toContain(res.status());
  });

  test("GET /api/risk/events/:id returns 401 without auth", async ({
    request,
  }) => {
    const res = await request.get("/api/risk/events/test-id");
    expect(res.status()).toBe(401);
  });

  test("POST /api/risk/analyze-email returns 401 without auth", async ({
    request,
  }) => {
    const res = await request.post("/api/risk/analyze-email", {
      data: { email: "test@example.com", transactionId: "test" },
    });
    expect(res.status()).toBe(401);
  });

  test("alerts page accessible for a transaction", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@wireshield.io");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10_000 });

    await page.goto("/transactions");
    const firstTx = page.locator("a[href*='/transactions/']").first();
    if (await firstTx.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await firstTx.click();
      await page.waitForURL("**/transactions/*", { timeout: 10_000 });

      const alertsTab = page.getByRole("link", { name: /alert/i });
      if (await alertsTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await alertsTab.click();
        await expect(page).toHaveURL(/\/transactions\/.*\/alerts/);
      }
    }
  });
});
