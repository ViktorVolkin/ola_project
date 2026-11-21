import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});let count=0;
for(const locale of ['en','ru','sr']) for(const width of [320,360,375,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900}});await page.goto(`http://127.0.0.1:3217/${locale}/bouquets`,{waitUntil:'networkidle'});
 const links=page.locator('#bouquet-inspiration a[href^="#"]');
 for(let i=0;i<5;i++){const a=links.nth(i),href=await a.getAttribute('href');await a.focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);if(await page.evaluate(()=>location.hash)!==href)throw Error(`${locale}/${width} ${href}`);count++;}
 await page.close();
}
await browser.close();console.log(`${count} keyboard anchor activations passed`);
