import {defineConfig} from '/workspace/node_modules/@playwright/test/index.mjs';
export default defineConfig({
  testDir:'/workspace/tests/e2e', testMatch:['home.spec.ts','locales.spec.ts','navigation.spec.ts','bouquets.spec.ts'],
  outputDir:'/workspace/docs/qa/quality/home-structure-001/test-results', workers:2, reporter:'list',
  projects:[{name:'desktop',use:{viewport:{width:1280,height:800}}},{name:'mobile',use:{viewport:{width:375,height:812}}}],
  use:{baseURL:'http://127.0.0.1:31876',trace:'retain-on-failure'}
});
