import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {root,node,env} from '../../../../scripts/qa/local.mjs';
const out=path.join(root,'docs/qa/quality/interaction-widgets-001'),fixture=path.join(root,'.local-tools/ola-qa/header-fixture-wxM6wf');
const input=JSON.parse(fs.readFileSync(path.join(out,'coverage.json'),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const identity=()=>Object.fromEntries(Object.entries(input.source_hashes).map(([p,v])=>[p,{root:sha(fs.readFileSync(path.join(root,p))),fixture:sha(fs.readFileSync(path.join(fixture,p))),expected:v.source_sha256}]));
const before=identity();assert.ok(Object.values(before).every(v=>v.root===v.expected&&v.fixture===v.expected));assert.equal(fs.readFileSync(path.join(fixture,'.next/BUILD_ID'),'utf8').trim(),'0RKE00M-JxGMYb9sr8we6');
const port=await new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const n=s.address().port;s.close(()=>resolve(n));});});const base=`http://127.0.0.1:${port}`,fd=fs.openSync(path.join(out,'geometry-server.log'),'w');const server=spawn(node,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env,stdio:['ignore',fd,fd]});
const result={buildId:'0RKE00M-JxGMYb9sr8we6',sourceBefore:before,server:{pid:server.pid,port,started:new Date().toISOString()},cases:[],errors:[]};const save=()=>fs.writeFileSync(path.join(out,'geometry-results.json'),JSON.stringify(result,null,2)+'\n');let browser;
const tests=[
 ['/preview/bouquet','gallery','[class*="BouquetDetailGallery_thumbnail_"]'],
 ['/preview/bouquet','preferences','label:has(input[type=radio])'],
 ['/preview/bouquet','supporting','details summary'],
 ['/preview/bouquet','detail-breadcrumb','[class*="BouquetDetailHero_breadcrumb_"] a'],
 ['/contact','faq','[class*="ContactFaq_trigger_"]'],
 ['/contact','contact-breadcrumb','[class*="ContactHero_breadcrumb_"] a'],
 ['/bouquets','selector','[class*="BouquetsInspiration_selector_"]'],
 ['/bouquets','bouquets-breadcrumb','[class*="BouquetsHero_breadcrumb_"] a'],
 ['','home-service','[class*="HomeServices_service_"]'],
 ['','home-mood','[class*="HomeMood_textLink_"]'],
 ['/balloons','balloons-breadcrumb','[class*="BalloonsHeroBlock_breadcrumb_"] a'],
 ['/balloons','balloons-circle','[class*="BalloonsCategoriesBlock_circle_"]'],
 ['/weddings-events','weddings-breadcrumb','[class*="WeddingsHeroBlock_breadcrumb_"] a'],
 ['/weddings-events','weddings-circle','[class*="WeddingsCategoriesBlock_circle_"]'],
];
const sample=loc=>loc.evaluate(e=>{const rect=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};const image=e.querySelector('img'),sib=e.parentElement?.nextElementSibling;const s=getComputedStyle(e);return {visual:rect(e),layout:{width:e.offsetWidth,height:e.offsetHeight,offsetLeft:e.offsetLeft,offsetTop:e.offsetTop},adjacent:sib?rect(sib):null,transform:s.transform,outline:s.outlineStyle,color:s.color,background:s.backgroundColor,disabled:e.matches(':disabled'),image:image?{rect:rect(image),fit:getComputedStyle(image).objectFit,position:getComputedStyle(image).objectPosition,src:image.currentSrc}:null,viewport:{width:innerWidth,height:innerHeight,scrollY},overflow:{width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}};});
try{let r;for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('server exited');try{r=await fetch(base+'/en');if(r.ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,200));}assert.ok(r?.ok);result.server.cwd=fs.readlinkSync(`/proc/${server.pid}/cwd`);result.server.procStat=fs.readFileSync(`/proc/${server.pid}/stat`,'utf8');const html=await r.text(),u=[...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(x=>x[1]).find(x=>x.includes('.css'));const response=await fetch(new URL(u,base)),bytes=Buffer.from(await response.arrayBuffer());assert.deepEqual(bytes,fs.readFileSync(path.join(fixture,'.next',decodeURIComponent(new URL(u,base).pathname).replace('/_next/',''))));result.served={html:sha(html),asset:u,sha256:sha(bytes)};
 browser=await chromium.launch({headless:true,env});result.browser=browser.version();
 for(const locale of ['en','ru','sr'])for(const width of [360,768,1440]){
  const reducedMotion=width===768?'reduce':'no-preference';const c=await browser.newContext({viewport:{width,height:900},reducedMotion}),p=await c.newPage();p.setDefaultTimeout(4500);p.on('pageerror',e=>result.errors.push({locale,width,error:e.message}));let route='!';
  for(const [targetRoute,family,selector] of tests){const row={locale,width,reducedMotion,family,selector};try{if(route!==targetRoute){const response=await p.goto(`${base}/${locale}${targetRoute}`,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);await p.evaluate(()=>document.fonts.ready);route=targetRoute;}const el=p.locator(selector).first();await el.scrollIntoViewIfNeeded();await p.mouse.move(2,2);const initial=await sample(el),box=await el.boundingBox();assert.ok(box&&box.width>0&&box.height>0);await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.waitForTimeout(200);const hover=await sample(el);await p.mouse.down();const press=await sample(el);await p.mouse.move(2,2);await p.mouse.up();await p.waitForTimeout(180);const after=await sample(el);for(const v of [hover,press,after]){assert.deepEqual(v.layout,initial.layout);if(initial.image&&v.image){assert.equal(v.image.fit,initial.image.fit);assert.equal(v.image.position,initial.image.position);}assert.ok(v.overflow.scroll<=v.overflow.width+1);}row.status='pass';row.detail={initial,hover,press,after};}catch(e){row.status='FAIL';row.error=e.stack||String(e);}result.cases.push(row);save();}
  await c.close();
 }
}catch(e){result.errors.push({fatal:e.stack||String(e)});}finally{if(browser)await browser.close();if(server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>{server.once('exit',resolve);setTimeout(resolve,10000).unref();});}fs.closeSync(fd);result.cleanup={pid:server.pid,exitCode:server.exitCode,port,released:await new Promise(resolve=>{const s=net.createServer();s.once('error',()=>resolve(false));s.listen(port,'127.0.0.1',()=>s.close(()=>resolve(true)));})};result.sourceAfter=identity();result.sourceUnchanged=Object.values(result.sourceAfter).every(v=>v.root===v.expected&&v.fixture===v.expected);result.summary={total:result.cases.length,pass:result.cases.filter(x=>x.status==='pass').length,fail:result.cases.filter(x=>x.status==='FAIL').length,contexts:new Set(result.cases.map(x=>`${x.locale}/${x.width}/${x.reducedMotion}`)).size};save();console.log(JSON.stringify({summary:result.summary,errors:result.errors,cleanup:result.cleanup,sourceUnchanged:result.sourceUnchanged},null,2));}
