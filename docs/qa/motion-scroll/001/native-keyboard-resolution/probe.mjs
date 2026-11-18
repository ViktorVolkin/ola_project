import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const records=[];
for (const kind of ['control','app']) {
  for (let i=0;i<20;i++) {
    const page=await browser.newPage({viewport:{width:375,height:812}, reducedMotion:'reduce'});
    if(kind==='control') await page.setContent('<!doctype html><html><body style="margin:0;height:5309px"><main id="main-content" tabindex="-1">control</main></body></html>');
    else await page.goto('http://127.0.0.1:3100/en#main-content');
    await page.evaluate(() => {
      const log={events:[],frames:[], initial:{focus:document.activeElement?.outerHTML.slice(0,200),root:document.documentElement.className, fonts:document.fonts.status, images:[...document.images].map(x=>({complete:x.complete,width:x.naturalWidth})), max:document.documentElement.scrollHeight-innerHeight, y:scrollY}};
      window.__probe=log;
      for(const type of ['keydown','keyup','scroll','scrollend','focusin']) document.addEventListener(type,e=>{const row={type,key:e.key||'',trusted:e.isTrusted,prevented:e.defaultPrevented,y:scrollY,target:e.target===document?'document':e.target?.tagName,focus:document.activeElement?.tagName,time:performance.now()};log.events.push(row);queueMicrotask(()=>row.prevented=e.defaultPrevented)},true);
      const tick=()=>{log.frames.push({time:performance.now(),y:scrollY,max:document.documentElement.scrollHeight-innerHeight});if(log.frames.length<240)requestAnimationFrame(tick)}; requestAnimationFrame(tick);
    });
    await page.keyboard.press('End');
    try {await page.waitForFunction(()=>Math.abs(document.documentElement.scrollHeight-innerHeight-scrollY)<2,{},{timeout:5000});} catch {}
    await page.keyboard.press('Home');
    try {await page.waitForFunction(()=>scrollY<10,{},{timeout:5000});} catch {}
    await page.waitForTimeout(300);
    const result=await page.evaluate(()=>({log:window.__probe,y:scrollY,max:document.documentElement.scrollHeight-innerHeight,root:document.documentElement.className,fonts:document.fonts.status,images:[...document.images].map(x=>({complete:x.complete,width:x.naturalWidth}))}));
    records.push({kind,i,...result});
    console.log(kind,i,'y',result.y,'events',result.log.events.filter(x=>['keydown','scrollend'].includes(x.type)).map(x=>`${x.type}:${x.key}:${x.y}:${x.prevented}`).join(' '));
    await page.close();
  }
}
await writeFile('docs/qa/motion-scroll/001/native-keyboard-resolution/probe-results.json',JSON.stringify(records,null,2));
await browser.close();
