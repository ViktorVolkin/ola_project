# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bouquet-detail-gallery.spec.ts >> ru 360: real component interaction and geometry
- Location: tests/e2e/bouquet-detail-gallery.spec.ts:31:9

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "process is not defined",
+ ]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { build } from 'vite';
  3   | import { readFileSync } from 'node:fs';
  4   | import { resolve } from 'node:path';
  5   | import { createHash } from 'node:crypto';
  6   | 
  7   | const names = ['01_bouquet_detail_main.jpg', '02_detail_thumb1.jpg', '03_detail_thumb2.jpg', '04_detail_closeup.jpg'];
  8   | const labels = {
  9   |   en: ['Bouquet gallery', 'Show image', 'Bouquet image'],
  10  |   ru: ['Галерея букета', 'Показать фото', 'Фото букета'],
  11  |   sr: ['Galerija buketa', 'Prikaži sliku', 'Slika buketa'],
  12  | };
  13  | let script = '';
  14  | let css = '';
  15  | 
  16  | test.beforeAll(async () => {
  17  |   const result = await build({ configFile: false, define: { 'process.env.NODE_ENV': JSON.stringify('production') }, logLevel: 'error', build: { write: false, target: 'esnext', minify: false, lib: { entry: resolve('tests/fixtures/bouquet-detail-gallery/entry.tsx'), formats: ['iife'], name: 'GalleryFixture' } } });
  18  |   for (const output of Array.isArray(result) ? result : [result]) {
  19  |     if (!('output' in output)) throw new Error('Unexpected Vite watcher');
  20  |     for (const item of output.output) {
  21  |       if (item.type === 'chunk') script += item.code;
  22  |       else if (item.fileName.endsWith('.css')) css += item.source.toString();
  23  |     }
  24  |   }
  25  |   if (!script || !css) throw new Error('Missing fixture bundle');
  26  |   console.log('fixture bundle SHA256', createHash('sha256').update(script).digest('hex'), 'CSS SHA256', createHash('sha256').update(css).digest('hex'));
  27  | });
  28  | 
  29  | for (const [locale, words] of Object.entries(labels)) {
  30  |   for (const width of [320, 360, 599, 600, 601, 768, 1440]) {
  31  |     test(`${locale} ${width}: real component interaction and geometry`, async ({ page }) => {
  32  |       const errors: string[] = [];
  33  |       page.on('pageerror', error => errors.push(error.message));
  34  |       await page.setViewportSize({ width, height: 1000 });
  35  |       await page.setContent('<!doctype html><html><head></head><body><div id="root"></div><script type="application/json" id="data"></script></body></html>');
  36  |       const images = names.map((name, index) => ({ src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', name)).toString('base64')}`, alt: `${words[2]} ${index + 1}`, thumbnailLabel: `${words[1]} ${index + 1}`, width: 800, height: 800 }));
  37  |       await page.locator('#data').evaluate((el, data) => { el.textContent = JSON.stringify(data); }, { groupLabel: words[0], images });
  38  |       const galleryWidth = width >= 1200 ? 624 : width >= 600 ? 704 : width - 40;
  39  |       await page.addStyleTag({ content: `*{box-sizing:border-box}body{margin:0;padding:0 20px;background:#faf7f2}#root{width:${galleryWidth}px;max-width:100%;margin:auto}${css}` });
  40  |       await page.addScriptTag({ content: script });
  41  |       await page.waitForTimeout(200);
> 42  |       expect(errors).toEqual([]);
      |                      ^ Error: expect(received).toEqual(expected) // deep equality
  43  |       const buttons = page.getByRole('button');
  44  |       const main = page.locator('section > img');
  45  |       await expect(buttons).toHaveCount(4);
  46  |       await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
  47  |       await expect(main).toHaveAttribute('alt', images[0].alt);
  48  |       await main.evaluate((el: HTMLImageElement) => el.decode());
  49  |       if (locale === 'en') await page.screenshot({ path: `docs/qa/bouquet-detail/gallery-001/correction-1/browser-${width}.png` });
  50  |       for (let i = 0; i < 4; i++) {
  51  |         await buttons.nth(i).click();
  52  |         await expect(main).toHaveAttribute('src', images[i].src);
  53  |         await expect(main).toHaveAttribute('alt', images[i].alt);
  54  |         await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true');
  55  |         for (let j = 0; j < 4; j++) if (j !== i) await expect(buttons.nth(j)).toHaveAttribute('aria-pressed', 'false');
  56  |         await main.evaluate((el: HTMLImageElement) => el.decode());
  57  |       }
  58  |       if (locale === 'en' && width === 360) await page.screenshot({ path: 'docs/qa/bouquet-detail/gallery-001/correction-1/browser-alternate.png' });
  59  |       await page.locator('body').click({ position: { x: 2, y: 2 } });
  60  |       await page.keyboard.press('Tab');
  61  |       await expect(buttons.nth(0)).toBeFocused();
  62  |       if (locale === 'en' && width === 360) await page.screenshot({ path: 'docs/qa/bouquet-detail/gallery-001/correction-1/browser-focus.png' });
  63  |       await page.keyboard.press('Enter');
  64  |       await expect(main).toHaveAttribute('alt', images[0].alt);
  65  |       await expect(buttons.nth(0)).toBeFocused();
  66  |       await page.keyboard.press('Tab');
  67  |       await page.keyboard.press('Space');
  68  |       await expect(main).toHaveAttribute('alt', images[1].alt);
  69  |       await expect(buttons.nth(1)).toBeFocused();
  70  |       const bounds = await buttons.evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width, height: r.height }; }));
  71  |       for (let i = 0; i < bounds.length; i++) { expect(bounds[i].width).toBeGreaterThanOrEqual(44); expect(bounds[i].height).toBeGreaterThanOrEqual(44); if (i) expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i - 1].right); }
  72  |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  73  |       expect(page.url()).toBe('about:blank');
  74  |       expect(errors).toEqual([]);
  75  |     });
  76  |   }
  77  | }
  78  | 
  79  | test('continuous intrinsic geometry across viewport and constraint boundaries', async ({ page }) => {
  80  |   await page.setViewportSize({ width: 1440, height: 1000 });
  81  |   await page.setContent('<div id="root"></div><script type="application/json" id="data"></script>');
  82  |   const images = names.map((name, index) => ({ src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', name)).toString('base64')}`, alt: `Image ${index + 1}`, thumbnailLabel: `Show ${index + 1}`, width: 800, height: 800 }));
  83  |   await page.locator('#data').evaluate((el, data) => { el.textContent = JSON.stringify(data); }, { groupLabel: 'Gallery', images });
  84  |   await page.addStyleTag({ content: `*{box-sizing:border-box}body{margin:0}#root{width:320px}${css}` });
  85  |   await page.addScriptTag({ content: script });
  86  |   const samples = await page.evaluate(() => {
  87  |     const root = document.querySelector<HTMLElement>('#root')!;
  88  |     const main = document.querySelector<HTMLElement>('section > img')!;
  89  |     const thumb = document.querySelector<HTMLElement>('button')!;
  90  |     const points = new Set<number>([320, 360, 380, 381, 382, 597, 598, 599, 600, 601, 602, 624, 668, 669, 670, 704, 1440]);
  91  |     for (let width = 320; width <= 1440; width += 8) points.add(width);
  92  |     return [...points].sort((a, b) => a - b).map(width => {
  93  |       root.style.width = `${width}px`;
  94  |       const m = main.getBoundingClientRect(); const t = thumb.getBoundingClientRect();
  95  |       return { width, mainWidth: m.width, mainHeight: m.height, thumbWidth: t.width, thumbHeight: t.height };
  96  |     });
  97  |   });
  98  |   console.log('geometry sweep', JSON.stringify(samples));
  99  |   const viewportSamples = [];
  100 |   for (const width of [599, 600, 601]) {
  101 |     await page.setViewportSize({ width, height: 1000 });
  102 |     viewportSamples.push(await page.evaluate(width => {
  103 |       document.querySelector<HTMLElement>('#root')!.style.width = `${width}px`;
  104 |       const m = document.querySelector<HTMLElement>('section > img')!.getBoundingClientRect();
  105 |       const t = document.querySelector<HTMLElement>('button')!.getBoundingClientRect();
  106 |       return { width, mainWidth: m.width, mainHeight: m.height, thumbWidth: t.width, thumbHeight: t.height };
  107 |     }, width));
  108 |   }
  109 |   console.log('viewport boundary', JSON.stringify(viewportSamples));
  110 |   for (let i = 1; i < viewportSamples.length; i++) {
  111 |     for (const key of ['mainWidth', 'mainHeight', 'thumbWidth', 'thumbHeight'] as const) {
  112 |       expect(Math.abs(viewportSamples[i][key] - viewportSamples[i - 1][key]), `viewport ${key}`).toBeLessThanOrEqual(1.2);
  113 |     }
  114 |   }
  115 |   for (let i = 1; i < samples.length; i++) {
  116 |     const a = samples[i - 1], b = samples[i], delta = b.width - a.width;
  117 |     for (const key of ['mainWidth', 'mainHeight', 'thumbWidth', 'thumbHeight'] as const) {
  118 |       expect(Math.abs(b[key] - a[key]), `${key} at ${a.width}–${b.width}`).toBeLessThanOrEqual(delta * 1.1 + 0.1);
  119 |     }
  120 |   }
  121 |   for (const [width, mw, mh, tw, th] of [[320,320,300,68,60], [624,624,560,144,104], [704,704,560,164,112]]) {
  122 |     const sample = samples.find(s => s.width === width)!;
  123 |     expect(sample.mainWidth).toBeCloseTo(mw, 0); expect(sample.mainHeight).toBeCloseTo(mh, 0);
  124 |     expect(sample.thumbWidth).toBeCloseTo(tw, 0); expect(sample.thumbHeight).toBeCloseTo(th, 0);
  125 |   }
  126 | });
  127 | 
```