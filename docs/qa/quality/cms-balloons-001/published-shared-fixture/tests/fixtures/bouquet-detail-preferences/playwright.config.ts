import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../../e2e',
  testMatch: 'bouquet-detail-preferences.spec.ts',
  workers: 1,
  use: { browserName: 'chromium', headless: true },
  outputDir: '../../../docs/qa/bouquet-detail/preferences-001/test-results',
});