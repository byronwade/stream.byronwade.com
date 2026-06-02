import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { name: "home", url: "/" },
  { name: "discover", url: "/discover" },
  { name: "about", url: "/about" },
  { name: "help", url: "/help" },
  { name: "settings", url: "/settings" },
  { name: "watch", url: "/live/forest-city-build" },
];

for (const p of PAGES) {
  test(`a11y: ${p.name} has no serious or critical violations`, async ({ page }) => {
    await page.goto(p.url);
    await page.waitForLoadState("load");
    // Allow client hydration + first simulator tick to settle.
    await page.waitForTimeout(600);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    const summary = blocking.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
    }));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}
