import {chromium} from '@playwright/test';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const stage = process.argv[2] || 'initial';
if (!['initial', 'final'].includes(stage)) throw new Error('Expected initial or final evidence stage');
const output = resolve(`docs/qa/weddings/${stage}`);
await mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true});
const page = await browser.newPage();
page.setDefaultTimeout(15_000);
const issues = [];
const cancelledPrefetches = [];
page.on('pageerror', error => issues.push({type: 'pageerror', message: error.message}));
page.on('console', message => { if (message.type() === 'error') issues.push({type: 'console', message: message.text()}); });
page.on('requestfailed', request => {
  const item = {type: 'requestfailed', url: request.url(), error: request.failure()?.errorText};
  if (item.error === 'net::ERR_ABORTED' && new URL(item.url).searchParams.has('_rsc')) cancelledPrefetches.push(item);
  else issues.push(item);
});
const cases = [];
try {
  for (const locale of ['en', 'ru', 'sr']) {
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({width, height: 900});
      const response = await page.goto(`http://127.0.0.1:3120/${locale}/weddings-events`, {waitUntil: 'networkidle'});
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.images) img.loading = 'eager';
        await Promise.race([
          Promise.all([...document.images].map(img => img.decode().catch(() => undefined))),
          new Promise(resolve => setTimeout(resolve, 10_000))
        ]);
      });
      const brokenImages = await page.locator('main img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')));
      if (brokenImages.length) issues.push({type: 'image-decode', locale, width, images: brokenImages});
      const textOverflow = await page.locator('main h1, main h2, main h3, main p, main figcaption').evaluateAll(nodes => nodes.filter(node => node.getAttribute('aria-hidden') !== 'true' && node.clientWidth > 2 && node.scrollWidth > node.clientWidth + 1).map(node => ({tag: node.tagName, text: node.textContent, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth})));
      if (textOverflow.length) issues.push({type: 'internal-text-overflow', locale, width, nodes: textOverflow});
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({path: `${output}/${locale}-${width}.png`, fullPage: true});
      const sections = page.locator('main > section');
      const geometry = [];
      for (let index = 0; index < await sections.count(); index++) {
        const section = sections.nth(index);
        const key = await section.getAttribute('data-weddings-section') || await section.getAttribute('id');
        if (locale === 'en') await section.screenshot({path: `${output}/${locale}-${width}-${key}.png`});
        geometry.push({key, box: await section.boundingBox()});
      }
      cases.push({locale, width, status: response.status(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), geometry});
    }
  }
  const buildId = (await readFile('.next/BUILD_ID', 'utf8')).trim();
  const contentHash = createHash('sha256').update(await readFile('src/content/weddings.ts')).digest('hex');
  const sourceFiles = (await readdir('src', {recursive: true, withFileTypes: true})).filter(item => item.isFile()).map(item => resolve(item.parentPath, item.name)).sort();
  const source = createHash('sha256');
  for (const file of sourceFiles) source.update(file.replace(resolve('.') + '/', '')).update(await readFile(file));
  const sourceHash = source.digest('hex');
  await writeFile(`${output}/manifest.json`, JSON.stringify({stage, buildId, contentHash, sourceHash, cases, issues, cancelledPrefetches}, null, 2));
  console.log(JSON.stringify({buildId, cases: cases.length, issues, overflow: cases.filter(item => item.overflow), output}));
} finally {
  await browser.close();
}
