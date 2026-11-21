import {chromium} from 'playwright';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import net from 'node:net';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/cms-r1-correction`,old=`${root}/docs/qa/quality/sanity-home-ready-001/takeover`;
const node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`,env={...process.env,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'};
const assert=(ok,msg)=>{if(!ok)throw Error(msg);},hash=b=>createHash('sha256').update(b).digest('hex');
const bind=port=>new Promise((resolve,reject)=>{const s=net.createServer().once('error',reject);s.listen(port,'127.0.0.1',()=>s.close(resolve));});
const roles=JSON.parse(await readFile(`${old}/synthetic-roles.json`)),doc=JSON.parse(await readFile(`${old}/synthetic-document.json`)),saved=JSON.parse(await readFile(`${old}/browser-results.json`));
const api=createServer((req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({result:doc}));});
const servers=[],rows=[],assets=[],cleanup=[];let browser,failure;
async function start(kind,port){await bind(port);const fixture=`${root}/.local-tools/ola-qa/sanity-home-cms-r1-${kind}`,p=spawn(node,[`${root}/node_modules/next/dist/bin/next`,'start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env});const log=[];p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));servers.push({kind,port,p,log});for(let i=0;i<100;i++){try{if((await fetch(`http://127.0.0.1:${port}/en`)).ok)return {kind,port,fixture};}catch{}await new Promise(r=>setTimeout(r,200));}throw Error(`start timeout ${kind}`);}
try{
 await bind(42194);await new Promise(r=>api.listen(42194,'127.0.0.1',r));browser=await chromium.launch({headless:true});
 const fixtures=[await start('release',42192),await start('synthetic',42193)];
 for(const {kind,port,fixture} of fixtures){
  for(const [locale,width] of [['en',360],['ru',1024],['sr',1440]]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[],failed=[],http=[],mocked=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));page.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
   if(kind==='synthetic')await page.route('**/_next/image?**',async route=>{
    const outer=new URL(route.request().url()),inner=new URL(outer.searchParams.get('url'),`http://127.0.0.1:${port}`),id=/\/([a-f0-9]{40})-1200x800\.png/.exec(inner.pathname)?.[1];if(!id||!roles[id])return route.continue();
    const role=roles[id],rect=inner.searchParams.get('rect')?.split(',').map(Number)??[0,0,1200,800];assert(!inner.searchParams.has('h')&&JSON.stringify(rect)===JSON.stringify(role.crop),'crop output');
    const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#1268a0"/><path d="M0 0L1200 800M0 800L1200 0" stroke="#ffffff" stroke-width="3"/><rect x="${role.x*1200-15}" y="${role.y*800-10}" width="30" height="20" fill="#ffff00"/></svg>`);
    const bytes=await sharp(svg).extract({left:rect[0],top:rect[1],width:rect[2],height:rect[3]}).resize({width:Math.min(1920,Number(outer.searchParams.get('w')))}).png().toBuffer();mocked.push(inner.href);await route.fulfill({status:200,contentType:'image/png',body:bytes});
   });
   const response=await page.goto(`http://127.0.0.1:${port}/${locale}`,{waitUntil:'networkidle'});await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
   const data=await page.evaluate(()=>({headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(e=>e.textContent),images:[...document.querySelectorAll('main img')].map(i=>({alt:i.alt,src:i.currentSrc,rect:i.getBoundingClientRect().toJSON(),parent:i.parentElement.getBoundingClientRect().toJSON(),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,position:getComputedStyle(i).objectPosition,transform:getComputedStyle(i).transform,fit:getComputedStyle(i).objectFit,cms:i.hasAttribute('data-cms-image')})),links:[...document.querySelectorAll('main a')].map(e=>({href:e.getAttribute('href'),label:e.textContent,aria:e.getAttribute('aria-label')})),disabled:[...document.querySelectorAll('main [aria-disabled="true"]')].map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth}));
   assert(response.status()===200&&!data.overflow&&data.images.length===13&&data.images.every(i=>i.naturalWidth>0),'page status/images/overflow');assert(!errors.length&&!failed.length&&!http.length,`browser/network errors ${JSON.stringify({errors,failed,http})}`);
   const prior=saved.rows.find(r=>r.kind===kind&&r.locale===locale&&r.width===width),normalize=r=>({headings:r.headings,links:r.links,disabled:r.disabled,images:r.images.map(i=>({...i,src:new URL(i.src).pathname+new URL(i.src).search}))});assert(JSON.stringify(normalize(data))===JSON.stringify(normalize(prior)),`retained valid render changed ${kind} ${locale} ${width}`);
   const screenshot=await page.screenshot({path:`${qa}/${kind}-${locale}-${width}.png`,fullPage:true}),priorPixels=await sharp(await readFile(`${old}/${kind}-${locale}-${width}.png`)).raw().toBuffer(),currentPixels=await sharp(screenshot).raw().toBuffer();assert(currentPixels.equals(priorPixels),`pixel mismatch ${kind} ${locale} ${width}`);
   const row={kind,locale,width,status:response.status(),...data,errors,failed,http,mocked,retainedGeometryEqual:true,retainedPixelsEqual:true,pixels:[]};
   if(kind==='synthetic')for(let n=0;n<13;n++){
    const img=page.locator('main img').nth(n);await img.evaluate(e=>e.scrollIntoView({block:'center',inline:'center',behavior:'instant'}));await page.waitForTimeout(80);
    const observed=await img.evaluate(i=>({src:i.currentSrc,position:getComputedStyle(i).objectPosition,transform:getComputedStyle(i).transform,fit:getComputedStyle(i).objectFit,frame:i.getBoundingClientRect().toJSON()})),inner=new URL(new URL(observed.src).searchParams.get('url')),id=/\/([a-f0-9]{40})-/.exec(inner.pathname)[1],role=roles[id];assert(observed.transform==='none'&&observed.fit==='cover','CMS geometry');
    const [px,py]=observed.position.split(' ').map(p=>parseFloat(p)/100),scale=Math.max(observed.frame.width/1020,observed.frame.height/680),ox=(observed.frame.width-1020*scale)*px,oy=(observed.frame.height-680*scale)*py,roi={left:(role.x*1200-15-120)*scale+ox,right:(role.x*1200+15-120)*scale+ox,top:(role.y*800-10-40)*scale+oy,bottom:(role.y*800+10-40)*scale+oy};assert(roi.left>=-0.1&&roi.right<=observed.frame.width+0.1&&roi.top>=-0.1&&roi.bottom<=observed.frame.height+0.1,'bounded ROI');
    const image=await img.screenshot(),{data:rgb,info}=await sharp(image).removeAlpha().raw().toBuffer({resolveWithObject:true});let yellow=0;for(let yy=Math.max(0,Math.floor(roi.top));yy<Math.min(info.height,Math.ceil(roi.bottom));yy++)for(let xx=Math.max(0,Math.floor(roi.left));xx<Math.min(info.width,Math.ceil(roi.right));xx++){const j=(yy*info.width+xx)*info.channels;if(rgb[j]>180&&rgb[j+1]>170&&rgb[j]-rgb[j+2]>8&&rgb[j+1]-rgb[j+2]>8)yellow++;}assert(yellow>=4,`focal pixels ${role.path}`);await writeFile(`${qa}/roi-${locale}-${width}-${id.slice(-2)}.png`,image);row.pixels.push({path:role.path,id,observed,roi,yellow});
   }
   rows.push(row);await page.close();
  }
  const html=await(await fetch(`http://127.0.0.1:${port}/en`)).text(),buildId=(await readFile(`${fixture}/.next/BUILD_ID`,'utf8')).trim();assert(html.includes(buildId),'served BuildID');
  const paths=[...new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^" ]+)"/g)].map(m=>m[1]))];for(const path of paths){const response=await fetch(`http://127.0.0.1:${port}${path}`);assert(response.ok,'static status');const bytes=Buffer.from(await response.arrayBuffer()),local=await readFile(`${fixture}/.next/${decodeURIComponent(path.replace('/_next/',''))}`);assert(local.equals(bytes),'served identity');assets.push({kind,buildId,path,bytes:bytes.length,sha256:hash(bytes)});}
 }
} catch(e){failure=e.stack;console.error(failure);}finally{
 if(browser)await browser.close();for(const {kind,port,p,log} of servers){if(p.exitCode===null){const exited=new Promise(r=>p.once('exit',r));p.kill('SIGTERM');await exited;}await bind(port);cleanup.push({kind,port,rebind:true});await writeFile(`${qa}/server-${kind}.log`,Buffer.concat(log));}await new Promise(r=>api.close(r));await bind(42194);cleanup.push({kind:'synthetic-api',port:42194,rebind:true});
 await writeFile(`${qa}/browser-results.json`,JSON.stringify({notice:'Six fresh representative cases only. Synthetic build has local API endpoint difference and browser-only generated assets. Prior 36 cases/ISR remain SAVED prior evidence, not rerun.',rows,assets,cleanup,failure},null,2));
}
console.log(JSON.stringify({cases:rows.length,syntheticRoiChecks:rows.reduce((n,r)=>n+r.pixels.length,0),roles:[...new Set(rows.flatMap(r=>r.pixels.map(p=>p.path)))],assetChecks:assets.length,cleanup,failure},null,2));if(failure||rows.length!==6)process.exitCode=1;
