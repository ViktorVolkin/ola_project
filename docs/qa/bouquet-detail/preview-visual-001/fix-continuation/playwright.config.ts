import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '/workspace/tests/e2e',
  testMatch: ['bouquet-detail-page.spec.ts', 'bouquet-detail-preview.spec.ts'],
  workers: 2,
  reporter: [['list'], ['json', {outputFile: '/workspace/docs/qa/bouquet-detail/preview-visual-001/fix-continuation/results.json'}]],
  outputDir: '/workspace/docs/qa/bouquet-detail/preview-visual-001/fix-continuation/test-results',
  use: {baseURL: 'http://127.0.0.1:3223', browserName: 'chromium'},
});
