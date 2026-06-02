import { test, expect } from "@playwright/test";

test.describe("New flows", () => {
  test("schedule reminder persists after reload", async ({ page }) => {
    await page.goto("/schedule");
    await page.getByRole("button", { name: "Set reminder" }).first().click();
    await expect(page.getByRole("button", { name: /Reminder set/ }).first()).toBeVisible();
    await page.reload();
    await expect(page.getByRole("button", { name: /Reminder set/ }).first()).toBeVisible();
  });

  test("studio PIN gate blocks then unlocks", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: "Studio locked" })).toBeVisible();
    await page.getByLabel("Studio PIN").fill("1234");
    await page.getByRole("button", { name: "Unlock studio" }).click();
    await expect(page.getByRole("heading", { name: "Studio locked" })).toHaveCount(0);
  });

  test("signup as creator lands in the studio", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.locator('input[type="email"]').fill("creator@stream.test");
    await page.locator('input[type="text"]').fill("newcreator");
    await page.locator('input[type="password"]').fill("password");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Sign up as creator" }).click();
    await expect(page).toHaveURL(/\/studio/, { timeout: 10000 });
    await expect(page.getByText("Creator Studio")).toBeVisible();
  });

  test("ended stream shows VOD treatment", async ({ page }) => {
    await page.goto("/live/speedrun-any-percent");
    await expect(page.getByText("VOD").first()).toBeVisible({ timeout: 10000 });
  });

  test("scheduled stream shows countdown and notify", async ({ page }) => {
    await page.goto("/live/react-19-deep-dive");
    await expect(page.getByText("Starts in")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Notify me" })).toBeVisible();
  });

  test("music category is populated (no empty state)", async ({ page }) => {
    await page.goto("/categories/music");
    await expect(page.getByRole("heading", { name: "Music" })).toBeVisible();
    await expect(page.getByText(/No one is live/)).toHaveCount(0);
  });

  test("library shows empty state for a fresh user", async ({ page }) => {
    await page.goto("/library/clips");
    await expect(page.getByText("No clips yet")).toBeVisible();
  });

  test("go-live wizard completes after unlocking", async ({ page }) => {
    await page.goto("/studio/go-live");
    await page.getByRole("button", { name: "Unlock with demo PIN" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Go Live" }).click();
    await expect(page).toHaveURL(/\/studio\/stream-manager/, { timeout: 10000 });
  });

  test("mobile chat send adds a local message", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/live/forest-city-build");
    await page.getByRole("button", { name: "Open chat" }).click();
    const input = page.getByLabel("Chat message");
    await input.fill("hello from test");
    await input.press("Enter");
    await expect(page.getByText("hello from test")).toBeVisible({ timeout: 10000 });
  });

  test("poll voting in chat shows results", async ({ page }) => {
    await page.goto("/live/forest-city-build");
    await page.getByRole("button", { name: "Polls" }).click();
    await page.getByRole("button", { name: "Glass roofs" }).click();
    await expect(page.getByText(/your vote is mocked locally/)).toBeVisible({ timeout: 10000 });
  });
});
