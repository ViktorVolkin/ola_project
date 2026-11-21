import {chromium} from 'playwright';
import fs from 'node:fs';
(async()=>{
 const phase=process.argv[2]; const browser=await chromium.launch({headless:true}); const output=[];
 for(const locale of ['en','ru','sr']) for(const width of (locale==='en'?[320,360,375,768,1440]:[320,360,375])) {
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const response=await page.goto(`http://127.0.0.1:3217/${locale}/bouquets`,{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready);
  const section=page.locator('#bouquet-inspiration');
  const data=await section.evaluate(el=>{
   const rect=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
   const cards=[...el.querySelectorAll('article')];
   return {cards:cards.map(c=>{const [photo,caption]=c.children; const title=caption.querySelector('h3'),button=caption.querySelector('button'); const style=getComputedStyle(caption);return {card:rect(c),photo:rect(photo),caption:rect(caption),title:rect(title),action:rect(button),titleText:title.textContent,actionText:button.textContent,disabled:button.disabled,desc:button.getAttribute('aria-describedby'),hrefs:c.querySelectorAll('a[href]').length,overflow: [title.scrollWidth>title.clientWidth,button.scrollWidth>button.clientWidth],gap:style.gap,justify:style.justifyContent, min:style.minBlockSize}}),reason:el.querySelector('#bouquet-card-action-pending')?.textContent,reasonVisible:!!el.querySelector('#bouquet-card-action-pending')?.getClientRects().length};
  });
  data.status=response.status();data.locale=locale;data.width=width;
  if(phase==='after'){
   if(data.status!==200||data.cards.length!==8||!data.reasonVisible||data.cards.some(c=>!c.disabled||c.desc!=='bouquet-card-action-pending'||c.hrefs||c.overflow.some(Boolean)||c.action.height<48)) throw Error(JSON.stringify(data));
   await section.screenshot({path:`docs/qa/bouquets/parts/inspiration/correction-1/${locale}-${width}.png`});
   if(width<=375){
    const growth=await section.evaluate(el=>{let c=el.querySelector('article'), cap=c.children[1], title=cap.querySelector('h3'), btn=cap.querySelector('button');const before=cap.getBoundingClientRect().height;title.textContent='A naturally growing title with many readable whole words in several lines';btn.firstChild.textContent='A longer action with multiple words'; const after=cap.getBoundingClientRect().height;return {before,after,titleHeight:title.getBoundingClientRect().height,actionHeight:btn.getBoundingClientRect().height,scrollTitle:title.scrollWidth,clientTitle:title.clientWidth,scrollButton:btn.scrollWidth,clientButton:btn.clientWidth};}); data.growth=growth;if(growth.after<=growth.before||growth.scrollTitle>growth.clientTitle||growth.scrollButton>growth.clientButton) throw Error('growth '+JSON.stringify(growth));
   }
  }
  output.push(data);await page.close();
 }
 fs.writeFileSync(`docs/qa/bouquets/parts/inspiration/correction-1/${phase}.json`,JSON.stringify(output,null,2));console.log(`${phase}: ${output.length} actual-page cases collected`);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
