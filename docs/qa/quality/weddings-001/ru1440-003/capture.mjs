import { chromium } from '/workspace/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [dir, fixture, buildId] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const write = (name, data) => fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2) + '\n');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const events = [], responses = [], pending = [], errors = [];
const stamp = () => new Date().toISOString();
page.on('request', r => { if (r.resourceType() === 'image') events.push({ kind: 'request', url: r.url(), at: stamp() }); });
page.on('requestfinished', r => { if (r.resourceType() === 'image') events.push({ kind: 'finished', url: r.url(), at: stamp() }); });
page.on('requestfailed', r => { events.push({ kind: 'failed', url: r.url(), at: stamp(), error: r.failure() }); });
page.on('pageerror', e => errors.push(String(e)));
page.on('response', r => {
  const u = new URL(r.url());
  if (r.request().resourceType() !== 'image' && !u.pathname.startsWith('/_next/static/')) return;
  const at = stamp();
  pending.push((async () => {
    try {
      const body = await r.body(); const digest = hash(body);
      const entry = { url: r.url(), status: r.status(), contentType: r.headers()['content-type'], at, sha256: digest, bytes: body.length, type: r.request().resourceType() };
      if (entry.type === 'image') {
        fs.mkdirSync(path.join(dir, 'bodies'), { recursive: true });
        fs.writeFileSync(path.join(dir, 'bodies', digest), body);
        try { const decoded = await sharp(body).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); entry.decoded = { width: decoded.info.width, height: decoded.info.height, channels: decoded.info.channels, rgbaSha256: hash(decoded.data) }; } catch (e) { entry.decodeError = String(e); }
      } else {
        const file = path.join(fixture, '.next', decodeURIComponent(u.pathname.slice('/_next/'.length)));
        entry.emittedSha256 = hash(fs.readFileSync(file)); entry.matches = entry.sha256 === entry.emittedSha256;
      }
      responses.push(entry);
    } catch (e) { errors.push('response body ' + r.url() + ': ' + String(e)); }
  })());
});
try {
  const response = await page.goto('http://127.0.0.1:31877/ru/weddings-events', { waitUntil: 'networkidle' });
  const html = await response.body(); fs.writeFileSync(path.join(dir, 'response.html'), html);
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(180); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => null))); });
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(600);
  async function snapshot() {
    return page.evaluate(async () => {
      const rect = n => { const r = n.getBoundingClientRect(); return { viewport: [r.x, r.y, r.width, r.height], document: [r.x + scrollX, r.y + scrollY, r.width, r.height] }; };
      const style = n => { const s = getComputedStyle(n); return Object.fromEntries(['display','position','width','height','object-fit','object-position','transform','overflow','opacity','visibility','border-radius'].map(k => [k, s.getPropertyValue(k)])); };
      const imgs = await Promise.all([...document.images].map(async n => {
        let canvas;
        try { const c = document.createElement('canvas'); c.width = n.naturalWidth; c.height = n.naturalHeight; const x = c.getContext('2d'); x.drawImage(n, 0, 0); const pixels = x.getImageData(0, 0, c.width, c.height).data; const digest = await crypto.subtle.digest('SHA-256', pixels); canvas = { method: 'drawImage at naturalWidth/naturalHeight; getImageData RGBA SHA-256', width: c.width, height: c.height, sha256: [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2,'0')).join('') }; } catch (e) { canvas = { error: String(e) }; }
        return { currentSrc: n.currentSrc, complete: n.complete, naturalWidth: n.naturalWidth, naturalHeight: n.naturalHeight, attrs: Object.fromEntries([...n.attributes].map(a => [a.name,a.value])), rect: rect(n), style: style(n), parent: n.parentElement ? { rect: rect(n.parentElement), style: style(n.parentElement), attrs: Object.fromEntries([...n.parentElement.attributes].map(a => [a.name,a.value])) } : null, canvas };
      }));
      const main = [...document.querySelectorAll('main section,main h1,main h2,main h3,main p,main button,main a,main img,main figure')].map(n => ({ tag: n.tagName, id: n.id, aria: n.getAttribute('aria-label'), labelledby: n.getAttribute('aria-labelledby'), alt: n.getAttribute('alt'), text: n.children.length ? null : n.textContent, href: n.getAttribute('href'), rect: rect(n), objectPosition: getComputedStyle(n).objectPosition, src: n.tagName === 'IMG' ? n.currentSrc : null }));
      return { time: new Date().toISOString(), dpr: devicePixelRatio, viewport: [innerWidth,innerHeight], visualViewport: { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, offsetTop: visualViewport.offsetTop, pageLeft: visualViewport.pageLeft, pageTop: visualViewport.pageTop }, scroll: [scrollX,scrollY], document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, fonts: document.fonts.status, imgs, main };
    });
  }
  const frames = [];
  for (let attempt = 1; attempt <= 2; attempt++) {
    const pre = await snapshot(); const start = stamp(); const begin = events.length;
    const png = await page.screenshot({ fullPage: true, animations: 'disabled', scale: 'css' }); const end = stamp();
    const post = await snapshot(); const stop = events.length; const info = await sharp(png).metadata();
    fs.writeFileSync(path.join(dir, `frame-${attempt}.png`), png);
    const identity = x => JSON.stringify({ dpr: x.dpr, viewport: x.viewport, visualViewport: x.visualViewport, scroll: x.scroll, document: x.document, imgs: x.imgs, main: x.main });
    const transitions = events.slice(begin, stop);
    const stable = identity(pre) === identity(post) && transitions.length === 0;
    frames.push({ attempt, pre, post, screenshot: { start, end, sha256: hash(png), bytes: png.length, width: info.width, height: info.height, scale: 'css', fullPage: true, origin: 'document (0,0)', cssToPng: [info.width / pre.document.width, info.height / pre.document.height] }, transitions, stable });
    if (stable) break;
    await page.waitForLoadState('networkidle'); await page.waitForTimeout(800);
  }
  await Promise.all(pending);
  const result = { buildId, status: response.status(), htmlSha256: hash(html), htmlContainsBuildId: html.includes(Buffer.from(buildId)), frames, events, responses, errors, canvasLimit: 'Canvas samples current decoded image at snapshot time, not compositor paint; natural dimensions may differ from encoded dimensions; color management applies.' };
  write('witness.json', result);
} finally { await browser.close(); }
