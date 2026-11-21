import {readFile,writeFile,copyFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';await copyFile(`${qa}/browser-results.json`,`${qa}/browser-controls-green-1.json`);
let s=await readFile(`${qa}/browser-final.mjs`,'utf8');
s=s.replace("import {readFile,writeFile} from 'node:fs/promises';", "import {readFile,writeFile} from 'node:fs/promises';\nimport {createHash} from 'node:crypto';");
s=s.replace("  const image=frame.locator('img[data-sanity*=\"path=hero.photo;\"]');",`  for(const base of ['services.flowers.title','mood.title','custom.title','extras.title','meet.title','events.title','labels.shopBouquets']){
    const path=base+'.'+locale,target=frame.locator('[data-sanity*="path='+path+';"]:visible').first();await clickField(target,path);
    const input=studioPage.locator('input[id="'+path+'"],textarea[id="'+path+'"]');const edited=locale.toUpperCase()+' · '+base+' draft edit';await input.fill(edited);await input.press('Tab');await frame.waitForFunction(({path,edited})=>[...document.querySelectorAll('[data-sanity]')].some(n=>n.dataset.sanity.includes('path='+path+';')&&n.textContent===edited),{path,edited},{timeout:15000});
    results.overlayWorkflow.push({kind:'section-edit-refresh',locale,path,actual:await target.innerText(),published:base.split('.').reduce((n,k)=>n[k],published)[locale]});
  }
  const image=frame.locator('img[data-sanity*="path=hero.photo;"]');`);
s=s.replace("const response=await page.request.get(script);const bytes=await response.text();assert(!bytes.includes(token),'server read token in served browser script');", "const response=await page.request.get(script);const bytes=await response.body();assert(!bytes.includes(Buffer.from(token)),'server read token in served browser script');const relative=new URL(script).pathname.replace('/_next/','');const expected=await readFile('/workspace/.local-tools/ola-qa/visual-editing-synthetic/.next/'+relative);const hash=b=>createHash('sha256').update(b).digest('hex');assert(hash(bytes)===hash(expected),'served client/source-build identity mismatch');results.servedAssets??=[];results.servedAssets.push({path:relative,sha256:hash(bytes)});");
await writeFile(`${qa}/browser-final.mjs`,s);console.log('Added each-section and button save/refresh plus exact served asset binding.');
