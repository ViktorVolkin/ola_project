import path from 'node:path';
import {fileURLToPath} from 'node:url';
import project from '../../playwright.config.ts';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const baseURL=process.env.OLA_QA_BASE_URL;
if(!baseURL||!/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL)||new URL(baseURL).port==='3100') throw new Error('Requires the task-owned private loopback server, never port3100');
const config = {
  ...project,
  testDir:path.join(root,'tests/e2e'),
  testMatch:['locales.spec.ts','bouquet-detail-preview.spec.ts'],
  grep:/document, metadata and self-hosted fonts|preview path renders the correct h1|SSR HTML returns 200 with noindex/,
  webServer:undefined,
  outputDir:path.join(root,'.local-tools/ola-qa/focused-test-results'),
  reporter:[['line']],
  use:{...project.use,baseURL}
};
export default config;
