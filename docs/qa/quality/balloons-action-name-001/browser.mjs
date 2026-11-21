import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import {getBalloonsContent} from '../../../../src/content/balloons.ts';
import {root,node,env,manifest,diff} from '../../../../scripts/qa/local.mjs';
import {assertServedHtml,shutdownOwned} from '../../../../scripts/qa/reuse-guards.mjs';
const out=path.join(root,'docs/qa/quality/balloons-action-name-001');
const old=path.join(root,'docs/qa/quality/interaction-chrome-001/header-refinement');
const read=n=>JSON.parse(fs.readFileSync(path.join(old,n)));const fixture=read('fixture-inputs.json').fixture;const build=read('build-result.json');const saved=read('served-identity.json');
const sha=b=>createHash('sha256').update(b).digest('hex');const save=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2)+'\n');
const before=manifest();const port=await new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,'127.0.0.1',()=>{const n=s.address().port;s.close(()=>resolve(n));});});
const base=`http://127.0.0.1:${port}`;const fd=fs.openSync(path.join(out,'server.log'),'w');const server=spawn(node,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env,stdio:['ignore',fd,fd]});const stat=fs.readFileSync(`/proc/${server.pid}/stat`,'utf8');const id={pid:server.pid,startTicks:stat.slice(stat.lastIndexOf(')')+2).trim().split(/\s+/)[19],port};let browser;const cases=[];let failures=0;
try {
 let r;for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error('server exited');try{r=await fetch(base+'/en');if(r.ok)break;}catch{}await new Promise(x=>setTimeout(x,200));}assert.ok(r?.ok);const html=await r.text();assertServedHtml(html,build.buildId);const assets=[];for(const expected of saved.assets){const res=await fetch(new URL(expected.url,base));assert.equal(res.status,200);const bytes=Buffer.from(await res.arrayBuffer());assert.equal(bytes.length,expected.size);assert.equal(sha(bytes),expected.sha256);assets.push({url:expected.url,size:bytes.length,sha256:sha(bytes)});}save('served-identity.json',{base,buildId:build.buildId,htmlSha256:sha(html),assets});
 browser=await chromium.launch({headless:true,env});console.log('Chromium',browser.version());
 for(const locale of ['en','ru','sr'])for(const width of [360,390,768,1279,1280,1440]){
  const result={locale,width,buttons:[],errors:[]};let c;
  try{
   const content=getBalloonsContent(locale);const labels=JSON.parse(fs.readFileSync(path.join(root,`src/i18n/messages/balloons/${locale}.json`)));const common=JSON.parse(fs.readFileSync(path.join(root,`src/i18n/messages/${locale}.json`)));
   c=await browser.newContext({viewport:{width,height:900}});const p=await c.newPage();p.on('pageerror',e=>result.errors.push(`pageerror ${e.message}`));p.on('console',m=>{if(m.type()==='error')result.errors.push(`console ${m.text()}`);});p.on('requestfailed',r=>result.errors.push(`request ${r.url()} ${r.failure()?.errorText}`));p.on('response',r=>{if(r.status()>=400)result.errors.push(`HTTP ${r.status()} ${r.url()}`);});const response=await p.goto(`${base}/${locale}/balloons`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   for(const [section,items] of [['categories',content.categories],['personalisation',content.personalisation.extras]]){
    const buttons=p.locator(`[data-balloons-section="${section}"] button`);assert.equal(await buttons.count(),items.length);
    for(const [i,item] of items.entries()){
     const b=buttons.nth(i);const expected=section==='personalisation'&&width<1280?`${labels.enquire} — ${item.title}`:item.title;
     const detail={section,item:item.id,expected,ax:await b.ariaSnapshot(),dom:await b.evaluate(e=>({tag:e.tagName,disabled:e.disabled,subject:e.getAttribute('data-enquiry-subject'),description:e.getAttribute('aria-describedby'),title:e.getAttribute('title'),href:e.getAttribute('href'),children:[...e.querySelectorAll('span')].map(x=>({className:x.className,text:x.textContent,display:getComputedStyle(x).display,clip:getComputedStyle(x).clip,position:getComputedStyle(x).position}))}))};result.buttons.push(detail);
     await expect(b).toHaveAccessibleName(expected,{timeout:2000});await expect(b).toHaveAccessibleDescription(common.Enquiry.unavailable,{timeout:2000});assert.equal(detail.dom.tag,'BUTTON');assert.equal(detail.dom.disabled,true);assert.equal(detail.dom.subject,item.title);assert.equal(detail.dom.href,null);
     if(section==='personalisation'){const compact=detail.dom.children.find(x=>x.className.includes('compactAction'));const desktop=detail.dom.children.find(x=>x.className.includes('desktopAction'));assert.ok(compact&&desktop);assert.equal(compact.display==='none',width>=1280);assert.equal(desktop.display==='none',width<1280);assert.ok((width<1280?compact.text:desktop.text).includes(width<1280?labels.enquire:item.title));}
    }
   }
   assert.deepEqual(result.errors,[]);if(locale==='en'&&[390,1279,1280].includes(width)){await p.locator('[data-balloons-section="personalisation"]').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`en-${width}.png`)});}result.status='pass';console.log('PASS',locale,width,result.buttons.length);
  }catch(e){failures++;result.status='fail';result.error=e.stack;console.log('FAIL',locale,width,e.message);}finally{if(c)await c.close();cases.push(result);save('cases.json',cases);}
 }
}catch(e){failures++;console.error(e.stack);save('fatal.json',{error:e.stack});}finally{if(browser)await browser.close();try{await shutdownOwned({child:server,identity:id,fixture,record:r=>save('server-cleanup.json',r)});}catch(e){failures++;console.error(e.stack);}fs.closeSync(fd);save('root-diff.json',diff(before,manifest()));const summary={groups:cases.length,passed:cases.filter(x=>x.status==='pass').length,failed:cases.filter(x=>x.status==='fail').length,buttonsChecked:cases.reduce((a,x)=>a+x.buttons.length,0),failures};save('summary.json',summary);console.log(summary);}if(failures)process.exitCode=1;
