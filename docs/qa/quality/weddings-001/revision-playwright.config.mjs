import {defineConfig} from '/workspace/node_modules/@playwright/test/index.mjs';
export default defineConfig({
  testDir: '/workspace/tests/e2e',
  testMatch: 'weddings.spec.ts',
  outputDir: '/workspace/docs/qa/quality/weddings-001/revision-test-results',
  workers: 2,
  reporter: 'list',
  projects: [
    {name: 'desktop', use: {viewport: {width: 1280, height: 800}}},
    {name: 'mobile', use: {viewport: {width: 375, height: 812}}}
  ],
  use: {baseURL: 'http://127.0.0.1:31877', trace: 'retain-on-failure'}
});
