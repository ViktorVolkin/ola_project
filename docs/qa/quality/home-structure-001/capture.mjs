import { chromium } from '/workspace/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [phase, dir, fixture, buildId] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive:true});
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const browser = await chromium.launch({headless:true});
const results = {};
try {
  for (const locale of ['en','ru','sr']) for (const width of [360,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:900}, deviceScaleFactor:1, reducedMotion:'reduce'});
    const errors=[], assets=[], pending=[];
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => {if(m.type()==='error') errors.push(`console: ${m.text()}`);});
    page.on('requestfailed', r => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
    page.on('response', r => {
      if (r.status()>=400) errors.push(`HTTP ${r.status()} ${r.url()}`);
      const u=new URL(r.url());
      if (u.origin==='http://127.0.0.1:31876' && u.pathname.startsWith('/_next/static/')) pending.push((async()=>{
        try {const body=await r.body(); const rel=decodeURIComponent(u.pathname.slice('/_next/'.length)); const disk=fs.readFileSync(path.join(fixture,'.next',rel)); assets.push({url:r.url(),status:r.status(),served_sha256:sha(body),emitted_sha256:sha(disk),matches:sha(body)===sha(disk)});} catch(e){errors.push('asset witness: '+String(e));}
      })());
    });
    const key=`${locale}-${width}`;
    const response=await page.goto(`http://127.0.0.1:31876/${locale}`,{waitUntil:'networkidle'});
    const html=await response.body(); fs.writeFileSync(path.join(dir,key+'.html'),html);
    for (let y=0; y<await page.evaluate(()=>document.documentElement.scrollHeight); y+=700) {await page.evaluate(v=>scrollTo(0,v),y); await page.waitForTimeout(180);}
    await page.evaluate(()=>scrollTo(0,0));
    await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));});
    await page.waitForLoadState('networkidle');
    const before=await page.evaluate(()=>({dpr:devicePixelRatio,viewport:[innerWidth,innerHeight],scroll:[scrollX,scrollY],document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],fonts:document.fonts.status,images:[...document.images].map(i=>({src:i.currentSrc.replace(/^https?:\/\/[^/]+/,''),complete:i.complete,width:i.naturalWidth,height:i.naturalHeight}))}));
    const png=await page.screenshot({fullPage:true,animations:'disabled',scale:'css'}); fs.writeFileSync(path.join(dir,key+'.png'),png);
    const data=await page.locator('main').evaluate(main=>[...main.querySelectorAll('section,h1,h2,h3,p,button,a,img,figure')].map(n=>{const r=n.getBoundingClientRect();return {tag:n.tagName,id:n.id,aria:n.getAttribute('aria-label'),labelledby:n.getAttribute('aria-labelledby'),alt:n.getAttribute('alt'),text:n.children.length?null:n.textContent,href:n.getAttribute('href'),rect:[r.x,r.y,r.width,r.height],objectPosition:getComputedStyle(n).objectPosition,src:n.tagName==='IMG'?n.currentSrc.replace(/^https?:\/\/[^/]+/,''):null};}));
    await Promise.all(pending);
    results[key]={phase,buildId,status:response.status(),html_sha256:sha(html),html_contains_buildid:html.includes(Buffer.from(buildId)),png_sha256:sha(png),at:new Date().toISOString(),before,data,errors,assets};
    await page.close();
  }
} finally {await browser.close(); fs.writeFileSync(path.join(dir,'dom.json'),JSON.stringify(results,null,2)+'\n');}
if(Object.keys(results).length!==9 || Object.values(results).some(x=>x.status!==200||!x.html_contains_buildid||!x.assets.length||x.assets.some(a=>!a.matches)||x.before.document[0]!==x.before.viewport[0])) process.exitCode=1;
