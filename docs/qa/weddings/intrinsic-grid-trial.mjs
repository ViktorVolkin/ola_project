import {chromium} from '@playwright/test';
import {readFile, writeFile} from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage();
const results = [];
try {
  await page.goto('http://127.0.0.1:3120/en/weddings-events',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const width of [360,768,900,1024,1200,1280,1440]) {
    await page.setViewportSize({width,height:900});
    for(const [selector,minWidth] of [['[data-weddings-section="categories"] ul',280],['[data-weddings-section="inspiration"] div[class*="grid"]',280],['#our-process ol',250]]) {
      const value = await page.locator(selector).evaluate((grid,minWidth)=>{
        const rows=()=>{const counts=new Map();for(const node of grid.children){const y=Math.round(node.getBoundingClientRect().top);counts.set(y,(counts.get(y)||0)+1);}return [...counts.values()];};
        const retained=rows();const previous=grid.style.gridTemplateColumns;
        grid.style.gridTemplateColumns=`repeat(auto-fit,minmax(min(100%,${minWidth}px),1fr))`;
        const candidate=rows();grid.style.gridTemplateColumns=previous;
        return {retained,candidate};
      },minWidth);
      results.push({width,selector,minWidth,...value});
    }
  }
  const artifact={measuredBuildId:(await readFile('.next/BUILD_ID','utf8')).trim(),candidate:'auto-fit with reference-compatible readable minima; not a proof that all intrinsic alternatives are impossible',results};
  await writeFile('docs/qa/weddings/intrinsic-grid-trial.json',JSON.stringify(artifact,null,2));
  console.log(JSON.stringify({cases:results.length,orphans:results.filter(item=>item.candidate.join(',')==='3,1')}));
} finally {await browser.close();}
