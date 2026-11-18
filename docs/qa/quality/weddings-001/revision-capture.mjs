import {chromium} from '/workspace/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.join('/workspace/docs/qa/quality/weddings-001', process.argv[2]);
fs.mkdirSync(dir, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = {};
try {
  for (const locale of ['en','ru','sr']) for (const width of [360,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
    page.on('console',m=>{if(m.type()==='error') errors.push(`console: ${m.text()}`)});
    page.on('response',r=>{if(r.status()>=400) errors.push(`HTTP ${r.status()} ${r.url()}`)});
    const response=await page.goto(`http://127.0.0.1:31877/${locale}/weddings-events`,{waitUntil:'networkidle'});
    await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
    const images=await page.evaluate(async()=>{await document.fonts.ready; return await Promise.all([...document.images].map(async i=>{let error=null;try {await i.decode()} catch(e){error=String(e)} return {src:i.currentSrc.replace(/^https?:\/\/[^/]+/,''),complete:i.complete,width:i.naturalWidth,height:i.naturalHeight,error}}));});
    await page.screenshot({path:path.join(dir,`${locale}-${width}.png`),fullPage:true,animations:'disabled'});
    const data=await page.locator('main').evaluate(main=>[...main.querySelectorAll('section,h1,h2,h3,p,button,a,img,figure')].map(n=>{const r=n.getBoundingClientRect();const s=getComputedStyle(n);return {tag:n.tagName,id:n.id,aria:n.getAttribute('aria-label'),labelledby:n.getAttribute('aria-labelledby'),alt:n.getAttribute('alt'),text:n.children.length?null:n.textContent,href:n.getAttribute('href'),rect:[r.x,r.y,r.width,r.height],objectPosition:s.objectPosition,src:n.tagName==='IMG'?n.currentSrc.replace(/^https?:\/\/[^/]+/,''):null}}));
    const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    results[`${locale}-${width}`]={status:response.status(),errors,images,overflow,data};
    await page.close();
  }
} finally { await browser.close(); fs.writeFileSync(path.join(dir,'dom.json'),JSON.stringify(results,null,2)+'\n'); }
