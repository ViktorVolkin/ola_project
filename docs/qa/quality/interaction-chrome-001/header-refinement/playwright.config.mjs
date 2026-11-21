import {defineConfig} from '@playwright/test';
import path from 'node:path';
const root=process.cwd();
export default defineConfig({testDir:path.join(root,'tests/e2e'),testMatch:['navigation.spec.ts'],timeout:30000,workers:1,retries:0,reporter:'line',outputDir:path.join(root,'.local-tools/ola-qa/header-focused-results'),use:{baseURL:process.env.OLA_QA_BASE_URL,headless:true,viewport:{width:1440,height:900}}});
