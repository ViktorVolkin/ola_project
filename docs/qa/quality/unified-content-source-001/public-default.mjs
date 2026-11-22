import {chromium} from '/workspace/.local-tools/ola-qa/unified-content-source-001/locked-install/node_modules/playwright-core/index.mjs';
import {writeFile} from 'node:fs/promises';
const root='/workspace/docs/qa/quality/unified-content-source-001';
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for (const locale of ['en','ru','sr']) {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',e=>errors.push(String(e))); page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  const response=await page.goto(`http://127.0.0.1:42731/${locale}`,{waitUntil:'networkidle'});
  const data=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.querySelector('main h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,annotations:document.querySelectorAll('[data-sanity]').length,previewStatus:!!document.querySelector('aside[aria-label="Editorial preview"]')}));
  await page.screenshot({path:`${root}/default-${locale}-1440.png`,fullPage:true,animations:'disabled'});
  results.push({locale,status:response.status(),data,errors}); await page.close();
 }
} finally {await browser.close();await writeFile(`${root}/public-default.json`,JSON.stringify({build:'BmlAZL0n5UwXdTLIEKiDI',viewport:'1440x900',results},null,2));}
console.log(JSON.stringify(results));
