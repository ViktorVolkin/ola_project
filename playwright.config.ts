import {defineConfig} from "@playwright/test";
import path from "node:path";

// Direct Playwright use requires an explicitly owned private production app.
// The existing QA controller supplies OLA_QA_BASE_URL and owns its own server.
const qaURL = process.env.OLA_QA_BASE_URL;
const port = Number(process.env.OLA_SUITE_PORT);
const app = process.env.OLA_SUITE_APP;
if (!qaURL && (!app || path.resolve(app) === process.cwd() || !Number.isInteger(port) || port < 1024 || port > 65535 || port === 3100)) throw new Error("Set OLA_SUITE_APP to a private built app and OLA_SUITE_PORT to its private port; use npm run test:feature for managed runs");
const baseURL = qaURL || `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: ["bouquet-detail-page.spec.ts", "bouquet-detail-preferences.spec.ts", "bouquet-detail-supporting.spec.ts"],
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  projects: [
    {name: "desktop", use: {viewport: {width: 1280, height: 800}}},
    {name: "mobile", use: {viewport: {width: 375, height: 812}}}
  ],
  use: {baseURL, trace: "retain-on-failure"},
  webServer: qaURL ? undefined : {
    command: `${JSON.stringify(process.execPath)} ${JSON.stringify(path.resolve("node_modules/next/dist/bin/next"))} start --hostname 127.0.0.1 --port ${port}`,
    cwd: app,
    url: `${baseURL}/en`, reuseExistingServer: false, timeout: 60_000
  }
});
