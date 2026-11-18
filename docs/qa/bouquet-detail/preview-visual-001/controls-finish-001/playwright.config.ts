import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: '.', testMatch: ['controls.spec.ts','page.spec.ts','preview.spec.ts'], workers: 1,
 reporter: [['list'], ['json', { outputFile: '/workspace/docs/qa/bouquet-detail/preview-visual-001/controls-finish-001/results.json' }]],
 outputDir: '/workspace/docs/qa/bouquet-detail/preview-visual-001/controls-finish-001/test-results',
 use: {baseURL: 'http://127.0.0.1:3223', browserName:'chromium'},
 webServer: {command: 'npm run start -- --hostname 127.0.0.1 --port 3223', cwd: '/tmp/ola-controls-finish-001', url: 'http://127.0.0.1:3223/en/preview/bouquet', reuseExistingServer: false, timeout: 120000}
});
