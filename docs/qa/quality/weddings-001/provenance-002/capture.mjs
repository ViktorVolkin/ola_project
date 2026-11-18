import {chromium} from '/workspace/node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const [phase,dir,fixture]=process.argv.slice(2); fs.mkdirSync(dir,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const browser=await chromium.launch({headless:true}); const results={};
try { for(const locale of ['en','ru','sr']) for(const width of [360,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}); const errors=[], assets=[], pending=[];
 page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`)); page.on('console',m=>{if(m.type()==='error') errors.push(`console: ${m.text()}`)});
 page.on('response',r=>{if(r.status()>=400) errors.push(`HTTP ${r.status()} ${r.url()}`); const u=new URL(r.url()); if(u.origin==='http://127.0.0.1:31877' && u.pathname.startsWith('/_next/static/')) pending.push((async()=>{try {const body=await r.body(); const rel=decodeURIComponent(u.pathname.slice('/_next/'.length)); const file=path.join(fixture,'.next',rel); const disk=fs.readFileSync(file); assets.push({url:r.url(),status:r.status(),at:new Date().toISOString(),emitted_path:'.next/'+rel,served_sha256:sha(body),emitted_sha256:sha(disk),matches:sha(body)===sha(disk)});}catch(e){errors.push('asset witness: '+String(e));}})()); });
 page.on('requestfailed',r=>errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
 const url=`http://127.0.0.1:31877/${locale}/weddings-events`; const response=await page.goto(url,{waitUntil:'networkidle'}); const html=await response.body(); const key=`${locale}-${width}`; fs.writeFileSync(path.join(dir,key+'.html'),html);
 await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
 const images=await page.evaluate(async()=>{await document.fonts.ready; return await Promise.all([...document.images].map(async i=>{let error=null;try{await i.decode()}catch(e){error=String(e)} return {src:i.currentSrc.replace(/^https?:\/\/[^/]+/,''),complete:i.complete,width:i.naturalWidth,height:i.naturalHeight,error}}));});
 await page.screenshot({path:path.join(dir,key+'.png'),fullPage:true,animations:'disabled'});
 const data=await page.locator('main').evaluate(main=>[...main.querySelectorAll('section,h1,h2,h3,p,button,a,img,figure')].map(n=>{const r=n.getBoundingClientRect();const s=getComputedStyle(n);return {tag:n.tagName,id:n.id,aria:n.getAttribute('aria-label'),labelledby:n.getAttribute('aria-labelledby'),alt:n.getAttribute('alt'),text:n.children.length?null:n.textContent,href:n.getAttribute('href'),rect:[r.x,r.y,r.width,r.height],objectPosition:s.objectPosition,src:n.tagName==='IMG'?n.currentSrc.replace(/^https?:\/\/[^/]+/,''):null}}));
 const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})); await Promise.all(pending);
 results[key]={phase,url,at:new Date().toISOString(),html_sha256:sha(html),runtime_witness:'../runtime.json',status:response.status(),errors,images,overflow,data,assets}; await page.close();
} } finally {await browser.close();fs.writeFileSync(path.join(dir,'dom.json'),JSON.stringify(results,null,2)+'\n');}
if(Object.keys(results).length!==9 || Object.values(results).some(x=>x.status!==200||x.errors.length||!x.assets.length||x.assets.some(a=>!a.matches)||x.images.some(i=>i.error||!i.complete||!i.width)||x.overflow.width!==x.overflow.scrollWidth)) process.exitCode=1;
