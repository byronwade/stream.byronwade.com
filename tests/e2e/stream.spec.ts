import { test, expect } from "@playwright/test";

test.describe("Stream platform", () => {
  test("homepage loads and links to discover", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Building a forest city")).toBeVisible();
    await page.getByRole("link", { name: "See all" }).click();
    await expect(page).toHaveURL(/\/discover/);
  });

  test("watch page opens catch-up panel via URL", async ({ page }) => {
    await page.goto("/live/forest-city-build?panel=catch-up");
    await expect(page.getByRole("heading", { name: "Catch Me Up" })).toBeVisible({ timeout: 10000 });
  });

  test("auth login flow persists session", async ({ page }) => {
    await page.goto("/auth/login");
    await page.locator('input[type="email"]').fill("demo@stream.test");
    await page.locator('input[type="password"]').fill("password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("demo")).toBeVisible({ timeout: 10000 });
  });

  test("discover mood filter via URL", async ({ page }) => {
    await page.goto("/discover?mood=creative");
    await expect(page.getByText("Discover")).toBeVisible();
  });

  test("follow creator persists after reload", async ({ page }) => {
    await page.goto("/channels/maya-builds");
    await page.getByRole("button", { name: "Follow" }).click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Following" })).toBeVisible();
  });

  test("report stream appears in moderation queue", async ({ page }) => {
    await page.goto("/live/forest-city-build?panel=report");
    await page.getByRole("button", { name: "Submit report" }).click();
    await expect(page.getByRole("status")).toContainText("Report submitted", { timeout: 5000 });
    await page.goto("/studio/moderation");
    await page.getByRole("button", { name: "Unlock with demo PIN" }).click();
    await expect(page.getByText(/Report queue \(1\)/)).toBeVisible({ timeout: 5000 });
  });

  test("clip composer publishes to view page", async ({ page }) => {
    await page.goto("/live/forest-city-build?panel=clip");
    await page.getByRole("button", { name: "Publish clip" }).click();
    await expect(page.getByText("Clip published!")).toBeVisible({ timeout: 5000 });
    await page.getByRole("link", { name: "View clip" }).click();
    await expect(page).toHaveURL(/\/clips\/view\?id=clip_/);
  });
});
