import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'/workspace/tests/e2e',testMatch:'bouquet-detail-gallery.spec.ts',workers:1,retries:0,timeout:60000,reporter:'list',outputDir:'/workspace/docs/qa/quality/gallery-swiper-001/gallery-test-results',use:{viewport:{width:360,height:900},trace:'off'}});
