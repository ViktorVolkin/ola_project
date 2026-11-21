import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:42180/',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(8000);
 const result={status:response.status(),title:await page.title(),body:(await page.locator('body').innerText()).slice(0,5000),url:page.url(),errors};
 await page.screenshot({path:'/workspace/docs/qa/quality/sanity-home-ready-001/studio-login.png'});
 await writeFile('/workspace/docs/qa/quality/sanity-home-ready-001/studio-login.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
