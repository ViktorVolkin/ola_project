import {defineConfig} from "@playwright/test";
import path from "node:path";

const fixture = "/workspace/.local-tools/ola-qa/fixture-fzwRsz";
const port = 44535;
export default defineConfig({
  testDir: path.join(fixture, "tests/e2e"),
  fullyParallel: true,
  workers: 2,
  forbidOnly: false,
  retries: 0,
  outputDir: path.join(fixture, "playwright-results"),
  projects: [
    {name: "desktop", use: {viewport: {width: 1280, height: 800}}},
    {name: "mobile", use: {viewport: {width: 375, height: 812}}}
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure"
  },
  webServer: {
    command: "/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node /workspace/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 44535",
    cwd: fixture,
    url: `http://127.0.0.1:${port}/en`,
    reuseExistingServer: false,
    timeout: 60_000
  }
});
