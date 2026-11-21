import {chromium} from 'playwright';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import net from 'node:net';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const qa='/workspace/docs/qa/quality/sanity-home-ready-001/takeover';
const node='/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node';
const env={...process.env,HOME:'/workspace/.local-tools/ola-qa/home',XDG_CACHE_HOME:'/workspace/.local-tools/ola-qa/cache',XDG_CONFIG_HOME:'/workspace/.local-tools/ola-qa/home/config',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'};
const roles=JSON.parse(await readFile(`${qa}/synthetic-roles.json`));let doc=JSON.parse(await readFile(`${qa}/synthetic-document.json`));
let apiCount=0;const api=createServer((req,res)=>{apiCount++;res.setHeader('content-type','application/json');res.end(JSON.stringify({result:doc}));});
const servers=[],logs=[],rows=[],served=[];let browser,failure;
const hash=b=>createHash('sha256').update(b).digest('hex');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const bind=port=>new Promise((resolve,reject)=>{const s=net.createServer().once('error',reject);s.listen(port,'127.0.0.1',()=>s.close(resolve));});
async function start(kind,port){await bind(port);const fixture=kind==='baseline'?'/workspace/.local-tools/ola-qa/sanity-home-fixture':`/workspace/.local-tools/ola-qa/sanity-home-sol-${kind}`;const p=spawn(node,['/workspace/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env});const log=[];p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));servers.push({p,port,kind,log});for(let i=0;i<100;i++){try{const r=await fetch(`http://127.0.0.1:${port}/en`);if(r.ok)return {fixture,port};}catch{}await new Promise(r=>setTimeout(r,200));}throw Error(`start timeout ${kind}`);}
async function load(kind,port,locale,width){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[],failed=[],http=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));page.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
 const intercepted=[];
 if(kind==='synthetic')await page.route('**/_next/image?**',async route=>{
  const outer=new URL(route.request().url());const url=new URL(outer.searchParams.get('url'),`http://127.0.0.1:${port}`);const id=/\/([a-f0-9]{40})-1200x800\.png/.exec(url.pathname)?.[1];if(!id||!roles[id])return route.continue();
  const role=roles[id],rect=url.searchParams.get('rect')?.split(',').map(Number)??[0,0,1200,800];assert(!url.searchParams.has('h'),'pre-crop height');assert(JSON.stringify(rect)===JSON.stringify(role.crop),'editor crop changed');
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#1268a0"/><path d="M0 0L1200 800M0 800L1200 0" stroke="#ffffff" stroke-width="3"/><rect x="${role.x*1200-15}" y="${role.y*800-10}" width="30" height="20" fill="#ffff00"/></svg>`);
  const bytes=await sharp(svg).extract({left:rect[0],top:rect[1],width:rect[2],height:rect[3]}).resize({width:Math.min(1920,Number(outer.searchParams.get('w')))}).png().toBuffer();intercepted.push({id,url:url.href});await route.fulfill({status:200,contentType:'image/png',body:bytes});
 });
 const response=await page.goto(`http://127.0.0.1:${port}/${locale}`,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 const data=await page.evaluate(()=>({lang:document.documentElement.lang,headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(e=>e.textContent),sections:document.querySelectorAll('main>section').length,images:[...document.querySelectorAll('main img')].map(i=>({alt:i.alt,src:i.currentSrc,rect:i.getBoundingClientRect().toJSON(),parent:i.parentElement.getBoundingClientRect().toJSON(),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,position:getComputedStyle(i).objectPosition,transform:getComputedStyle(i).transform,fit:getComputedStyle(i).objectFit,cms:i.hasAttribute('data-cms-image')})),links:[...document.querySelectorAll('main a')].map(e=>({href:e.getAttribute('href'),label:e.textContent,aria:e.getAttribute('aria-label')})),disabled:[...document.querySelectorAll('main [aria-disabled="true"]')].map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth}));
 const result={kind,locale,width,status:response.status(),...data,errors,failed,http,intercepted};
 assert(response.status()===200&&!data.overflow&&data.images.length===13,`page ${kind} ${locale} ${width}`);
 assert(errors.length===0&&failed.length===0&&http.length===0,`browser/network errors ${JSON.stringify({errors,failed,http})}`);
 assert(data.images.every(i=>i.naturalWidth>0), 'decoded images');
 await page.screenshot({path:`${qa}/${kind}-${locale}-${width}.png`,fullPage:true});
 if(kind==='synthetic'){
  assert(data.headings.every(h=>h.startsWith(`SIM ${locale} `)),'localized CMS titles');
  result.pixels=[];
  const images=page.locator('main img');
  for(let n=0;n<await images.count();n++){
   const img=images.nth(n);await img.evaluate(e=>e.scrollIntoView({block:'center',inline:'center',behavior:'instant'}));await page.waitForTimeout(80);
   const observed=await img.evaluate(i=>({src:i.currentSrc,position:getComputedStyle(i).objectPosition,transform:getComputedStyle(i).transform,fit:getComputedStyle(i).objectFit,frame:i.getBoundingClientRect().toJSON(),natural:[i.naturalWidth,i.naturalHeight]}));
   const inner=new URL(new URL(observed.src).searchParams.get('url'));const id=/\/([a-f0-9]{40})-/.exec(inner.pathname)[1],role=roles[id];
   assert(observed.transform==='none'&&observed.fit==='cover','legacy zoom disabled only for CMS');
   const [px,py]=observed.position.split(' ').map(p=>parseFloat(p)/100);const ex=(role.x*1200-120)/1020,ey=(role.y*800-40)/680;
   assert(Math.abs(px-ex)<1e-5&&Math.abs(py-ey)<1e-5,`focal ${role.path}`);
   const scale=Math.max(observed.frame.width/1020,observed.frame.height/680),ox=(observed.frame.width-1020*scale)*px,oy=(observed.frame.height-680*scale)*py;
   const roi={left:(role.x*1200-15-120)*scale+ox,right:(role.x*1200+15-120)*scale+ox,top:(role.y*800-10-40)*scale+oy,bottom:(role.y*800+10-40)*scale+oy};
   assert(roi.left>=-0.1&&roi.right<=observed.frame.width+0.1&&roi.top>=-0.1&&roi.bottom<=observed.frame.height+0.1,`ROI out of frame ${role.path}`);
   const screenshot=await img.screenshot();const {data:rgb,info}=await sharp(screenshot).removeAlpha().raw().toBuffer({resolveWithObject:true});let yellow=0;
   // Test the predicted ROI, not arbitrary page yellow. The approved hero fade
   // can lift blue above 150: detect yellow's channel difference under that tint.
   for(let yy=Math.max(0,Math.floor(roi.top));yy<Math.min(info.height,Math.ceil(roi.bottom));yy++)for(let xx=Math.max(0,Math.floor(roi.left));xx<Math.min(info.width,Math.ceil(roi.right));xx++){
    const j=(yy*info.width+xx)*info.channels;
    if(rgb[j]>180&&rgb[j+1]>170&&rgb[j]-rgb[j+2]>8&&rgb[j+1]-rgb[j+2]>8)yellow++;
   }
   assert(yellow>=4,`no rendered focal ROI pixels ${role.path} ${locale} ${width}: ${yellow}`);
   if(width===360||width===1024)await writeFile(`${qa}/roi-${locale}-${width}-${id.slice(-2)}.png`,screenshot);
   result.pixels.push({id,path:role.path,observed,roi,yellow});
  }
 }
 rows.push(result);await page.close();return result;
}
try{
 await bind(42184);await new Promise(r=>api.listen(42184,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const release=await start('release',42182);const synthetic=await start('synthetic',42183);const baseline=await start('baseline',42185);
 for(const locale of ['en','ru','sr'])for(const width of [360,768,1024,1440]){
  const old=await load('baseline',baseline.port,locale,width);const fresh=await load('release',release.port,locale,width);
  // Canonical local rendering: same content/actions, local sources and all image geometry/crops.
  const normalize=r=>({headings:r.headings,links:r.links,disabled:r.disabled,images:r.images.map(i=>({...i,src:new URL(i.src).pathname+new URL(i.src).search,cms:undefined}))});
  assert(JSON.stringify(normalize(old))===JSON.stringify(normalize(fresh)),`fallback geometry/content changed ${locale} ${width}`);
  const a=await readFile(`${qa}/baseline-${locale}-${width}.png`),b=await readFile(`${qa}/release-${locale}-${width}.png`);
  const pixelsA=await sharp(a).raw().toBuffer(),pixelsB=await sharp(b).raw().toBuffer();assert(pixelsA.equals(pixelsB),`fallback screenshot changed ${locale} ${width}`);
  fresh.baselinePixelExact=true;
  await load('synthetic',synthetic.port,locale,width);
 }
 const ids=new Set(rows.filter(r=>r.kind==='synthetic').flatMap(r=>r.pixels.map(p=>p.id)));assert(ids.size===14,'all fourteen image roles including mobile wedding');
 for(const {kind,fixture,port} of [release,synthetic].map((v,i)=>({...v,kind:i?'synthetic':'release'}))){
  const html=await(await fetch(`http://127.0.0.1:${port}/en`)).text();const buildId=(await readFile(`${fixture}/.next/BUILD_ID`,'utf8')).trim();
  const path=html.match(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+\.js)"/)?.[1];assert(path,'served static asset');const remote=Buffer.from(await(await fetch(`http://127.0.0.1:${port}${path}`)).arrayBuffer());const local=await readFile(`${fixture}/.next/${path.replace('/_next/','')}`);assert(remote.equals(local),'served asset hash mismatch');
  served.push({kind,buildId,asset:path,sha256:hash(remote),bytes:remote.length,htmlBuildIdPresent:html.includes(buildId)});
 }
 // Controlled production ISR/data cache test; synthetic endpoint, unchanged 60s policy.
 const before=await fetch('http://127.0.0.1:42183/en');const beforeText=await before.text();doc.hero.title.en='CACHE-V2 synthetic edited title';
 const started=Date.now();let refreshed=false;const cache=[];
 for(let i=0;i<85;i++){
  const r=await fetch('http://127.0.0.1:42183/en');const text=await r.text();cache.push({elapsedMs:Date.now()-started,cache:r.headers.get('x-nextjs-cache'),policy:r.headers.get('cache-control'),v2:text.includes('CACHE-V2 synthetic edited title'),apiCount});
  if(text.includes('CACHE-V2 synthetic edited title')){refreshed=true;break;}await new Promise(r=>setTimeout(r,1000));
 }
 await writeFile(`${qa}/cache-results.json`,JSON.stringify({synthetic:true,beforeHadV2:beforeText.includes('CACHE-V2'),refreshed,observations:cache},null,2));assert(refreshed,'controlled production cache never refreshed');
} catch(e){failure=e.stack;console.error(failure);}finally{
 if(browser)await browser.close();
 for(const {p,port,kind,log} of servers){if(p.exitCode===null){const exited=new Promise(r=>p.once('exit',r));p.kill('SIGTERM');await exited;}await bind(port);await writeFile(`${qa}/server-${kind}.log`,Buffer.concat(log));logs.push({kind,port,rebind:true});}
 await new Promise(r=>api.close(r));await bind(42184);logs.push({kind:'synthetic-api',port:42184,rebind:true});
 await writeFile(`${qa}/browser-results.json`,JSON.stringify({fixtureNotice:'Synthetic uses local published-document API + browser-only generated images; release/baseline use real unmocked network. No Sanity writes.',rows,served,cleanup:logs,failure},null,2));
}
console.log(JSON.stringify({rows:rows.length,byKind:Object.fromEntries(['baseline','release','synthetic'].map(k=>[k,rows.filter(r=>r.kind===k).length])),roles:[...new Set(rows.filter(r=>r.kind==='synthetic').flatMap(r=>r.pixels.map(p=>p.path)))],served,cleanup:logs,failure},null,2));if(failure)process.exitCode=1;
