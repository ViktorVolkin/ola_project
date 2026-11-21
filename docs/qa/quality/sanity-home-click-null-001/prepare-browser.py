"""Adapt existing official local harness to the exact null-selection case."""
from pathlib import Path
q=Path('/workspace/docs/qa/quality/sanity-home-click-null-001')
old=Path('/workspace/docs/qa/quality/sanity-home-online-001/current-browser.mjs').read_text()
s=old.replace('qa=`${root}/docs/qa/quality/sanity-home-online-001/current-run`','qa=`${root}/docs/qa/quality/sanity-home-click-null-001/browser-${process.env.CLICK_MODE}-${process.env.CLICK_CASE}`')
s=s.replace("if(query?.includes('sanity.previewUrlSecret'))", "if(url.searchParams.get('tag')?.includes('use-main-document')){results.mainQueryResponses??=[];const value=process.env.CLICK_CASE==='draft-only'&&url.searchParams.get('perspective')!=='published'?{_id:'homePage',_type:'homePage'}:null;results.mainQueryResponses.push({query,perspective:url.searchParams.get('perspective'),result:value});return {result:value};}\n  if(query?.includes('sanity.previewUrlSecret'))")
s=s.replace("return {result:url.searchParams.get('perspective')==='drafts'?docs.get('drafts.homePage'):published};", "return {result:url.searchParams.get('perspective')==='drafts'?(docs.get('drafts.homePage')??null):(docs.get('homePage')??null)};")
s=s.replace('seedAssets(published);',"seedAssets(published);\nif(!['missing','unsaved','draft-only'].includes(process.env.CLICK_CASE)||!['before','fixed'].includes(process.env.CLICK_MODE))throw Error('Explicit CLICK_MODE/CLICK_CASE required');\ndocs.delete('homePage');if(process.env.CLICK_CASE!=='draft-only')docs.delete('drafts.homePage');")
s=s.replace("startNext('release',42241);",'').replace('await Promise.all([wait(42241),wait(42242)]);','await wait(42242);')
s=s.replace('`/workspace/.local-tools/ola-qa/sanity-home-online-001/studio/dist${path}`',"`${process.env.CLICK_MODE==='before'?'/workspace/.local-tools/ola-qa/sanity-home-online-001/studio/dist':'/workspace/.local-tools/ola-qa/sanity-home-click-null-001/studio/dist'}${path}`")
start=s.index(' // Real production fallback and strict confidentiality boundary.')
end=s.index('} catch(error)',start)
body=r''' // Real Studio + iframe, mocked API/auth; no live editor/content writes.
 const studioContext=await browser.newContext({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
 await studioContext.addInitScript(()=>localStorage.setItem('__studio_auth_token_zhn2ddaj',JSON.stringify({token:'synthetic-studio-token'})));
 const mockPhoto=await readFile(`${root}/public/assets/images/home/01_home_hero_florist_balloons_montenegro.jpg`);
 await studioContext.route(/http:\/\/localhost:42242\/_next\/image\?url=https/,route=>route.fulfill({status:200,contentType:'image/jpeg',body:mockPhoto}));
 await studioContext.route(/https:\/\/[^/]*sanity\.io\//,async route=>{const req=route.request(),url=new URL(req.url());if(url.pathname.includes('/data/history/')&&url.pathname.includes('/transactions/'))return route.fulfill({status:200,contentType:'application/x-ndjson',body:''});if(url.hostname==='cdn.sanity.io')return route.fulfill({status:200,contentType:'image/jpeg',body:mockPhoto});if(url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events')||url.pathname.endsWith('/listen'))return route.fulfill({status:307,headers:{location:`http://localhost:42244${url.pathname}${url.search}`}});return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(await apiResponse(url,req.method(),req.postData()))});});
 const studioPage=await studioContext.newPage();results.studioConsole=[];studioPage.on('pageerror',error=>results.errors.push({kind:'studio-page',message:error.message}));
 await studioPage.goto('http://localhost:3333');await studioPage.waitForTimeout(12000);
 const frame=studioPage.frames().find(f=>f.url().startsWith('http://localhost:42242/'));assert(frame,'Official preview iframe missing');
 for(const locale of ['en','ru','sr']){
  if(locale!=='en'){const address=studioPage.locator('input[value*="localhost:42242"]');await address.fill('http://localhost:42242/'+locale);await address.press('Enter');}
  await frame.waitForFunction(lang=>document.documentElement.lang===(lang==='sr'?'sr-Latn':lang),locale);await frame.waitForTimeout(1000);
  for(const [selector,path]of [['h1','hero.title.'+locale],['img[data-sanity*="path=hero.photo;"]','hero.photo']]){
   const target=frame.locator(selector).first();await target.scrollIntoViewIfNeeded();await studioPage.waitForTimeout(700);await target.hover({force:true,position:{x:2,y:2}});await target.hover({force:true,position:{x:20,y:20}});await target.click({force:true,position:{x:20,y:20}});await studioPage.waitForTimeout(600);
   const actual=decodeURIComponent(new URL(studioPage.url()).pathname);const body=await studioPage.locator('body').innerText();results.checks.push({locale,path,actual,bodyError:/can't access property|Cannot read properties|An error occurred/.test(body)});
   await studioPage.screenshot({path:`${qa}/${locale}-${path.replaceAll('.','-')}.png`,fullPage:true});
   assert(!results.checks.at(-1).bodyError,'Actual Studio error after overlay selection');assert(actual.endsWith('/'+path)||(path==='hero.photo'&&actual.endsWith('/'+path+'.asset')),'Wrong adjacent field path');assert(!results.errors.length,'Studio page exception');
  }
 }
 results.mutationRequests=requests.filter(r=>/data\/(actions|mutate)/.test(r.path));
 // Official synthetic preview-secret bookkeeping may mutate mock metadata; no editor input is filled/saved.
 if(process.env.CLICK_MODE==='fixed')assert(!results.mainQueryResponses?.length,'Optional main-document query still active');
 await studioContext.close();
'''
s=s[:start]+body+s[end:]
# Static templates above use JS regex escapes, not a second JSON encoding layer.
s=s.replace('\\\\/','\\/').replace('\\\\?','\\?').replace('\\\\.','\\.')
(q/'browser-null.mjs').write_text(s)
print('Prepared narrow official Studio browser harness; not executed')
