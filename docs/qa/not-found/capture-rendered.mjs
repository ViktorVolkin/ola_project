import {chromium} from '@playwright/test';
import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const output = 'docs/qa/not-found/rendered';
mkdirSync(output, {recursive: true});
const reference = JSON.parse(readFileSync('docs/design/not-found-reference.json', 'utf8'));
function walk(path) {
  return readdirSync(path, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? walk(join(path, entry.name)) : /\.(tsx?|css|json)$/.test(entry.name) ? [join(path, entry.name)] : []);
}
function identity() {
  const files = [...walk('src'), ...walk('tests'), 'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts', 'playwright.config.ts', 'vitest.config.mts', 'docs/design/not-found-reference.json', 'docs/qa/not-found/capture-rendered.mjs'].sort();
  const fileHashes = Object.fromEntries(files.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]));
  return {buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), fileCount: files.length, sourceHash: createHash('sha256').update(JSON.stringify(fileHashes)).digest('hex'), fileHashes};
}
const source = identity();
const browser = await chromium.launch({headless: true});
const records = [];
try {
  for (const locale of ['en', 'ru', 'sr']) {
    const context = await browser.newContext({reducedMotion: 'reduce'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [name, frame] of Object.entries(reference.frames)) {
      const [width, height] = frame.viewport;
      await page.setViewportSize({width, height});
      const started = performance.now();
      const response = await page.goto(`http://127.0.0.1:3120/${locale}/missing/visual-qa`, {waitUntil: 'domcontentloaded', timeout: 75000});
      await page.locator('[data-404-artwork]').waitFor({state: 'visible', timeout: 75000});
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const rect = node => { const b = node.getBoundingClientRect(); return {x: b.x, y: b.y, width: b.width, height: b.height}; };
        const h1 = document.querySelector('main h1');
        const art = document.querySelector('[data-404-artwork]');
        const computed = node => {const c = getComputedStyle(node); return {fontSize: c.fontSize, lineHeight: c.lineHeight, fontWeight: c.fontWeight, color: c.color, opacity: c.opacity, animation: c.animationName};};
        return {
          language: document.documentElement.lang,
          header: rect(document.querySelector('header')),
          artwork: rect(art),
          content: rect(h1.parentElement.parentElement),
          heading: {text: h1.textContent, ...rect(h1), ...computed(h1)},
          rings: Array.from(document.querySelectorAll('[data-404-ring]'), node => ({...rect(node), ...computed(node)})),
          centre: rect(document.querySelector('[data-404-centre]')),
          number: {...rect(document.querySelector('[data-404-number]')), ...computed(document.querySelector('[data-404-number]'))},
          signature: {text: document.querySelector('[data-404-signature]').textContent, ...rect(document.querySelector('[data-404-signature]')), ...computed(document.querySelector('[data-404-signature]'))},
          actions: Array.from(document.querySelectorAll('main a'), node => ({text: node.textContent, href: node.getAttribute('href'), ...rect(node)})),
          footerCount: document.querySelectorAll('footer').length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          motion: art.dataset.motion
        };
      });
      const artworkDelta = Object.fromEntries(['x', 'y', 'width', 'height'].map((key, index) => [key, geometry.artwork[key] - frame.artworkPageBox[index]]));
      const contentDelta = locale === 'en' ? Object.fromEntries(['x', 'y', 'width', 'height'].map((key, index) => [key, geometry.content[key] - frame.englishContentPageBox[index]])) : null;
      const screenshot = `${output}/${locale}-${width}x${height}.png`;
      await page.screenshot({path: screenshot, fullPage: true});
      const record = {locale, frame: name, width, height, status: response.status(), elapsedMs: Math.round(performance.now() - started), screenshot, geometry, artworkDelta, englishContentDelta: contentDelta, errors: [...errors]};
      records.push(record);
      writeFileSync(`${output}/geometry.json`, JSON.stringify(records, null, 2) + '\n');
      console.log(JSON.stringify({locale, width, status: record.status, artworkDelta, contentDelta, overflow: geometry.overflow, errors}));
    }
    await context.close();
  }
  const noJs = await browser.newContext({javaScriptEnabled: false, viewport: {width: 360, height: 800}});
  const page = await noJs.newPage();
  const response = await page.goto('http://127.0.0.1:3120/en/missing/no-js');
  const noJsResult = {status: response.status(), mainCount: await page.locator('main').count(), artworkCount: await page.locator('[data-404-artwork]').count(), language: await page.locator('html').getAttribute('lang'), errorShell: await page.locator('html').getAttribute('id') === '__next_error__', screenshot: `${output}/known-failure-no-js.png`};
  await page.screenshot({path: noJsResult.screenshot});
  await noJs.close();
  const after = identity();
  if (source.sourceHash !== after.sourceHash || source.buildId !== after.buildId) throw new Error('Source/build changed during capture; do not accept this evidence');
  const manifest = {...source, screenshots: records.length, records: 'geometry.json', noJavaScript: noJsResult, limitations: ['JS-enabled rendered geometry only; no-JS deliberately records the unresolved Next16.4.3 empty error shell', 'Accepted captured design input, not fresh live Figma or owner acceptance']};
  writeFileSync(`${output}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({screenshots: records.length, sourceUnchanged: true, sourceHash: source.sourceHash, buildId: source.buildId, noJsResult}));
} finally {
  await browser.close();
}
