import { test, expect } from '@playwright/test';
import { build } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const names = ['01_bouquet_detail_main.jpg', '02_detail_thumb1.jpg', '03_detail_thumb2.jpg', '04_detail_closeup.jpg'];
const labels = {
  en: ['Bouquet gallery', 'Show image', 'Bouquet image'],
  ru: ['Галерея букета', 'Показать фото', 'Фото букета'],
  sr: ['Galerija buketa', 'Prikaži sliku', 'Slika buketa'],
};
let script = '';
let css = '';

test.beforeAll(async () => {
  const result = await build({ configFile: false, define: { 'process.env.NODE_ENV': JSON.stringify('production') }, logLevel: 'error', build: { write: false, target: 'esnext', minify: false, lib: { entry: resolve('tests/fixtures/bouquet-detail-gallery/entry.tsx'), formats: ['iife'], name: 'GalleryFixture' } } });
  for (const output of Array.isArray(result) ? result : [result]) {
    if (!('output' in output)) throw new Error('Unexpected Vite watcher');
    for (const item of output.output) {
      if (item.type === 'chunk') script += item.code;
      else if (item.fileName.endsWith('.css')) css += item.source.toString();
    }
  }
  if (!script || !css) throw new Error('Missing fixture bundle');
  console.log('fixture bundle SHA256', createHash('sha256').update(script).digest('hex'), 'CSS SHA256', createHash('sha256').update(css).digest('hex'));
});

for (const [locale, words] of Object.entries(labels)) {
  for (const width of [320, 360, 599, 600, 601, 768, 1440]) {
    test(`${locale} ${width}: real component interaction and geometry`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.setContent('<!doctype html><html><head></head><body><div id="root"></div><script type="application/json" id="data"></script></body></html>');
      const images = names.map((name, index) => ({ src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', name)).toString('base64')}`, alt: `${words[2]} ${index + 1}`, thumbnailLabel: `${words[1]} ${index + 1}`, width: 800, height: 800 }));
      await page.locator('#data').evaluate((el, data) => { el.textContent = JSON.stringify(data); }, { groupLabel: words[0], images });
      const galleryWidth = width >= 1200 ? 624 : width >= 600 ? 704 : width - 40;
      await page.addStyleTag({ content: `*{box-sizing:border-box}body{margin:0;padding:0 20px;background:#faf7f2}#root{width:${galleryWidth}px;max-width:100%;margin:auto}${css}` });
      await page.addScriptTag({ content: script });
      await page.waitForTimeout(200);
      expect(errors).toEqual([]);
      const buttons = page.getByRole('button');
      const main = page.locator('section > img');
      await expect(buttons).toHaveCount(4);
      await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(main).toHaveAttribute('alt', images[0].alt);
      await main.evaluate((el: HTMLImageElement) => el.decode());
      if (locale === 'en') await page.screenshot({ path: `docs/qa/bouquet-detail/gallery-001/correction-1/browser-${width}.png` });
      for (let i = 0; i < 4; i++) {
        await buttons.nth(i).click();
        await expect(main).toHaveAttribute('src', images[i].src);
        await expect(main).toHaveAttribute('alt', images[i].alt);
        await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true');
        for (let j = 0; j < 4; j++) if (j !== i) await expect(buttons.nth(j)).toHaveAttribute('aria-pressed', 'false');
        await main.evaluate((el: HTMLImageElement) => el.decode());
      }
      if (locale === 'en' && width === 360) await page.screenshot({ path: 'docs/qa/bouquet-detail/gallery-001/correction-1/browser-alternate.png' });
      await page.locator('body').click({ position: { x: 2, y: 2 } });
      await page.keyboard.press('Tab');
      await expect(buttons.nth(0)).toBeFocused();
      if (locale === 'en' && width === 360) await page.screenshot({ path: 'docs/qa/bouquet-detail/gallery-001/correction-1/browser-focus.png' });
      await page.keyboard.press('Enter');
      await expect(main).toHaveAttribute('alt', images[0].alt);
      await expect(buttons.nth(0)).toBeFocused();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      await expect(main).toHaveAttribute('alt', images[1].alt);
      await expect(buttons.nth(1)).toBeFocused();
      const bounds = await buttons.evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, width: r.width, height: r.height }; }));
      for (let i = 0; i < bounds.length; i++) { expect(bounds[i].width).toBeGreaterThanOrEqual(44); expect(bounds[i].height).toBeGreaterThanOrEqual(44); if (i) expect(bounds[i].left).toBeGreaterThanOrEqual(bounds[i - 1].right); }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(page.url()).toBe('about:blank');
      expect(errors).toEqual([]);
    });
  }
}

test('continuous intrinsic geometry across viewport and constraint boundaries', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.setContent('<div id="root"></div><script type="application/json" id="data"></script>');
  const images = names.map((name, index) => ({ src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', name)).toString('base64')}`, alt: `Image ${index + 1}`, thumbnailLabel: `Show ${index + 1}`, width: 800, height: 800 }));
  await page.locator('#data').evaluate((el, data) => { el.textContent = JSON.stringify(data); }, { groupLabel: 'Gallery', images });
  await page.addStyleTag({ content: `*{box-sizing:border-box}body{margin:0}#root{width:320px}${css}` });
  await page.addScriptTag({ content: script });
  const samples = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('#root')!;
    const main = document.querySelector<HTMLElement>('section > img')!;
    const thumb = document.querySelector<HTMLElement>('button')!;
    const points = new Set<number>([320, 360, 380, 381, 382, 597, 598, 599, 600, 601, 602, 624, 668, 669, 670, 704, 1440]);
    for (let width = 320; width <= 1440; width += 8) points.add(width);
    return [...points].sort((a, b) => a - b).map(width => {
      root.style.width = `${width}px`;
      const m = main.getBoundingClientRect(); const t = thumb.getBoundingClientRect();
      return { width, mainWidth: m.width, mainHeight: m.height, thumbWidth: t.width, thumbHeight: t.height };
    });
  });
  console.log('geometry sweep', JSON.stringify(samples));
  const viewportSamples = [];
  for (const width of [599, 600, 601]) {
    await page.setViewportSize({ width, height: 1000 });
    viewportSamples.push(await page.evaluate(width => {
      document.querySelector<HTMLElement>('#root')!.style.width = `${width}px`;
      const m = document.querySelector<HTMLElement>('section > img')!.getBoundingClientRect();
      const t = document.querySelector<HTMLElement>('button')!.getBoundingClientRect();
      return { width, mainWidth: m.width, mainHeight: m.height, thumbWidth: t.width, thumbHeight: t.height };
    }, width));
  }
  console.log('viewport boundary', JSON.stringify(viewportSamples));
  for (let i = 1; i < viewportSamples.length; i++) {
    for (const key of ['mainWidth', 'mainHeight', 'thumbWidth', 'thumbHeight'] as const) {
      expect(Math.abs(viewportSamples[i][key] - viewportSamples[i - 1][key]), `viewport ${key}`).toBeLessThanOrEqual(1.2);
    }
  }
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i], delta = b.width - a.width;
    for (const key of ['mainWidth', 'mainHeight', 'thumbWidth', 'thumbHeight'] as const) {
      expect(Math.abs(b[key] - a[key]), `${key} at ${a.width}–${b.width}`).toBeLessThanOrEqual(delta * 1.1 + 0.1);
    }
  }
  for (const [width, mw, mh, tw, th] of [[320,320,300,68,60], [624,624,560,144,104], [704,704,560,164,112]]) {
    const sample = samples.find(s => s.width === width)!;
    expect(sample.mainWidth).toBeCloseTo(mw, 0); expect(sample.mainHeight).toBeCloseTo(mh, 0);
    expect(sample.thumbWidth).toBeCloseTo(tw, 0); expect(sample.thumbHeight).toBeCloseTo(th, 0);
  }
});
