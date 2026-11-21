import {chromium} from '@playwright/test';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
try {
  for (const [locale,width,sections] of [['ru',360,['hero','categories','cta']],['sr',360,['hero','categories','cta']],['ru',768,['cta']],['sr',768,['cta']]]) {
    await page.setViewportSize({width,height:900});
    await page.goto(`http://127.0.0.1:3120/${locale}/weddings-events`,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>undefined)));});
    for(const section of sections) await page.locator(`[data-weddings-section="${section}"]`).screenshot({path:`docs/qa/weddings/final/${locale}-${width}-${section}.png`});
  }
} finally { await browser.close(); }
