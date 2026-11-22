import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'../../e2e', fullyParallel:true, workers:2, retries:0, reporter:'list', timeout:60000, projects:[{name:'desktop',use:{viewport:{width:1280,height:800}}},{name:'mobile',use:{viewport:{width:375,height:812}}}]});
