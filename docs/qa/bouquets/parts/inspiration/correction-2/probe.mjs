import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='docs/qa/bouquets/parts/inspiration/correction-2', phase=process.argv[2];
const browser=await chromium.launch({headless:true}); const results=[]; let failures=[];
for(const locale of ['en','ru','sr']) for(const width of [320,360,375,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 const response=await page.goto(`http://127.0.0.1:3217/${locale}/bouquets`,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
 const section=page.locator('#bouquet-inspiration');
 const d=await section.evaluate(el=>{
  const r=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
  const anchors=[...el.querySelectorAll('a[href^="#"]')];
  const selectors=anchors.map(a=>{const span=a.querySelector('span'),img=a.querySelector('img'),range=document.createRange();range.selectNodeContents(span);return {label:span.textContent,tile:r(a),text:r(span),ranges:[...range.getClientRects()].map(x=>({x:x.x,right:x.right,y:x.y,bottom:x.bottom})),img:r(img),href:a.getAttribute('href'),target:!!document.getElementById(a.hash.slice(1)),display:getComputedStyle(a).display}});
  const cards=[...el.querySelectorAll('article')].map(c=>({rect:r(c),caption:r(c.children[1]),title:r(c.querySelector('h3')),button:r(c.querySelector('button')),disabled:c.querySelector('button').disabled,hrefs:c.querySelectorAll('a').length,desc:c.querySelector('button').getAttribute('aria-describedby')}));
  return {selectors,cards,reason:!!el.querySelector('#bouquet-card-action-pending')?.getClientRects().length};
 });
 d.locale=locale;d.width=width;d.status=response.status();
 const err=[]; if(d.status!==200||d.selectors.length!==5||d.cards.length!==8||!d.reason)err.push('counts/status');
 const inside=(a,b)=>a.x>=b.x-0.5&&a.right<=b.right+0.5&&a.y>=b.y-0.5&&a.bottom<=b.bottom+0.5;
 for(const s of d.selectors){if(!s.target||s.tile.height<48||!inside(s.img,s.tile)||s.ranges.some(t=>!inside(t,s.tile)||t.x<0||t.right>width))err.push(`selector ${s.label} ${JSON.stringify(s)}`);}
 for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const a=d.selectors[i].tile,b=d.selectors[j].tile;if(a.x<b.right-0.5&&a.right>b.x+0.5&&a.y<b.bottom-0.5&&a.bottom>b.y+0.5)err.push('overlap');}
 for(let i=0;i<5;i++){const a=section.locator('a[href^="#"]').nth(i);await a.focus();if(!await a.evaluate(e=>document.activeElement===e))err.push('focus');}
 if(d.cards.some(c=>!c.disabled||c.hrefs||c.desc!=='bouquet-card-action-pending'||c.button.height<48))err.push('card controls');
 if(width<=375){if(new Set(d.cards.slice(0,2).map(c=>c.rect.y)).size!==1||d.cards[0].rect.x===d.cards[1].rect.x||d.cards.some(c=>c.caption.height<149.9))err.push('card grid/caption');
 const grow=await section.evaluate(el=>{let cap=el.querySelector('article').children[1],b=cap.getBoundingClientRect().height;cap.querySelector('h3').textContent='A naturally growing title with many readable whole words in several lines';cap.querySelector('button').firstChild.textContent='A longer action with multiple words';return {before:b,after:cap.getBoundingClientRect().height};});d.growth=grow;if(grow.after<=grow.before)err.push('caption growth');}
 await page.reload({waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await section.screenshot({path:`${dir}/${phase}-${locale}-${width}.png`});
 d.errors=err;results.push(d);if(err.length)failures.push(`${locale}/${width}: ${err.join('; ')}`);await page.close();
}
fs.writeFileSync(`${dir}/${phase}.json`,JSON.stringify(results,null,2));await browser.close();console.log(`${phase}: ${results.length} cases, ${failures.length} failed\n${failures.join('\n')}`);if(failures.length)process.exitCode=1;
