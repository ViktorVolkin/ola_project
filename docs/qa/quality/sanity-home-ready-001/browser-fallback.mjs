import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const root = '/workspace/docs/qa/quality/sanity-home-ready-001';
const browser = await chromium.launch({headless: true});
const results = [];
try {
  for (const locale of ['en','ru','sr']) for (const width of [360,768,1024,1440]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {if (msg.type() === 'error') errors.push(msg.text());});
    const response = await page.goto(`http://127.0.0.1:42179/${locale}`, {waitUntil:'networkidle', timeout:60000});
    await page.evaluate(async () => {for (const img of document.images) {img.loading='eager';} await Promise.all([...document.images].map(img => img.decode().catch(() => {})));});
    const data = await page.evaluate(() => ({lang: document.documentElement.lang, title: document.querySelector('h1')?.textContent, documentWidth: document.documentElement.scrollWidth, viewport: innerWidth, sections:[...document.querySelectorAll('main section')].map(s=>({label:s.getAttribute('aria-label'), rect: s.getBoundingClientRect().toJSON()})), brokenImages:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.currentSrc), links:[...document.querySelectorAll('main a')].map(a=>a.getAttribute('href'))}));
    await page.screenshot({path:`${root}/fallback-${locale}-${width}.png`,fullPage:true});
    results.push({locale,width,status:response.status(),...data,errors});
    await page.close();
  }
} finally {await browser.close(); await writeFile(`${root}/fallback-results.json`, JSON.stringify(results,null,2));}
console.log(JSON.stringify(results.map(({locale,width,status,documentWidth,viewport,brokenImages,errors})=>({locale,width,status,documentWidth,viewport,brokenImages,errors})),null,2));
if(results.length !== 12 || results.some(r=>r.status!==200 || r.documentWidth>r.viewport || r.brokenImages.length || r.errors.length)) process.exitCode=1;
