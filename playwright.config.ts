import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Viewport sweeps and image decoding are CPU-heavy; avoid local/CI oversubscription.
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  projects: [
    {name: "desktop", use: {viewport: {width: 1280, height: 800}}},
    {name: "mobile", use: {viewport: {width: 375, height: 812}}}
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 60_000
  }
});
