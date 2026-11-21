import {chromium} from '/workspace/node_modules/playwright/index.mjs';
import fs from 'node:fs';
(async () => {
 const browser = await chromium.launch({headless:true}); const out=[];
 for (const locale of ['en','ru','sr']) {
  const page=await browser.newPage({viewport:{width:1280,height:800}}); await page.goto(`http://127.0.0.1:3100/${locale}`,{waitUntil:'load'}); await page.evaluate(()=>document.fonts.ready);
  const lang=page.locator('header [data-language-open] button:visible').first(); const word=page.locator('header a[aria-label="OLA Floral Studio"]').first();
  const geometry=await word.evaluate(e=>({textContent:e.textContent,innerText:e.innerText,rects:[...e.querySelectorAll('span')].map(s=>({text:s.innerText,rect:s.getBoundingClientRect().toJSON()})), link:e.getBoundingClientRect().toJSON()}));
  out.push({locale,languageText:await lang.innerText(),languageAX:await lang.ariaSnapshot(),wordmarkAX:await word.ariaSnapshot(),geometry}); await page.close();
 }
 fs.writeFileSync(process.argv[2],JSON.stringify(out,null,2)); await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
