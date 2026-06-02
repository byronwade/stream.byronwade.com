import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:3456",
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.05, animations: "disabled" },
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: /visual\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx serve out -l 3456",
    url: "http://127.0.0.1:3456",
    reuseExistingServer: !process.env.CI,
  },
});
