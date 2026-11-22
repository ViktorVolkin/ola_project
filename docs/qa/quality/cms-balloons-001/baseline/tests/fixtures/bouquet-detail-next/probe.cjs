(async()=>{
 const {chromium}=await import('@playwright/test');
 const fs=await import('node:fs');
 const b=await chromium.launch();
 const no=await b.newContext({javaScriptEnabled:false,viewport:{width:360,height:1000}}), n=await no.newPage();
 await n.goto('http://127.0.0.1:3217/en/fixture/detail');
 const nojs={images:await n.locator('main img').count(),radios:await n.locator('main input[type=radio]').count(),details:await n.locator('main details').count(),firstOpen:await n.locator('main details').first().getAttribute('open')!==null,secondHidden:!(await n.locator('main details').nth(1).locator('p').isVisible())};
 const ctx=await b.newContext({viewport:{width:360,height:1000}}), p=await ctx.newPage(), fontRequests=[];
 p.on('request',r=>{if(r.resourceType()==='font') fontRequests.push(r.url())});
 await p.goto('http://127.0.0.1:3217/en/fixture/detail',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
 const layout=await p.locator('main').evaluate(main=>{
  const rect=e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}};
  const report=(image,title)=>{title.scrollIntoView({block:'center'}); const a=title.getBoundingClientRect(); return {image:rect(image),text:rect(title),topAtTextCenter:document.elementFromPoint(a.x+a.width/2,a.y+a.height/2)?.outerHTML.slice(0,250)};};
  const article=main.querySelector('article'), custom=[...main.querySelectorAll('section')].find(s=>s.querySelector('img[src*="11_bouquets_custom"]'));
  return {card:report(article.querySelector('img'),article.querySelector('h3')),custom:report(custom.querySelector('img'),custom.querySelector('h2'))};
 });
 const fonts=await p.evaluate(()=>Array.from(document.fonts).map(f=>({family:f.family,status:f.status})));
 const result={nojs,fontRequests,fonts,layout};
 fs.writeFileSync('/workspace/docs/qa/bouquet-detail/next-validation-001/nojs-font-overlap.json',JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
