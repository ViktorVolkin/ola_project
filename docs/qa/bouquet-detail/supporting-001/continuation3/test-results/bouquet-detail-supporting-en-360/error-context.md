# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bouquet-detail-supporting.spec.ts >> en 360
- Location: tests/e2e/bouquet-detail-supporting.spec.ts:21:123

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "The images show an inspiration. Flowers, colours and wrapping can vary; we’ll discuss the available options with you."
Received string:    "{\"nodes\":[{\"nodeId\":\"1\",\"ignored\":false,\"role\":{\"type\":\"internalRole\",\"value\":\"RootWebArea\"},\"chromeRole\":{\"type\":\"internalRole\",\"value\":144},\"name\":{\"type\":\"computedString\",\"value\":\"\",\"sources\":[{\"type\":\"relatedElement\",\"attribute\":\"aria-labelledby\"},{\"type\":\"attribute\",\"attribute\":\"aria-label\"},{\"type\":\"attribute\",\"attribute\":\"aria-label\",\"superseded\":true},{\"type\":\"relatedElement\",\"nativeSource\":\"title\"}]},\"properties\":[{\"name\":\"focusable\",\"value\":{\"type\":\"booleanOrUndefined\",\"value\":true}},{\"name\":\"focused\",\"value\":{\"type\":\"booleanOrUndefined\",\"value\":true}},{\"name\":\"url\",\"value\":{\"type\":\"string\",\"value\":\"about:blank\"}}],\"childIds\":[\"3\"],\"backendDOMNodeId\":1,\"frameId\":\"146086E9CFBDAE64018A2BA41318B4E5\"},{\"nodeId\":\"3\",\"ignored\":true,\"ignoredReasons\":[{\"name\":\"uninteresting\",\"value\":{\"type\":\"boolean\",\"value\":true}}],\"role\":{\"type\":\"role\",\"value\":\"none\"},\"chromeRole\":{\"type\":\"internalRole\",\"value\":0},\"parentId\":\"1\",\"childIds\":[\"7\"],\"backendDOMNodeId\":3},{\"nodeId\":\"7\",\"ignored\":true,\"ignoredReasons\":[{\"name\":\"uninteresting\",\"value\":{\"type\":\"boolean\",\"value\":true}}],\"role\":{\"type\":\"role\",\"value\":\"none\"},\"chromeRole\":{\"type\":\"internalRole\",\"value\":0},\"parentId\":\"3\",\"childIds\":[\"8\"],\"backendDOMNodeId\":7},{\"nodeId\":\"8\",\"ignored\":false,\"role\":{\"type\":\"role\",\"value\":\"generic\"},\"chromeRole\":{\"type\":\"internalRole\",\"value\":88},\"name\":{\"type\":\"computedString\",\"value\":\"\",\"sources\":[{\"type\":\"relatedElement\",\"attribute\":\"aria-labelledby\"},{\"type\":\"attribute\",\"attribute\":\"aria-label\"}]},\"properties\":[],\"parentId\":\"7\",\"childIds\":[],\"backendDOMNodeId\":8}]}"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { build } from 'vite';
  3  | import { readFileSync, writeFileSync } from 'node:fs';
  4  | import { resolve } from 'node:path';
  5  | import { createHash } from 'node:crypto';
  6  | let script = '', css = '';
  7  | const fontCss = readFileSync(resolve('.next/static/chunks/33yvq3-jje082.css'), 'utf8').match(/@font-face\{[^}]*\}/g)!.filter(face => /font-family:(Manrope|Cormorant Garamond|Great Vibes);/.test(face)).map(face => face.replace(/url\(\.\.\/media\/([^)]*)\)/g, (_, name: string) => `url(data:font/woff2;base64,${readFileSync(resolve('.next/static/media',name)).toString('base64')})`)).join('\n');
  8  | test.beforeAll(async () => {
  9  |  const result = await build({configFile:false, define:{'process.env.NODE_ENV':JSON.stringify('production')}, logLevel:'error', build:{write:false,target:'esnext',minify:false,lib:{entry:resolve('tests/fixtures/bouquet-detail-supporting/entry.tsx'),formats:['iife'],name:'SupportingFixture'}}});
  10 |  for (const output of Array.isArray(result) ? result : [result]) { if (!('output' in output)) throw Error('watcher'); for (const item of output.output) { if (item.type === 'chunk') { script += item.code; writeFileSync('docs/qa/bouquet-detail/supporting-001/continuation3/bundle-modules.json', JSON.stringify(Object.keys(item.modules), null, 2)); } else if (item.fileName.endsWith('.css')) css += item.source.toString(); } }
  11 |  console.log('bundle SHA256',createHash('sha256').update(script).digest('hex'),'css SHA256',createHash('sha256').update(css).digest('hex'));
  12 | });
  13 | const content = {
  14 |  en: { titles:['Flowers & seasonal variation','Date & delivery enquiry','Care guidance'], answers:['The images show an inspiration. Flowers, colours and wrapping can vary; we’ll discuss the available options with you.','Share your preferred date, time and delivery location in your enquiry. Availability, timing and delivery details are confirmed in conversation.','For care advice, tell us which bouquet or arrangement you are enquiring about. We can discuss guidance for its flowers and presentation.'], eyebrow:'MORE FLORAL INSPIRATION', relatedHeading:'You may also like', enquire:'Enquire', reason:'Enquiry is not configured.', customEyebrow:'LET OLA CREATE.', customHeading:'Something personal, made with flowers.', description:'Tell us the occasion, the mood and your budget. We can discuss a bouquet direction that feels personal to you.', signature:'Flowers made with love', customAction:'Request a custom bouquet' },
  15 |  ru: { titles:['Цветы и сезонные изменения','Дата и запрос о доставке','Советы по уходу'], answers:['Изображения служат вдохновением. Цветы, оттенки и упаковка могут отличаться; доступные варианты мы обсудим с вами.','Укажите желаемую дату, время и место доставки в запросе. Наличие, время и детали доставки уточняются в разговоре.','Для совета по уходу расскажите, какой букет или композиция вас интересует. Мы обсудим уход за цветами и оформление.'], eyebrow:'БОЛЬШЕ ЦВЕТОЧНОГО ВДОХНОВЕНИЯ', relatedHeading:'Вам также может понравиться', enquire:'Узнать', reason:'Связь для запроса пока не настроена.', customEyebrow:'ПОЗВОЛЬТЕ OLA СОЗДАТЬ', customHeading:'Что-то личное, созданное из цветов.', description:'Расскажите о событии, настроении и бюджете. Мы обсудим направление букета, которое подойдёт именно вам.', signature:'Цветы с любовью', customAction:'Запросить индивидуальный букет' },
  16 |  sr: { titles:['Cveće i sezonske promene','Datum i upit za dostavu','Saveti za negu'], answers:['Slike služe kao inspiracija. Cveće, boje i pakovanje mogu da se razlikuju; razgovaraćemo o dostupnim opcijama.','U upitu navedite željeni datum, vreme i mesto dostave. Dostupnost, vreme i detalji dostave potvrđuju se u razgovoru.','Za savet o nezi recite nam koji buket ili aranžman vas zanima. Možemo razgovarati o nezi cveća i njegovoj prezentaciji.'], eyebrow:'JOŠ CVETNE INSPIRACIJE', relatedHeading:'Možda će vam se dopasti', enquire:'Pitajte', reason:'Kontakt za upit još nije podešen.', customEyebrow:'NEKA OLA STVARA', customHeading:'Nešto lično, stvoreno od cveća.', description:'Recite nam povod, raspoloženje i budžet. Možemo razgovarati o buketu koji vam odgovara.', signature:'Cveće s ljubavlju', customAction:'Zatražite buket po meri' }
  17 | };
  18 | const files=['11_similar_peachy.jpg','12_similar_natural.jpg','13_similar_blush.jpg','14_similar_wild.jpg'];
  19 | const names=['Peachy Mood','Natural & Airy','Blush Inspiration','Wild Beauty'];
  20 | const dataUrl=(p:string)=>`data:image/jpeg;base64,${readFileSync(resolve(p)).toString('base64')}`;
  21 | for (const [locale, c] of Object.entries(content)) for (const width of [320,360,599,600,601,768,1099,1100,1101,1440]) test(`${locale} ${width}`, async ({page}) => {
  22 |   const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); }); await page.setViewportSize({width,height:1000});
  23 |   await page.setContent('<!doctype html><html><body><div id="root"></div><script id="data" type="application/json"></script></body></html>');
  24 |  const cards=names.map((title,i)=>({id:String(i),title,image:{src:dataUrl('public/assets/images/bouquet-detail/'+files[i]),alt:title}}));
  25 |  await page.locator('#data').evaluate((el,data)=>{el.textContent=JSON.stringify(data)}, {...c,items:c.titles.map((title,i)=>({title,answer:c.answers[i]})),cards,customImage:{src:dataUrl('public/assets/images/bouquets/11_bouquets_custom.jpg'),alt:''}});
  26 |  await page.addStyleTag({content:`${fontCss} :root{--font-manrope:Manrope;--font-cormorant:'Cormorant Garamond';--font-vibes:'Great Vibes'} *{box-sizing:border-box}body{margin:0;background:#faf7f2}.info{max-width:608px;margin:auto;padding:0 20px}button{max-width:100%;min-height:48px;border:1px solid #d9ccc4;border-radius:24px;padding:8px 16px;background:transparent;color:#655c56;white-space:normal}.reason{font:12px/16px sans-serif;margin:4px 0 0}${css}`}); await page.addScriptTag({content:script});
  27 |    await page.evaluate(async()=>{await document.fonts.ready});
  28 |  expect(await page.evaluate(async () => (await Promise.all(['500 16px Manrope','500 32px "Cormorant Garamond"'].map(f=>document.fonts.load(f,'Hello Цветы Cveće')))).every(f=>f.length>0 && f.every(face=>face.status==='loaded')))).toBe(true);
  29 |  if(locale==='en' && [360,768,1440].includes(width)) await page.screenshot({path:`docs/qa/bouquet-detail/supporting-001/continuation3/initial-${width}.png`,fullPage:true});
  30 |  const cdp = await page.context().newCDPSession(page); const initialAX=await cdp.send('Accessibility.getFullAXTree');
> 31 |  expect(JSON.stringify(initialAX)).toContain(c.answers[0]); expect(JSON.stringify(initialAX)).not.toContain(c.answers[1]);
     |                                    ^ Error: expect(received).toContain(expected) // indexOf
  32 |  const details=page.locator('details'), summaries=page.locator('summary'); await expect(details).toHaveCount(3); await expect(details.nth(0)).toHaveAttribute('open',''); await expect(details.nth(1)).not.toHaveAttribute('open'); await expect(page.getByText(c.answers[1])).toBeHidden();
  33 |  await page.keyboard.press('Tab'); await expect(summaries.nth(0)).toBeFocused(); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await expect(details.nth(1)).toHaveAttribute('open',''); expect(JSON.stringify(await cdp.send('Accessibility.getFullAXTree'))).toContain(c.answers[1]); await page.keyboard.press('Tab'); await page.keyboard.press('Space'); await expect(details.nth(2)).toHaveAttribute('open',''); await expect(details.nth(0)).toHaveAttribute('open','');
  34 |  expect(await summaries.evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44))).toBe(true);
  35 |  await expect(page.locator('article h3')).toHaveText(names); await expect(page.locator('a')).toHaveCount(0); await expect(page.locator('button:disabled')).toHaveCount(5); await expect(page.getByText(c.reason)).toHaveCount(5);
  36 |  await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>(i as HTMLImageElement).decode()))});
  37 |  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true); expect(errors).toEqual([]); expect(page.url()).toBe('about:blank');
  38 |  if(locale==='en' && [360,768,1440].includes(width)) await page.screenshot({path:`docs/qa/bouquet-detail/supporting-001/continuation3/open-${width}.png`,fullPage:true});
  39 | });
  40 | 
```