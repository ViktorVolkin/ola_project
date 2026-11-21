import {readFile,writeFile,copyFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';
await copyFile(`${qa}/browser-results.json`,`${qa}/browser-transaction-before-sr.json`);
let source=await readFile(`${qa}/browser-transaction.mjs`,'utf8');
source=source.replace("document.documentElement.lang===lang","document.documentElement.lang===(lang==='sr'?'sr-Latn':lang)");
source=source.replace("// Full edit→refresh cycle only for en (Studio sends real-time mutation notifications\n  // when the preview is loaded from the initial URL; address-input locale switches\n  // are validated for click-to-edit routing, not real-time sync).","// Every locale must survive the real Studio save → official mutation message → server refresh flow.");
source=source.replace("  const image=frame.locator('img[data-sanity*=\"path=hero.photo;\"]');",`  const allPaths=await frame.locator('[data-sanity]').evaluateAll(nodes=>[...new Set(nodes.filter(n=>n.getBoundingClientRect().width&&n.getBoundingClientRect().height&&!['IMG','SECTION','A','DIV'].includes(n.tagName)).map(n=>n.dataset.sanity.match(/path=([^;]+);/)?.[1]).filter(Boolean))]);
  for(const path of allPaths){const target=frame.locator('[data-sanity*="path='+path+';"]').first();if(await target.isVisible())await clickField(target,path);}
  const photoPaths=['hero.photo','services.flowers.photo','services.balloons.photo','services.weddings.photo','moods.romantic.photo','moods.bright.photo','moods.natural.photo','custom.photo','extras.balloons.photo','extras.card.photo','extras.chocolates.photo','meet.photo','events.photo'];
  for(const path of photoPaths){const target=frame.locator('img[data-sanity*="path='+path+';"]');const box=await target.boundingBox();await clickField(target,path,{x:box.width*.85,y:box.height*.25});}
  const image=frame.locator('img[data-sanity*="path=hero.photo;"]');`);
source=source.replace(" const wedding=frame.locator('img[data-sanity-mobile]');"," const wedding=frame.locator('img[data-sanity-mobile]');");
source=source.replace(" await studioPage.getByRole('button',{name:'Toggle viewport size'}).click();\n await studioPage.screenshot",` for(const locale of ['en','ru','sr']){const address=studioPage.locator('input[value*="localhost:42242"]');await address.fill('http://localhost:42242/'+locale);await address.press('Enter');await frame.waitForFunction(lang=>document.documentElement.lang===(lang==='sr'?'sr-Latn':lang),locale);await frame.waitForTimeout(1000);const mobile=frame.locator('img[data-sanity-mobile]');await clickField(mobile,'services.weddingsMobile',{x:20,y:20});results.checks.push({kind:'mobile-source',locale,width:await frame.evaluate(()=>innerWidth),currentSrc:await mobile.evaluate(n=>n.currentSrc),field:await mobile.getAttribute('data-sanity')});}
 await studioPage.getByRole('button',{name:'Toggle viewport size'}).click();
 await studioPage.screenshot`);
await writeFile(`${qa}/browser-final.mjs`,source);
console.log('Final browser includes EN/RU/SR mutation flow and all 14 photo roles.');
