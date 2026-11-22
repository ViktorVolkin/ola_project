import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {writeFile, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '/workspace/.local-tools/ola-qa/unified-content-source-001/locked-install/node_modules/playwright-core/index.mjs';
const q='/workspace/docs/qa/quality/cms-weddings-001', node='/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node', next='/workspace/.local-tools/ola-qa/unified-content-source-001/locked-install/node_modules/next/dist/bin/next';
const env={SWC_NATIVE_BINDING_CACHE:'/ola-native-cache',PATH:'/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin',HOME:'/workspace/.local-tools/ola-qa/home',XDG_CACHE_HOME:'/workspace/.local-tools/ola-qa/cache',NODE_DISABLE_COMPILE_CACHE:'1',NEXT_TELEMETRY_DISABLED:'1',CONTENT_SOURCE:'default'};
const result={builds:{},captures:[],comparisons:[],cleanup:[],errors:[]}; const children=[]; let browser;
const hash=b=>createHash('sha256').update(b).digest('hex'), pause=n=>new Promise(r=>setTimeout(r,n));
async function freePort(){const s=createServer();await new Promise((r,j)=>{s.once('error',j);s.listen(0,'127.0.0.1',r)});const port=s.address().port;await new Promise(r=>s.close(r));return port;}
async function stop(p){if(p.stopped)return;const done=new Promise(r=>p.child.exitCode!==null||p.child.signalCode!==null?r():p.child.once('exit',r));if(p.child.exitCode===null&&p.child.signalCode===null)p.child.kill('SIGTERM');await done;p.stopped=true;await writeFile(`${q}/${p.name}-server.log`,Buffer.concat(p.log));const s=createServer();await new Promise((r,j)=>{s.once('error',j);s.listen(p.port,'127.0.0.1',r)});await new Promise(r=>s.close(r));result.cleanup.push({name:p.name,pid:p.child.pid,exit:p.child.exitCode,signal:p.child.signalCode,port:p.port,rebound:true});}
async function start(name){const dir=`${q}/${name}`,port=await freePort(),child=spawn(node,[next,'start','-H','127.0.0.1','-p',String(port)],{cwd:dir,env}),log=[];child.stdout.on('data',b=>log.push(b));child.stderr.on('data',b=>log.push(b));const p={name,port,child,log};children.push(p);result.builds[name]=(await readFile(`${dir}/.next/BUILD_ID`,'utf8')).trim();for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error(`${name} exited ${child.exitCode}`);try{if((await fetch(`http://127.0.0.1:${port}/en/weddings-events`)).ok)return p}catch{}await pause(200)}throw Error(`${name} startup timeout`)}
try{
 browser=await chromium.launch({headless:true});const sets={};
 for(const name of ['baseline','fixture']){
  const server=await start(name),ctx=await browser.newContext({reducedMotion:'reduce'}),page=await ctx.newPage();let external=0;page.on('request',r=>{if(r.url().includes('zhn2ddaj.api.sanity.io'))external++});page.on('pageerror',e=>result.errors.push(`${name}: ${e}`));sets[name]=[];
  for(const locale of ['en','ru','sr'])for(const width of [360,768,1440]){
   await page.setViewportSize({width,height:900});const response=await page.goto(`http://127.0.0.1:${server.port}/${locale}/weddings-events`,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,20))}await Promise.race([Promise.all([...document.querySelectorAll('main img')].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);scrollTo(0,0)});await pause(400);
   const dom=await page.evaluate(()=>{const rect=n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height]};return {lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth,text:document.querySelector('main').innerText,headings:[...document.querySelectorAll('main h1,main h2')].map(n=>({text:n.textContent,rect:rect(n)})),links:[...document.querySelectorAll('main a,main button')].map(n=>({text:n.textContent,href:n.getAttribute('href'),rect:rect(n)})),images:[...document.querySelectorAll('main img')].map(n=>({alt:n.alt,src:n.getAttribute('src'),rect:rect(n),position:getComputedStyle(n).objectPosition})),annotations:document.querySelectorAll('main [data-sanity]').length,status:document.querySelectorAll('[data-weddings-preview]').length}});
   const png=await page.screenshot({path:`${q}/${name}-${locale}-${width}.png`,fullPage:true,animations:'disabled'});const item={name,locale,width,http:response.status(),dom,pngHash:hash(png)};result.captures.push(item);sets[name].push(item);if(item.http!==200||dom.overflow||dom.annotations||dom.status)throw Error(`public boundary ${name}/${locale}/${width}`);
  }
  if(external)throw Error(`unexpected browser CMS requests ${external}`);await ctx.close();await stop(server);
 }
 result.comparisons=sets.baseline.map((a,i)=>({locale:a.locale,width:a.width,domEqual:JSON.stringify(a.dom)===JSON.stringify(sets.fixture[i].dom),pngEqual:a.pngHash===sets.fixture[i].pngHash}));
 if(result.comparisons.some(c=>!c.domEqual||!c.pngEqual))throw Error('baseline mismatch');
 if(result.errors.length)throw Error('page errors');
}catch(e){result.failure=String(e);process.exitCode=1}finally{if(browser)await browser.close();for(const p of children)await stop(p);await writeFile(`${q}/browser-results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({builds:result.builds,comparisons:result.comparisons,errors:result.errors,cleanup:result.cleanup,failure:result.failure},null,2));}
