import { test, expect } from '@playwright/test';
for (const locale of ['en','ru','sr']) for (const width of [320,360,599,600,768,1099,1100,1440]) test(`${locale} ${width}`, async ({page})=>{
 const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
 await page.setViewportSize({width,height:1000}); await page.goto(`/${locale}/fixture/detail-page`);
 const main=page.locator('main'); await expect(main.locator('h1')).toHaveCount(1); await expect(main.locator('details')).toHaveCount(3); await expect(main.locator('details').first()).toHaveAttribute('open','');
 const thumbs=main.locator('button[aria-pressed]'); await expect(thumbs).toHaveCount(4); await thumbs.nth(1).click(); await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed','true');
 const radios=main.locator('input[type=radio]'); await expect(radios.first()).toBeChecked(); await radios.nth(1).locator('..').click(); await expect(radios.nth(1)).toBeChecked();
 const boxes=main.locator('input[type=checkbox]'); await expect(boxes).toHaveCount(3); await expect(boxes.first()).not.toBeChecked(); await boxes.first().locator('..').click();
 await main.locator('textarea').fill('Hello'); await boxes.last().locator('..').click(); await boxes.last().locator('..').click(); await expect(main.locator('textarea')).toHaveValue('Hello');
 const date=main.locator('#preferred-date'); await date.fill('bad'); await date.blur(); await expect(date).toHaveAttribute('aria-invalid','true'); await date.fill('29.02.2024'); await expect(date).toHaveAttribute('aria-invalid','false');
 await main.locator('summary').nth(1).focus(); await page.keyboard.press('Enter'); await expect(main.locator('details').nth(1)).toHaveAttribute('open',''); await expect(main.locator('details').first()).toHaveAttribute('open','');
 await expect(main.locator('button:disabled')).toHaveCount(6); await expect(main.locator('a[href$="/bouquets"]').last()).toHaveAttribute('href',`/${locale}/bouquets`);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true); await main.locator('img').evaluateAll(async els=>Promise.all(els.map(e=>(e as HTMLImageElement).decode()))); expect(errors).toEqual([]);
 if(locale==='en' && [360,768,1440].includes(width)) await page.screenshot({path:`docs/qa/bouquet-detail/composition-001/en-${width}.png`,fullPage:true});
});
test('server-rendered without JavaScript',async ({browser})=>{const context=await browser.newContext({javaScriptEnabled:false}); const page=await context.newPage(); await page.goto('/en/fixture/detail-page'); await expect(page.locator('main h1')).toHaveText('Soft Romance'); await expect(page.locator('main details')).toHaveCount(3); await expect(page.locator('main img').first()).toBeVisible(); await expect(page.locator('main a[href="/en/bouquets"]').first()).toBeVisible(); await context.close()});

for (const locale of ['en','ru','sr']) test(`raw SSR ${locale}`, async ({request, page}) => {
 const response=await request.get(`/${locale}/fixture/detail-page`); expect(response.status()).toBe(200);
 const html=await response.text(); const result=await page.evaluate(({html,locale})=>{const doc=new DOMParser().parseFromString(html,'text/html'); doc.querySelectorAll('script').forEach(e=>e.remove()); const main=doc.querySelector('main'); return {h1:main?.querySelectorAll('h1').length,images:main?.querySelectorAll('img').length,inputs:main?.querySelectorAll('input').length,details:main?.querySelectorAll('details').length,back:!!main?.querySelector(`a[href="/${locale}/bouquets"]`)}},{html,locale});
 expect(result.h1).toBe(1); expect(result.images).toBeGreaterThanOrEqual(5); expect(result.inputs).toBeGreaterThanOrEqual(7); expect(result.details).toBe(3); expect(result.back).toBe(true);
});

for (const locale of ['en','ru','sr']) for (const width of (locale==='en'?[360,768,1440]:[360,1440])) test(`pristine ${locale} ${width}`, async ({page})=>{
 await page.setViewportSize({width,height:1000}); await page.goto(`/${locale}/fixture/detail-page`); await page.evaluate(async()=>{await document.fonts.ready; const images=[...document.querySelectorAll('main img')] as HTMLImageElement[]; images.forEach(i=>i.loading='eager'); await Promise.all(images.map(i=>i.decode()));});
 await page.screenshot({path:`docs/qa/bouquet-detail/composition-001/pristine-${locale}-${width}.png`,fullPage:true});
 const data=await page.locator('main').evaluate(main=>{const rect=(e:Element)=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}; const gallery=main.querySelector('section[aria-label] img')!; const thumbs=[...main.querySelectorAll('button[aria-pressed]')]; const fields=[...main.querySelectorAll('fieldset')]; const full=[...fields[0].querySelectorAll('label')]; const extras=[...fields[1].querySelectorAll('label')]; const cards=[...main.querySelectorAll('article')]; const custom=main.querySelectorAll(':scope > section')[2]; const clipped=[...main.querySelectorAll('h1,h2,h3,p,legend,summary,label,button:not([aria-pressed])')].filter(e=>{const r=e.getBoundingClientRect(); const s=getComputedStyle(e); return r.width>0 && (r.left < -1 || r.right > innerWidth+1 || (e.scrollWidth>e.clientWidth+1 && s.overflowX!=='visible'));}).map(e=>({tag:e.tagName,text:e.textContent?.trim(),box:rect(e),scroll:e.scrollWidth,client:e.clientWidth})); return {content:rect(gallery.parentElement!.parentElement!.parentElement!),gallery:rect(gallery),thumbs:thumbs.map(rect),full:full.map(rect),extras:extras.map(rect),cards:cards.map(rect),custom:custom? [...custom.querySelector('div')!.children].map(rect):[],clipped};});
 console.log('GEOMETRY',locale,width,JSON.stringify(data)); expect(data.clipped).toEqual([]);
 const near=(actual:number,expected:number)=>expect(Math.abs(actual-expected)).toBeLessThanOrEqual(1);
 if(locale==='en'){near(data.content.w,width===1440?1280:width===768?704:320); near(data.gallery.w,width===1440?624:width===768?704:320); near(data.gallery.h,width===360?300:560); if(width===1440){near(data.full[0].x-data.gallery.x-data.gallery.w,48); near(data.content.x+data.content.w-data.full[0].x,608);} if(width===360){data.thumbs.forEach(r=>{near(r.w,68);near(r.h,60)}); near(data.thumbs[1].x-data.thumbs[0].x-data.thumbs[0].w,16);}}
 if(width===360){data.full.forEach(r=>near(r.w,96)); data.extras.forEach(r=>near(r.w,152)); near(data.extras[2].x,data.extras[0].x);}
 expect(new Set(data.cards.map(r=>Math.round(r.y))).size).toBe(width===1440?1:2); expect(data.custom.length).toBe(2); expect(Math.abs(data.custom[0].y-data.custom[1].y)<2).toBe(width===1440);
});

for (const width of [598,601,1098,1101]) test(`composition boundary ${width}`,async ({page})=>{await page.setViewportSize({width,height:1000});await page.goto('/en/fixture/detail-page'); expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true); const cards=await page.locator('main article').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().y)); expect(new Set(cards.map(Math.round)).size).toBe(width>=1100?1:2);});

for (const locale of ['en', 'ru', 'sr']) for (const width of (locale === 'en' ? [360, 768, 1440] : [768])) test(`native choice focus visible ${locale} ${width}`, async ({ page }) => {
 await page.setViewportSize({ width, height: 900 });
 await page.goto(`/${locale}/fixture/detail-page`);
 await page.evaluate(() => document.fonts.ready);
 const main = page.locator('main');
 await main.locator('nav a').first().focus();
 const expected = [main.locator('nav a').nth(1), ...Array.from({length: 4}, (_, i) => main.locator('button[aria-pressed]').nth(i)), main.locator('input[type=radio]').first(), ...Array.from({length: 3}, (_, i) => main.locator('input[type=checkbox]').nth(i))];
 for (let i = 0; i < expected.length; i++) {
  await page.keyboard.press('Tab');
  await expect(expected[i]).toBeFocused();
  if (i < 5) continue;
  const data = await expected[i].evaluate(input => {
   const card = input.nextElementSibling!;
   const caption = card.lastElementChild!;
   const box = (e: Element) => { const r = e.getBoundingClientRect(); return {top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height}; };
   const style = getComputedStyle(card);
   return {active: document.activeElement === input, focusVisible: input.matches(':focus-visible'), scrollY, viewport: {width: innerWidth, height: innerHeight}, input: box(input), card: box(card), caption: box(caption), outline: {style: style.outlineStyle, width: style.outlineWidth, offset: style.outlineOffset}};
  });
  console.log('CHOICE_FOCUS', locale, width, i, JSON.stringify(data));
  await page.screenshot({path: `docs/qa/bouquet-detail/composition-001/technical-final/revision-1/focus-${locale}-${width}-${i}.png`});
  expect.soft(data.focusVisible).toBe(true);
  expect.soft(data.outline.style).toBe('solid');
  expect.soft(parseFloat(data.outline.width)).toBeGreaterThanOrEqual(2);
  expect.soft(data.caption.top).toBeGreaterThanOrEqual(0);
  expect.soft(data.caption.bottom).toBeLessThanOrEqual(data.viewport.height);
  expect.soft(data.card.top).toBeGreaterThanOrEqual(0);
  expect.soft(data.card.bottom).toBeLessThanOrEqual(data.viewport.height);
 }
});

test('keyboard sequence and independent controls',async ({page})=>{
 await page.setViewportSize({width:1440,height:1000}); await page.goto('/en/fixture/detail-page'); const main=page.locator('main'); const links=main.locator('nav a'); const thumbs=main.locator('button[aria-pressed]'); const radio=main.locator('input[type=radio]'); const boxes=main.locator('input[type=checkbox]');
 await links.first().focus(); const expected=[links.nth(1),...Array.from({length:4},(_,i)=>thumbs.nth(i)),radio.first(),...Array.from({length:3},(_,i)=>boxes.nth(i)),main.locator('#preferred-date'),main.locator('textarea'),main.locator('a[href="/en/bouquets"]').last(),...Array.from({length:3},(_,i)=>main.locator('summary').nth(i))];
 for (const target of expected){await page.keyboard.press('Tab'); await expect(target).toBeFocused();}
 await radio.first().focus(); await page.keyboard.press('ArrowRight'); await expect(radio.nth(1)).toBeFocused(); await expect(radio.nth(1)).toBeChecked(); await boxes.first().focus(); await page.keyboard.press('Space'); await expect(boxes.first()).toBeChecked(); await main.locator('textarea').fill('Independent message'); await boxes.last().focus(); await page.keyboard.press('Space'); await expect(main.locator('textarea')).toHaveValue('Independent message');
 await main.locator('summary').nth(1).focus(); await page.keyboard.press('Enter'); await expect(main.locator('details').first()).toHaveAttribute('open',''); await expect(main.locator('details').nth(1)).toHaveAttribute('open',''); await expect(main.locator('summary').nth(1)).toBeFocused();
 const disabled=main.locator('button:disabled'); await expect(disabled).toHaveCount(6); for(const button of await disabled.all()){await expect(button).toHaveAttribute('aria-describedby','enquiry-unavailable');} await expect(page.locator('#enquiry-unavailable')).toHaveCount(1); await expect(page.locator('#enquiry-unavailable')).not.toBeEmpty();
});
