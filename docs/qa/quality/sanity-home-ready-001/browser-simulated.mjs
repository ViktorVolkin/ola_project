import {chromium} from 'playwright';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import net from 'node:net';
const root='/workspace/docs/qa/quality/sanity-home-ready-001';
const fixture='/workspace/.local-tools/ola-qa/sanity-home-simulated';
const port=42181;
const env={...process.env,HOME:'/workspace/.local-tools/ola-qa/home',XDG_CACHE_HOME:'/workspace/.local-tools/ola-qa/cache',XDG_CONFIG_HOME:'/workspace/.local-tools/ola-qa/home/config',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'};
const server=spawn('/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node',['/workspace/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env,stdio:'ignore'});
let browser; const rows=[]; let failure;
try {
 for(let i=0;i<80;i++){try{if((await fetch(`http://127.0.0.1:${port}/en`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch({headless:true});
 const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="red"/><rect x="400" width="400" height="800" fill="lime"/><rect x="800" width="400" height="800" fill="blue"/><circle cx="840" cy="400" r="60" fill="yellow"/></svg>');
 for(const locale of ['en','ru','sr'])for(const width of [360,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900}}); const errors=[];const mockUrls=[];
  page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/_next/image?**',async route=>{const outer=new URL(route.request().url());const inner=new URL(outer.searchParams.get('url'),`http://127.0.0.1:${port}`);if(inner.hostname!=='cdn.sanity.io'||!inner.pathname.includes('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'))return route.continue(); const rect=inner.searchParams.get('rect')?.split(',').map(Number)??[0,0,1200,800];const targetWidth=Math.min(Number(outer.searchParams.get('w'))||640,1600);const bytes=await sharp(svg).extract({left:rect[0],top:rect[1],width:rect[2],height:rect[3]}).resize({width:targetWidth}).png().toBuffer();mockUrls.push(inner.href);await route.fulfill({status:200,contentType:'image/png',body:bytes});});
  const response=await page.goto(`http://127.0.0.1:${port}/${locale}`,{waitUntil:'networkidle'});await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const data=await page.evaluate(()=>({headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(x=>x.textContent),images:[...document.querySelectorAll('main img')].map(i=>({alt:i.alt,src:i.currentSrc,rect:i.getBoundingClientRect().toJSON(),parent:i.parentElement.getBoundingClientRect().toJSON(),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,objectPosition:getComputedStyle(i).objectPosition})),overflow:document.documentElement.scrollWidth>innerWidth}));
  await page.screenshot({path:`${root}/simulated-${locale}-${width}.png`,fullPage:true});
  if(width===360) for(const name of ['bright','natural']) {const image=page.locator(`img[alt="SIM ${locale} moods.${name}.alt"]`);await image.scrollIntoViewIfNeeded();await image.screenshot({path:`${root}/simulated-${locale}-360-${name}-scrolled.png`});}
  rows.push({locale,width,status:response.status(),...data,mockUrls,errors});await page.close();
 }
} catch(e){failure=e.stack;console.error(failure);} finally {
 if(browser)await browser.close();
 const exited=new Promise(resolve=>server.once('exit',resolve));server.kill('SIGTERM');await Promise.race([exited,new Promise((_,reject)=>setTimeout(()=>reject(Error('server cleanup timeout')),10000))]);
 await new Promise((resolve,reject)=>{const s=net.createServer().once('error',reject);s.listen(port,'127.0.0.1',()=>s.close(resolve));});
 await writeFile(`${root}/simulated-results.json`,JSON.stringify({fixture:'SIMULATED: synthetic source image; request interception is test only',rows,failure,cleanup:'rebind OK'},null,2));
}
console.log(JSON.stringify(rows.map(r=>({locale:r.locale,width:r.width,status:r.status,headings:r.headings.length,images:r.images.length,mocked:r.mockUrls.length,errors:r.errors,overflow:r.overflow})),null,2));
if(failure||rows.length!==12||rows.some(r=>r.status!==200||r.overflow||r.errors.length||r.headings.some(h=>!h?.startsWith(`SIM ${r.locale} `))||r.images.length!==13||r.images.some(i=>!i.naturalWidth||!i.alt.startsWith(`SIM ${r.locale} `)||!i.src.includes('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'))||r.mockUrls.length<1))process.exitCode=1;
