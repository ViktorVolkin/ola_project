import {chromium} from '/workspace/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
(async () => {
  const phase = process.argv[2];
  const dir = path.join(__dirname, phase);
  fs.mkdirSync(dir, {recursive: true});
  const browser = await chromium.launch({headless: true});
  const results = {};
  for (const locale of ['en', 'ru', 'sr']) for (const width of [360, 768, 1440]) {
    const page = await browser.newPage({viewport: {width, height: 900}, deviceScaleFactor: 1});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    const response = await page.goto(`http://127.0.0.1:31877/${locale}/weddings-events`, {waitUntil: 'networkidle'});
    await page.locator('main img').evaluateAll(imgs => imgs.forEach(img => img.loading = 'eager'));
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map(i => i.decode().catch(() => {}))); });
    await page.screenshot({path: path.join(dir, `${locale}-${width}.png`), fullPage: true, animations: 'disabled'});
    const data = await page.locator('main').evaluate(main => [...main.querySelectorAll('section, h1, h2, h3, p, button, a, img, figure')].map(n => { const r=n.getBoundingClientRect(); const s=getComputedStyle(n); return {tag:n.tagName, id:n.id, aria:n.getAttribute('aria-label'), labelledby:n.getAttribute('aria-labelledby'), alt:n.getAttribute('alt'), text:n.children.length ? null : n.textContent, href:n.getAttribute('href'), rect:[r.x,r.y,r.width,r.height], objectPosition:s.objectPosition, src:n.tagName==='IMG'?n.currentSrc.replace(/^https?:\/\/[^/]+/,''):null}; }));
    results[`${locale}-${width}`] = {status: response.status(), errors, data};
    await page.close();
  }
  fs.writeFileSync(path.join(dir, 'dom.json'), JSON.stringify(results,null,2));
  await browser.close();
})().catch(e => {console.error(e); process.exit(1)});
