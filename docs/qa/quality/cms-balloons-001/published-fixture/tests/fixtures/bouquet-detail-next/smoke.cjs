(async () => {
const { chromium } = await import('@playwright/test');
const fs = await import('node:fs');
const base = process.env.FIXTURE_BASE_URL || 'http://127.0.0.1:3218';
const out = process.env.FIXTURE_EVIDENCE;
  const browser = await chromium.launch();
  const no = await browser.newContext({javaScriptEnabled:false, viewport:{width:360,height:1000}});
  const page = await no.newPage();
  const response = await page.goto(`${base}/en/fixture/detail`);
  const html = await response.text();
  const markup = await page.locator('main').evaluate(m => ({articles:m.querySelectorAll('article').length, details:m.querySelectorAll('details').length, headings:m.querySelectorAll('article h3').length, images:m.querySelectorAll('article img[data-nimg="fill"]').length}));
  const ctx = await browser.newContext({viewport:{width:360,height:1000}});
  const p = await ctx.newPage(); const errors=[]; const fonts=[];
  p.on('pageerror', e=>errors.push(e.message)); p.on('console', m=>{if(m.type()==='error') errors.push(m.text())});
  p.on('request', r=>{if(r.resourceType()==='font') fonts.push(r.url())});
  await p.goto(`${base}/en/fixture/detail`, {waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  const geometry=await p.locator('main').evaluate(async m=>{
    const cards=[...m.querySelectorAll('article')];
    const custom=[...m.querySelectorAll('section')].find(s=>s.querySelector('img[src*="11_bouquets_custom"]'));
    const test=(img,text)=>{const a=img.getBoundingClientRect(), b=text.getBoundingClientRect(), parent=img.parentElement.getBoundingClientRect(); return {inside:Math.abs(a.x-parent.x)<1 && Math.abs(a.y-parent.y)<1 && Math.abs(a.width-parent.width)<1 && Math.abs(a.height-parent.height)<1, overlap:a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top};};
    const imgs=[...cards.map(c=>c.querySelector('img')),custom.querySelector('img')]; await Promise.all(imgs.map(i=>i.decode()));
    return [...cards.map(c=>test(c.querySelector('img'),c.querySelector('h3'))),test(custom.querySelector('img'),custom.querySelector('h2'))];
  });
  const result={status:response.status(),htmlContainsMain:html.includes('<main'),markup,geometry,errors,fonts};
  fs.mkdirSync(out,{recursive:true}); fs.writeFileSync(`${out}/smoke.json`,JSON.stringify(result,null,2));
  await browser.close(); console.log(JSON.stringify(result,null,2));
  if(result.status!==200 || !result.htmlContainsMain || markup.articles!==4 || markup.headings!==4 || markup.images!==4 || markup.details!==3 || geometry.some(g=>!g.inside||g.overlap) || errors.length) process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
