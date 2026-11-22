import {defineConfig} from '@playwright/test';
export default defineConfig({testDir: '.', testMatch: 'browser-smoke.spec.ts', reporter: 'list', use: {baseURL: 'http://127.0.0.1:3221', browserName: 'chromium', headless: true}});
