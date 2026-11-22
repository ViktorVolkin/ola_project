import assert from 'node:assert/strict';
import path from 'node:path';
import {requireProject, env, save, packet, run, node, root} from './local.mjs';

Object.assign(process.env,env);
const {chromium}=requireProject('playwright');
const browser=await chromium.launch({headless:true,timeout:30000,env});
try {
  const page=await browser.newPage();
  await page.setContent('<main><button id="probe">Ready</button></main><script>document.querySelector("button").onclick=()=>document.querySelector("button").textContent="Clicked"</script>');
  await page.locator('#probe').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#probe').textContent(),'Clicked');
  assert.equal(await page.evaluate(()=>6*7),42);
  save('browser-probe.json',{version:browser.version(),executable:chromium.executablePath(),runtime:process.version,home:env.HOME,cache:env.PLAYWRIGHT_BROWSERS_PATH,dom:true,js:true,keyboard:true,launchMode:'Playwright standard headless defaults; no custom security/certificate/Crashpad flags'});
  console.log('Chromium DOM/JS/focus/keyboard PASS',browser.version());
  await page.close();
  if(process.argv[2]!=='probe') {
    const base=process.argv[2]; if(!base) throw new Error('Missing private server URL');
    const results=[];
    for(const width of [1440,390]) for(const locale of ['en','ru','sr']) for(const route of ['', '/preview/bouquet']) {
      const context=await browser.newContext({viewport:{width,height:900}});
      const page=await context.newPage(); const errors=[]; const resources=[];
      page.on('pageerror',error=>errors.push({type:'pageerror',message:error.message}));
      page.on('console',message=>{if(message.type()==='error') errors.push({type:'console',message:message.text()});});
      page.on('requestfailed',request=>errors.push({type:'requestfailed',url:request.url(),failure:request.failure()}));
      page.on('response',response=>{resources.push({url:response.url(),status:response.status(),type:response.request().resourceType()});if(response.status()>=400) errors.push({type:'http',url:response.url(),status:response.status()});});
      const url=`${base}/${locale}${route}`;
      // Separate no-JS browser DOM validates actual SSR rather than Flight substrings.
      const ssrContext=await browser.newContext({javaScriptEnabled:false});
      const ssrPage=await ssrContext.newPage(); const ssrResponse=await ssrPage.goto(url,{waitUntil:'load',timeout:45000});
      assert.equal(ssrResponse.status(),200);
      assert.equal(await ssrPage.locator('html').getAttribute('lang'),locale==='sr'?'sr-Latn':locale);
      assert.ok(await ssrPage.locator('main h1').first().textContent());
      const ssrHeading=await ssrPage.locator('main h1').first().textContent(); await ssrContext.close();
      const response=await page.goto(url,{waitUntil:'networkidle',timeout:45000}); assert.equal(response.status(),200);
      await page.locator('main h1').first().waitFor();
      await page.evaluate(async()=>{await document.fonts.ready;});
      // A hydrated enabled native header control is the interaction witness.
      let interaction;
      if(width<768) {
        const menu=page.locator('header button[aria-haspopup="dialog"]').first();
        await menu.waitFor({state:'visible'});
        await page.waitForFunction(()=>{const b=document.querySelector('header button[aria-haspopup="dialog"]');return b&&!b.disabled;},{},{timeout:15000});
        await menu.focus(); await page.keyboard.press('Enter');
        await page.getByRole('dialog').waitFor({state:'visible'}); await page.keyboard.press('Escape');
        await page.getByRole('dialog').waitFor({state:'hidden'}); interaction='native menu keyboard open/Escape close';
      } else {
        const control=page.locator('header button').filter({visible:true}).first();
        await control.waitFor({state:'visible'}); await control.focus();
        assert.equal(await control.evaluate(element=>element===document.activeElement),true);
        await control.click(); interaction='native header control focus/click';
        await page.keyboard.press('Escape');
      }
      const assets=await page.evaluate(()=>({fonts:document.fonts.status,images:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).map(i=>({src:i.currentSrc,complete:i.complete,width:i.naturalWidth})),scripts:[...document.scripts].filter(s=>s.src).map(s=>s.src)}));
      assert.equal(assets.fonts,'loaded'); assert.ok(assets.scripts.length>0);
      assert.ok(assets.images.length>0); assert.ok(assets.images.every(i=>i.complete&&i.width>0));
      assert.ok(resources.some(r=>r.type==='font'&&r.status===200));
      assert.deepEqual(errors,[]);
      const result={url,width,ssrHeading,hydration:interaction,assets,resources,errors}; results.push(result); save('site-smoke.json',results);
      if(locale==='en'&&!route) await page.screenshot({path:path.join(packet,`home-${width}.png`)});
      console.log('PASS',url,width,interaction); await context.close();
    }
    save('smoke-summary.json',{cases:results.length,passed:results.length,version:browser.version()});
    env.OLA_QA_BASE_URL=base;
    run(node,[path.join(path.dirname(requireProject.resolve('playwright/package.json')),'cli.js'),'test','--config',path.join(root,'scripts/qa/playwright.config.mjs')],'focused-e2e',root,180000);
  }
} finally {await browser.close();}
