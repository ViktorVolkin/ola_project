import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='docs/qa/weddings-cleanup/after';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage();
const cases=[];
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try {
  for(const locale of ['en','ru','sr']) for(const width of [360,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(`http://127.0.0.1:3120/${locale}/weddings-events`,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      for(const img of document.images)img.loading='eager';
      await Promise.race([Promise.all([...document.images].map(img=>img.decode().catch(()=>undefined))),new Promise(resolve=>setTimeout(resolve,10000))]);
      scrollTo(0,0);
    });
    const name=`${locale}-${width}.png`;
    await page.screenshot({path:`${dir}/${name}`,fullPage:true});
    const before=await sharp(`docs/qa/weddings/final/${name}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const after=await sharp(`${dir}/${name}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const dimensionsEqual=before.info.width===after.info.width&&before.info.height===after.info.height;
    let changedPixels=null;
    if(dimensionsEqual){
      changedPixels=0;
      for(let i=0;i<before.data.length;i+=4)if(!before.data.subarray(i,i+4).equals(after.data.subarray(i,i+4)))changedPixels++;
    }
    cases.push({locale,width,dimensionsEqual,changedPixels,height:after.info.height,pngSha256:createHash('sha256').update(await readFile(`${dir}/${name}`)).digest('hex')});
  }
  const report={baseline:'docs/qa/weddings/final',baselineBuild:JSON.parse(await readFile('docs/qa/weddings/final/manifest.json','utf8')).buildId,afterBuild:(await readFile('.next/BUILD_ID','utf8')).trim(),cases,errors,allIdentical:cases.every(c=>c.dimensionsEqual&&c.changedPixels===0)};
  await writeFile('docs/qa/weddings-cleanup/pixel-comparison.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
  if(!report.allIdentical||errors.length)process.exitCode=1;
} finally {await browser.close();}
