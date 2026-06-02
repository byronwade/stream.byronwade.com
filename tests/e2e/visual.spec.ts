import { test, expect } from "@playwright/test";

// Visual regression. Video and constantly-updating widgets (viewer counts, chat,
// simulators) are masked so diffs reflect layout/chrome, not playback frames.
// Baselines are platform-specific (Playwright suffixes per-OS); generate locally
// with `npm run test:visual:update`. CI runs this as a non-blocking job.
const PAGES = [
  { name: "home", url: "/" },
  { name: "watch", url: "/live/forest-city-build" },
  { name: "studio", url: "/studio" },
];

for (const p of PAGES) {
  test(`visual: ${p.name}`, async ({ page }) => {
    await page.goto(p.url);
    await page.waitForLoadState("load");
    await page.waitForTimeout(800);

    await expect(page).toHaveScreenshot(`${p.name}.png`, {
      fullPage: true,
      animations: "disabled",
      mask: [page.locator("video"), page.locator("canvas")],
      maxDiffPixelRatio: 0.05,
    });
  });
}
