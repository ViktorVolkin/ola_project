import {readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {chromium} from '/workspace/node_modules/playwright-core/index.mjs';
import {parse,evaluate} from '/workspace/studio/node_modules/groq-js/dist/index.js';
import {applyPatches,parsePatch} from '/workspace/node_modules/@sanity/diff-match-patch/dist/index.js';

const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001`;
const node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,SHELL:'/bin/bash',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache',NODE_DISABLE_COMPILE_CACHE:'1',PLAYWRIGHT_BROWSERS_PATH:`${root}/.local-tools/ola-qa/browsers`};
process.env.PLAYWRIGHT_BROWSERS_PATH=env.PLAYWRIGHT_BROWSERS_PATH;
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const published=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/takeover/synthetic-document.json`,'utf8'));
let draft=structuredClone(published);draft.hero.title={en:'Synthetic draft EN title',ru:'Синтетический черновик RU',sr:'Sintetički nacrt SR'};
const docs=new Map([['homePage',published],['drafts.homePage',{...draft,_id:'drafts.homePage',_rev:'synthetic-rev',_createdAt:new Date().toISOString(),_updatedAt:new Date().toISOString()}]]);
const requests=[],results={synthetic:true,checks:[],errors:[],cleanup:[],studioRequests:[]},children=[],servers=[];
const secret='synthetic-preview-url-secret',token='synthetic-server-read-token-never-browser';
const listeners=new Set();
function setPath(doc,path,value){const keys=path.split('.');let target=doc;for(const key of keys.slice(0,-1))target=target[key]??=( {} );target[keys.at(-1)]=value;}
async function apiResponse(url,method,body){
 requests.push({path:url.pathname,method,perspective:url.searchParams.get('perspective')});
 if(url.pathname.endsWith('/auth/id'))return {id:'synthetic-user'};
 if(url.pathname.endsWith('/users/me'))return {id:'synthetic-user',name:'Synthetic Editor',email:'synthetic@example.test',role:'administrator',roles:[{name:'administrator',title:'Administrator'}]};
 if(url.pathname.includes('/users/'))return [{id:'synthetic-user',displayName:'Synthetic Editor'}];
 if(url.pathname.endsWith('/acl'))return [{filter:'true',permissions:['read','create','update','history','manage']}];
 if(url.pathname.endsWith('/grants'))return {'sanity.project':[{grants:[{name:'read'}]}]};
 if(url.pathname.endsWith('/user-applications'))return [];
 if(url.pathname.includes('/projects/zhn2ddaj'))return {id:'zhn2ddaj',displayName:'Synthetic local fixture',organizationId:'synthetic-org',members:[{id:'synthetic-user',role:'administrator'}],metadata:{},features:[],isDisabled:false};
 if(url.pathname.includes('/datasets'))return [{name:'production',aclMode:'public'}];
 if(url.pathname.includes('/data/query/')){
  let query=url.searchParams.get('query');const params={};for(const [key,value]of url.searchParams)if(key.startsWith('$')){try{params[key.slice(1)]=JSON.parse(value);}catch{params[key.slice(1)]=value;}}
  if(body){const posted=JSON.parse(body);query=posted.query;Object.assign(params,posted.params);}
  if(query?.includes('sanity.previewUrlSecret'))return {result:{private:params.secret===secret?{_id:'sanity-preview-url-secret.synthetic',_updatedAt:new Date().toISOString(),secret,studioUrl:'http://localhost:3333'}:[...docs.values()].find(d=>d._type==='sanity.previewUrlSecret'&&d.secret===params.secret)??null,public:null}};
  if(query==='*[_id == "homePage" && _type == "homePage"][0]')return {result:url.searchParams.get('perspective')==='drafts'?docs.get('drafts.homePage'):published};
  if(query?.includes('findability-mvi'))return {result:[...docs.values()].filter(d=>d._type==='homePage').map(d=>({_id:d._id,_type:d._type,orderings:[d._updatedAt]}))};
  try{return {result:await (await evaluate(parse(query),{dataset:[...docs.values()],params,identity:'synthetic-user'})).get(),syncTags:[]};}catch(error){results.errors.push({kind:'unsupported-mock-query',query,error:String(error)});return {result:[]};}
 }
 if(url.pathname.includes('/data/doc/')){const ids=decodeURIComponent(url.pathname.split('/').at(-1)).split(',');return {documents:ids.map(id=>docs.get(id)).filter(Boolean)};}
 if(url.pathname.includes('/data/history/'))return {events:{'drafts.homePage':[],homePage:[]},transactions:[],nextCursor:null};
 if(url.pathname.includes('/data/actions/')){
  results.lastMockAction={body:JSON.parse(body),activePairStreams:listeners.size};
  const data=JSON.parse(body);const mutations=data.actions.map(action=>{if(action.actionType!=='sanity.action.document.edit')throw Error('Synthetic fixture only supports draft edit actions');return {patch:{...action.patch,id:action.draftId}};});
  return apiResponse(new URL('http://localhost:42244/data/mutate/production'),'POST',JSON.stringify({mutations,transactionId:data.transactionId}));
 }
 if(url.pathname.includes('/data/mutate/')){
  const data=JSON.parse(body);for(const mutation of data.mutations??[]){if(mutation.create||mutation.createIfNotExists||mutation.createOrReplace){const doc=mutation.create??mutation.createIfNotExists??mutation.createOrReplace;docs.set(doc._id,{...doc,_rev:'synthetic-rev',_updatedAt:new Date().toISOString()});}if(mutation.patch){const doc=docs.get(mutation.patch.id)??{};const previousRev=doc._rev;for(const [path,value]of Object.entries(mutation.patch.set??{}))setPath(doc,path,value);for(const [path,value]of Object.entries(mutation.patch.setIfMissing??{}))if(!path.split('.').reduce((v,k)=>v?.[k],doc))setPath(doc,path,value);for(const [path,value]of Object.entries(mutation.patch.diffMatchPatch??{})){const prior=path.split('.').reduce((v,k)=>v?.[k],doc);setPath(doc,path,applyPatches(parsePatch(value),prior)[0]);}doc._rev=`synthetic-${Date.now()}`;doc._updatedAt=new Date().toISOString();docs.set(mutation.patch.id,doc);const event={type:'mutation',documentId:doc._id,eventId:doc._rev,identity:'synthetic-user',mutations:[mutation],result:doc,previousRev,resultRev:doc._rev,transition:'update',transactionId:data.transactionId??'synthetic-transaction',timestamp:doc._updatedAt,effects:{apply:[0,{...doc,_rev:undefined}]}};setTimeout(()=>{for(const listener of listeners)listener.write(`event: mutation\ndata: ${JSON.stringify(event)}\n\n`);},50);}}
  return {transactionId:data.transactionId??'synthetic-transaction',results:(data.mutations??[]).map(m=>({id:m.patch?.id??m.create?._id??'homePage',operation:'update'}))};
 }

 if(url.pathname.includes('/features'))return [];
 return {};
}
function listen(server,port){servers.push({server,port});return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});}
const api=createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost:42244');res.setHeader('Access-Control-Allow-Origin',req.headers.origin==='null'?'null':'http://localhost:3333');res.setHeader('Access-Control-Allow-Credentials','true');if(url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events')){requests.push({kind:'mock-stream',origin:req.headers.origin,path:url.pathname});res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache'});res.write('event: welcome\ndata: {"type":"welcome"}\n\n');if(url.searchParams.get('tag')?.includes('document.pair.listen')){listeners.add(res);res.on('close',()=>listeners.delete(res));}else setTimeout(()=>res.end(),250);return;}const chunks=[];for await(const b of req)chunks.push(b);res.setHeader('Content-Type','application/json');res.end(JSON.stringify(await apiResponse(url,req.method,Buffer.concat(chunks).toString())));});
function startNext(kind,port,extra={}){const logs=[],child=spawn(node,['/workspace/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:`${root}/.local-tools/ola-qa/visual-editing-${kind}`,env:{...env,...extra}});child.stdout.on('data',b=>logs.push(b));child.stderr.on('data',b=>logs.push(b));children.push({child,kind,port,logs});return child;}
async function wait(port){for(let n=0;n<80;n++){try{const res=await fetch(`http://localhost:${port}/en`);if(res.ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw Error(`Server ${port} not ready`);}
let browser;
try{
 await listen(api,42244);startNext('release',42241);startNext('synthetic',42242,{SANITY_API_READ_TOKEN:token,SANITY_PREVIEW_ORIGIN:'http://localhost:42242',SANITY_STUDIO_URL:'http://localhost:3333'});
 await Promise.all([wait(42241),wait(42242)]);
 const staticStudio=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost:3333').pathname;if(path==='/'||!path.includes('.'))path='/index.html';if(path.includes('..'))throw Error();const bytes=await readFile(`${root}/studio/dist${path}`);const ext=path.split('.').at(-1);res.setHeader('Content-Type',({js:'application/javascript',css:'text/css',html:'text/html',json:'application/json',svg:'image/svg+xml'}[ext]??'application/octet-stream'));res.end(bytes);}catch{res.writeHead(404);res.end();}});await listen(staticStudio,3333);
 browser=await chromium.launch({headless:true});
 // Real production fallback and strict confidentiality boundary.
 const publicContext=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const publicPage=await publicContext.newPage();
 for(const locale of ['en','ru','sr']){const res=await publicPage.goto(`http://localhost:42241/${locale}`);await publicPage.locator('main img').first().waitFor();assert(res.status()===200,'public status');assert(await publicPage.locator('[data-sanity]').count()===0,'public annotation leak');assert(await publicPage.getByRole('complementary',{name:'Editorial preview'}).count()===0,'public preview leak');assert(!((await publicPage.content()).includes(token)),'read token in markup');results.checks.push({kind:'public-release',locale,status:res.status(),cache:res.headers()['x-nextjs-cache'],csp:res.headers()['content-security-policy'],heading:await publicPage.locator('h1').innerText()});}
 const unauth=await publicContext.request.get('http://localhost:42241/api/draft-mode/enable?sanity-preview-secret=x&sanity-preview-pathname=/en');assert(unauth.status()===503,'missing config must fail closed');
 // Actual local Studio with only external API/auth mocked. No owner login/credentials.
 const studioContext=await browser.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
 await studioContext.addInitScript(()=>{localStorage.setItem('__studio_auth_token_zhn2ddaj',JSON.stringify({token:'synthetic-studio-token'}));});
 await studioContext.addInitScript(()=>{window.__qaMessages=[];window.addEventListener('message',event=>{if(event.data?.type)window.__qaMessages.push({origin:event.origin,type:event.data.type,from:event.data.from,to:event.data.to,domain:event.data.domain,parent:event.source===window.parent,dataType:event.data.data?.type});},true);});
 const mockPhoto=await readFile(`${root}/public/assets/images/home/01_home_hero_florist_balloons_montenegro.jpg`);
 await studioContext.route(/http:\/\/localhost:42242\/_next\/image\?url=https/,route=>route.fulfill({status:200,contentType:'image/jpeg',body:mockPhoto}));
 await studioContext.route(/https:\/\/[^/]*sanity\.io\//,async route=>{const req=route.request(),url=new URL(req.url());results.studioRequests.push({path:url.pathname,method:req.method()});if(url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events'))return route.fulfill({status:307,headers:{location:`http://localhost:42244${url.pathname}${url.search}`}});return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(await apiResponse(url,req.method(),req.postData()))});});
 const studioPage=await studioContext.newPage();results.studioConsole=[];studioPage.on('console',message=>{if(message.type()==='error')results.studioConsole.push(message.text());});studioPage.on('pageerror',error=>results.errors.push({kind:'studio-page',message:error.message}));
 await studioPage.goto('http://localhost:3333');await studioPage.waitForTimeout(12000);
 await studioPage.screenshot({path:`${qa}/studio-initial.png`,fullPage:true});
 await writeFile(`${qa}/studio-visible.txt`,await studioPage.locator('body').innerText());
 results.studioUrl=studioPage.url();results.studioFrames=studioPage.frames().map(f=>f.url());
 results.studioControls=await studioPage.locator('button,[role=switch],input,textarea').evaluateAll(nodes=>nodes.map(n=>({tag:n.tagName,role:n.getAttribute('role'),label:n.getAttribute('aria-label'),title:n.getAttribute('title'),text:n.textContent?.slice(0,80),id:n.id})));
 const frame=studioPage.frames().find(f=>f.url().startsWith('http://localhost:42242/'));
 assert(frame,'Actual Presentation did not load homepage iframe');
 const heading=frame.locator('h1');await heading.hover();await heading.click({force:true});await studioPage.waitForTimeout(700);
 results.firstOverlayClick={url:studioPage.url(),focused:await studioPage.locator(':focus').evaluateAll(nodes=>nodes.map(n=>({id:n.id,tag:n.tagName,value:n.value}))),overlayCount:await frame.locator('[data-sanity-overlay-element]').count()};
 await studioPage.screenshot({path:`${qa}/studio-click-title.png`,fullPage:true});
 results.overlayWorkflow=[];
 async function clickField(target,path,position){await target.scrollIntoViewIfNeeded();await target.hover({force:true,...(position?{position}:{})});await studioPage.waitForTimeout(250);await frame.waitForFunction(()=>document.querySelectorAll('[data-sanity-overlay-element]').length>0,{timeout:5000});await target.click({force:true,...(position?{position}:{})});await studioPage.waitForTimeout(350);const actual=decodeURIComponent(new URL(studioPage.url()).pathname);if(!actual.endsWith(`/${path}`)){results.clickFailure={path,actual,preview:frame.url(),target:await target.getAttribute('data-sanity'),frameMessages:await frame.evaluate(()=>window.__qaMessages)};await studioPage.screenshot({path:`${qa}/studio-click-failure.png`,fullPage:true});}assert(actual.endsWith(`/${path}`),`Overlay opened wrong field: expected ${path}, got ${actual}`);results.overlayWorkflow.push({path,url:studioPage.url(),previewUrl:frame.url()});}
 for(const locale of ['en','ru','sr']){
  if(locale!=='en'){const address=studioPage.locator('input[value*="localhost:42242"]');await address.fill(`http://localhost:42242/${locale}?sanity-preview-perspective=drafts`);await address.press('Enter');}await frame.waitForFunction(lang=>document.documentElement.lang===lang,locale);await frame.waitForTimeout(2000);
  await clickField(frame.locator('h1'),`hero.title.${locale}`);
  // Full edit→refresh cycle only for en (Studio sends real-time mutation notifications
  // when the preview is loaded from the initial URL; address-input locale switches
  // are validated for click-to-edit routing, not real-time sync).
  if(locale==='en'){
    const input=studioPage.locator(`textarea[id="hero.title.${locale}"]`);
    const edited=`${locale.toUpperCase()} · edited in actual Studio before publish`;
    const started=Date.now();await input.fill(edited);await input.press('Tab');
    for(let n=0;n<70;n++){if(await frame.locator('h1').innerText()===edited)break;await studioPage.waitForTimeout(200);}
    results.overlayWorkflow.push({kind:'edit-refresh',locale,expected:edited,actual:await frame.locator('h1').innerText(),elapsedMs:Date.now()-started,stored:docs.get('drafts.homePage').hero.title[locale],published:published.hero.title[locale]});
    results.refreshDiagnostics={frameMessages:await frame.evaluate(()=>window.__qaMessages),studioMessages:await studioPage.evaluate(()=>window.__qaMessages),formText:await studioPage.locator('body').innerText()};
    assert(await frame.locator('h1').innerText()===edited,`Official mutation refresh did not show ${locale} edit`);
  }
  await clickField(frame.locator(`[data-sanity*="path=hero.description.${locale};"]`),`hero.description.${locale}`);
  await clickField(frame.locator(`[data-sanity*="path=labels.shopBouquets.${locale};"]`).first(),`labels.shopBouquets.${locale}`);
  const image=frame.locator('img[data-sanity*="path=hero.photo;"]');const box=await image.boundingBox();
  await clickField(image,'hero.photo',{x:box.width*.85,y:box.height*.8});
 }
 await studioPage.getByRole('button',{name:'Toggle viewport size'}).click();await studioPage.waitForTimeout(500);
 const mobileWidth=await frame.evaluate(()=>window.innerWidth);results.previewMobileWidth=mobileWidth;assert(mobileWidth<600,'Presentation mobile control failed');
 const wedding=frame.locator('img[data-sanity-mobile]');
 await clickField(wedding,'services.weddingsMobile',{x:20,y:20});
 await studioPage.screenshot({path:`${qa}/studio-mobile-wedding.png`,fullPage:true});
 await studioPage.getByRole('button',{name:'Toggle viewport size'}).click();
 await studioPage.screenshot({path:`${qa}/studio-final.png`,fullPage:true});
 // Legitimate actual Next helper flow with the mock Content Lake, separate from public session.
 const editor=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await editor.newPage();
 const enableUrl=`http://localhost:42242/api/draft-mode/enable?sanity-preview-secret=${secret}&sanity-preview-pathname=/en`;
 const activation=await page.goto(enableUrl);await page.waitForTimeout(1500);
 results.activation={status:activation.status(),url:page.url(),heading:await page.locator('h1').innerText(),annotations:await page.locator('[data-sanity]').count(),cookies:(await editor.cookies()).map(({name,httpOnly,secure,sameSite})=>({name,httpOnly,secure,sameSite}))};
 assert(results.activation.heading===docs.get('drafts.homePage').hero.title.en,'draft title not rendered');assert(results.activation.annotations>30,'annotations absent');
 for(const locale of ['en','ru','sr'])for(const width of [360,1440]){await page.setViewportSize({width,height:900});await page.goto(`http://localhost:42242/${locale}`);await page.waitForTimeout(300);const fields=await page.locator('[data-sanity]').evaluateAll(nodes=>nodes.map(node=>({tag:node.tagName,attribute:node.getAttribute('data-sanity'),text:node.textContent?.slice(0,100)})));results.checks.push({kind:'synthetic-draft',locale,width,heading:await page.locator('h1').innerText(),fields});}
 const another=await publicContext.request.get('http://localhost:42242/en');const html=await another.text();assert(!html.includes(docs.get('drafts.homePage').hero.title.en),'draft escaped into unauthenticated session');results.checks.push({kind:'public-synthetic-isolation',status:another.status(),cache:another.headers()['x-nextjs-cache']});
 await page.goto('http://localhost:42242/api/draft-mode/disable?returnTo=/en');assert(!await page.getByRole('complementary',{name:'Editorial preview'}).count(),'exit failed');assert(await page.locator('[data-sanity]').count()===0,'exit annotation leak');results.checks.push({kind:'exit',url:page.url()});
 await studioContext.close();await editor.close();await publicContext.close();
} catch(error){results.failure=String(error);throw error;} finally {
 if(browser)await browser.close();
 for(const owned of children){const exited=new Promise(resolve=>{if(owned.child.exitCode!==null)resolve();else owned.child.once('exit',resolve);});if(owned.child.exitCode===null)owned.child.kill('SIGTERM');await exited;await writeFile(`${qa}/serve-${owned.kind}.log`,Buffer.concat(owned.logs));results.cleanup.push({kind:owned.kind,exit:owned.child.exitCode,signal:owned.child.signalCode});}
 for(const {server,port}of servers.reverse()){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));results.cleanup.push({port,closed:true});}
 for(const port of [42241,42242,42244,3333]){const probe=createServer();await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(port,'127.0.0.1',resolve);});await new Promise(resolve=>probe.close(resolve));results.cleanup.push({port,rebind:true});}
 results.apiRequests=requests;await writeFile(`${qa}/browser-results.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify({checks:results.checks.length,failure:results.failure,studioUrl:results.studioUrl,activation:results.activation,errors:results.errors,cleanup:results.cleanup},null,2));
}
