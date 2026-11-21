import {test, expect} from '@playwright/test';

for (const locale of ['en','ru','sr']) for (const width of [360,768,1440]) {
 test(`${locale} ${width} responsive flow`, async ({page}) => {
  await page.setViewportSize({width,height:1000});
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto(`/${locale}/preview/bouquet`);
  const main=page.locator('main'), hero=main.locator('section').first();
  const primary=hero.locator('button[data-enquiry-subject]').first();
  const back=hero.locator('a[href$="/bouquets"]').last();
  const actions=back.locator('..'), reassurance=actions.locator('p');
  const info=hero.locator('details').last(), band=hero.locator('img[src*="story_botanical_transparent"]').locator('..');
  const related=main.locator(':scope > section').nth(1), cards=related.locator('article');
  const boxes=await Promise.all([primary,back,reassurance,actions,info,band,related,hero.locator('textarea')].map(x=>x.boundingBox()));
  expect(boxes.every(Boolean)).toBeTruthy();
  const [p,b,r,a,i,d,s,t]=boxes.map(x=>x!);
  if(width>=768){ expect(Math.abs(b.y-p.y-14)).toBeLessThan(2); expect(Math.abs(b.x-(p.x+p.width+24))).toBeLessThan(2); expect(Math.abs(r.y-(p.y+60))).toBeLessThan(2); expect(t.height).toBe(88); }
  else {expect(t.height).toBe(96); expect(p.width).toBeCloseTo(a.width,0); expect(b.y).toBeGreaterThanOrEqual(p.y+p.height);}
  if(width<1100) {expect(d.y).toBeGreaterThanOrEqual(i.y+i.height); expect(s.y).toBeGreaterThanOrEqual(d.y+d.height);}
  await expect(hero).toHaveCSS('background-color','rgb(250, 247, 242)');
  await expect(primary).toBeDisabled(); await expect(cards).toHaveCount(4);
  for(const button of await cards.locator('button').all()){ await expect(button).toBeDisabled(); await expect(button).toHaveCSS('border-top-width','1px'); await expect(button).toHaveCSS('border-top-color','rgb(217, 204, 196)'); }
  await expect(page.locator('footer')).toHaveCount(1); expect(errors).toEqual([]);
  console.log('RECTS',JSON.stringify({locale,width,primary:p,back:b,reassurance:r,actions:a,info:i,band:d,related:s,textarea:t}));
  if(locale==='en') {await page.screenshot({path:`/workspace/docs/qa/bouquet-detail/preview-visual-001/actions-flow-final/en-${width}.png`,fullPage:true});}
 });
}
test('English signature respects authored line break',async({page})=>{await page.goto('/en/preview/bouquet');const p=page.getByText('Flowers made with love',{exact:false}).last();await expect(p).toHaveText('Flowers made\nwith love');await expect(p).toHaveCSS('white-space','pre-line');});
for (const [locale,normal] of [['en','Order via WhatsApp'],['ru','Заказать в WhatsApp'],['sr','Poručite putem WhatsApp‑a']]) test(`header SSR and hydration ${locale}`, async ({browser,page,request})=>{
 const url=`/${locale}/preview/bouquet`; const response=await request.get(url); expect(response.status()).toBe(200);
 const html=await response.text(); expect(html).toContain('Enquire');
 const nojs=await browser.newContext({javaScriptEnabled:false}); const raw=await nojs.newPage(); await raw.goto(url); await expect(raw.locator('header').getByRole('button',{name:'Enquire'}).first()).toBeVisible(); await nojs.close();
 const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message)); await page.goto(url); const preview=page.locator('header').getByRole('button',{name:'Enquire'}).first(); await expect(preview).toBeVisible(); await expect(preview).toBeDisabled();
 await page.goto(`/${locale}/bouquets`); await expect(page.locator('header').getByRole('button',{name:normal}).first()).toBeVisible(); expect(errors).toEqual([]);
});
