import { test, expect } from '@playwright/test';
for (const locale of ['en','ru','sr']) for (const width of [320,360,768,1440]) test(`measurement ${locale} ${width}`, async ({page}) => {
  await page.setViewportSize({width,height:1000}); await page.goto(`/${locale}/fixture/detail-page`);
  await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map(i=>(i as HTMLImageElement).decode()));});
  const result=await page.locator('main').evaluate(main=>{
    const fields=[...main.querySelectorAll('fieldset')].slice(0,2);
    const rect=(e:Element)=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}};
    const groups=fields.map(f=>[...f.querySelectorAll('label')].map(label=>({box:rect(label),caption:label.textContent?.trim(),text:[...label.querySelectorAll('span')].filter(e=>e.children.length===0 && e.textContent?.trim()).map(e=>({text:e.textContent?.trim(),box:rect(e),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,words:(e.textContent||'').match(/\S+/g)?.map(word=>{const node=e.firstChild!; const text=node.textContent||''; const start=text.indexOf(word); const range=document.createRange(); range.setStart(node,start); range.setEnd(node,start+word.length); return {word,rects:[...range.getClientRects()].map(r=>({x:r.x,y:r.y,width:r.width,height:r.height}))};})}))})));
    return {groups,viewportOverflow:document.documentElement.scrollWidth>innerWidth};
  });
  console.log('MEASUREMENT',locale,width,JSON.stringify(result)); expect(result.viewportOverflow).toBe(false);
  for(const group of result.groups) for(const label of group) for(const text of label.text){expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth+1); expect(text.scrollHeight).toBeLessThanOrEqual(text.clientHeight+1); for(const word of text.words||[]){expect(word.rects.length).toBe(1); for(const r of word.rects){expect(r.x).toBeGreaterThanOrEqual(label.box.x-1);expect(r.x+r.width).toBeLessThanOrEqual(label.box.x+label.box.width+1);}}}
});
test('focus-visible radio and checkbox',async({page})=>{
 await page.setViewportSize({width:360,height:1000}); await page.goto('/ru/fixture/detail-page'); await page.evaluate(()=>document.fonts.ready);
 for(const type of ['radio','checkbox']) {const input=page.locator(`main input[type=${type}]`).first(); await input.focus(); const style=await input.evaluate(e=>{const s=getComputedStyle(e.nextElementSibling!);return {outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineColor:s.outlineColor,outlineOffset:s.outlineOffset,focusVisible:e.matches(':focus-visible')}}); console.log('FOCUS',type,JSON.stringify(style)); expect(style.focusVisible).toBe(true);expect(style.outlineStyle).toBe('solid');expect(style.outlineWidth).toBe('3px'); await input.locator('..').screenshot({path:`docs/qa/bouquet-detail/preview-visual-001/controls-finish-001/verification-final/focus-${type}-ru-360.png`});}
});
