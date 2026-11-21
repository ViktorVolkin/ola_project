import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
const widths = [320,360,390,430,599,600,601,639,640,641,767,768,769,900,1024,1199,1200,1201,1279,1280,1281,1366,1440,1600];
try {
  for (const locale of ['en','ru','sr']) {
    await page.goto(`http://127.0.0.1:3120/${locale}/weddings-events`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({width,height:900});
      const clipped = await page.locator('main h1, main h2, main h3, main p, main figcaption').evaluateAll(nodes => nodes.filter(node => node.clientWidth > 2 && node.scrollWidth > node.clientWidth + 1).map(node => ({tag:node.tagName,text:node.textContent,width:node.clientWidth,scrollWidth:node.scrollWidth})));
      if (clipped.length) failures.push({locale,width,clipped});
    }
  }
  const result = {cases:widths.length*3,widths,failures};
  await writeFile('docs/qa/weddings/final/text-overflow.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
