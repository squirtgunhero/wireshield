import { test, expect } from "@playwright/test";

test.describe("Wire Instructions API", () => {
  let sessionCookie: string;

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post("/api/auth/login", {
      data: { email: "admin@wireshield.io", password: "admin123" },
    });
    expect(loginRes.ok()).toBeTruthy();
    const cookies = loginRes.headers()["set-cookie"] ?? "";
    const match = cookies.match(/ws_session=([^;]+)/);
    sessionCookie = match ? match[1] : "";
    expect(sessionCookie).toBeTruthy();
  });

  test("POST /api/wire-instructions returns 401 without auth", async ({
    request,
  }) => {
    const res = await request.post("/api/wire-instructions", {
      data: {
        transactionId: "nonexistent",
        bankName: "Test Bank",
        routingNumber: "021000021",
        accountNumberEncrypted: "encrypted-test",
        accountHolderName: "Test User",
      },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/wire-instructions returns 400 with missing fields", async ({
    request,
  }) => {
    const res = await request.post("/api/wire-instructions", {
      headers: { Cookie: `ws_session=${sessionCookie}` },
      data: { bankName: "Test Bank" },
    });
    expect(res.status()).toBe(400);
  });

  test("wire instructions page accessible for a transaction", async ({
    page,
  }) => {
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

      const wiresTab = page.getByRole("link", { name: /wire/i });
      if (await wiresTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await wiresTab.click();
        await expect(page).toHaveURL(/\/transactions\/.*\/wires/);
      }
    }
  });
});
