import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../../e2e',
  testMatch: 'bouquet-detail-gallery.spec.ts',
  workers: 1,
  use: { browserName: 'chromium', headless: true },
  outputDir: '../../../docs/qa/bouquet-detail/gallery-001/test-results',
});
