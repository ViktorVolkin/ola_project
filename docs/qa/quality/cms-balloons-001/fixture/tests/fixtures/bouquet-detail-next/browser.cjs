(async () => {
const {chromium} = await import('@playwright/test');
const fs = await import('node:fs');
const out = process.env.FIXTURE_EVIDENCE || '/workspace/docs/qa/bouquet-detail/next-validation-001';
fs.mkdirSync(out,{recursive:true});
const baseURL = process.env.FIXTURE_BASE_URL || 'http://127.0.0.1:3217';
const widths = [320,360,599,600,601,768,1099,1100,1101,1440];
const locales = ['en','ru','sr'];
const paths = ['01_bouquet_detail_main.jpg','02_detail_thumb1.jpg','03_detail_thumb2.jpg','04_detail_closeup.jpg'];
  const browser = await chromium.launch({headless:true});
  const results=[];
  async function run(locale,width) {
    const context=await browser.newContext({viewport:{width,height:1000}}), page=await context.newPage();
    const errors=[], checks=[];
    page.on('pageerror', e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
    const check=(name,ok,detail='')=>checks.push({name,ok:!!ok,detail});
    try {
      const url=`${baseURL}/${locale}/fixture/detail`;
      const resp=await page.goto(url,{waitUntil:'networkidle'});
      check('HTTP 200',resp.status()===200,String(resp.status()));
      await page.evaluate(()=>document.fonts.ready);
      if(locale==='en' && [360,768,1440].includes(width)) await page.screenshot({path:`${out}/initial-${locale}-${width}.png`,fullPage:true});
      const extra=await page.locator('main').evaluate(main=>{
        const intersect=(a,b)=>a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top;
        const cards=[...main.querySelectorAll('article')], section=[...main.querySelectorAll('section')].find(s=>s.querySelector('img[src*="11_bouquets_custom"]'));
        const wordIssues=[];
        for(const el of [...cards.map(c=>c.querySelector('h3')),section.querySelector('h2'),section.querySelector('[class*="description"]')]) {
          const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let node;
          while((node=walker.nextNode())) for(const match of node.data.matchAll(/\S+/gu)) {const r=document.createRange();r.setStart(node,match.index);r.setEnd(node,match.index+match[0].length);if(r.getClientRects().length>1)wordIssues.push(match[0]);}
        }
        const bounds=cards.map(c=>{const photo=c.querySelector('img').getBoundingClientRect(),caption=c.querySelector('h3').getBoundingClientRect(),action=c.querySelector('button').getBoundingClientRect();return {imageCaption:intersect(photo,caption),imageAction:intersect(photo,action),captionAction:intersect(caption,action)};});
        return {wordIssues,bounds};
      });
      check('whole words and support bounds',extra.wordIssues.length===0 && extra.bounds.every(b=>!b.imageCaption&&!b.imageAction&&!b.captionAction),JSON.stringify(extra));
      const gallery=page.locator('main section').first(), main=gallery.locator(':scope > img'), buttons=gallery.getByRole('button');
      check('widgets present',await buttons.count()===4 && await page.locator('main input[type=radio]').count()===3 && await page.locator('main details').count()===3);
      for(let i=0;i<4;i++) {
        await buttons.nth(i).click();
        const img=await main.evaluate(async e=>{await e.decode();return {src:e.getAttribute('src'),alt:e.alt}});
        const pressed=await buttons.evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-pressed')));
        check(`gallery ${i}`,img.src.endsWith(paths[i]) && !!img.alt && pressed.every((p,j)=>p===(i===j?'true':'false')),JSON.stringify(img));
      }
      await buttons.nth(0).focus(); await page.keyboard.press('Enter'); check('gallery keyboard focus',await buttons.nth(0).evaluate(e=>e===document.activeElement) && await buttons.nth(0).getAttribute('aria-pressed')==='true');
      const radios=page.locator('main input[type=radio]'), boxes=page.locator('main input[type=checkbox]');
      check('standard default',await radios.nth(0).isChecked() && !(await radios.nth(1).isChecked()) && !(await radios.nth(2).isChecked()));
      check('extras default zero',await boxes.count()===3 && !(await boxes.nth(0).isChecked()) && !(await boxes.nth(1).isChecked()) && !(await boxes.nth(2).isChecked()));
      await radios.nth(1).locator('..').click(); check('radio exclusive',await radios.nth(1).isChecked() && !(await radios.nth(0).isChecked()));
      await boxes.nth(0).locator('..').click(); await boxes.nth(2).locator('..').click(); check('checkbox independent',await boxes.nth(0).isChecked() && !(await boxes.nth(1).isChecked()) && await boxes.nth(2).isChecked());
      const msg=page.locator('#card-message'); await msg.fill('Hello'); await boxes.nth(2).locator('..').click(); check('message preserved',await msg.inputValue()==='Hello');
      const date=page.locator('#preferred-date'); await date.focus(); await date.blur(); check('empty optional date valid',await date.getAttribute('aria-invalid')==='false');
      await date.fill('31.02.2026'); await date.blur(); check('malformed date error',await date.getAttribute('aria-invalid')==='true' && await page.locator('main').getByRole('alert').count()===1);
      await date.fill('28.02.2026'); await date.blur(); check('valid date',await date.getAttribute('aria-invalid')==='false');
      check('no min/max invented',await date.getAttribute('min')===null && await date.getAttribute('max')===null);
      const details=page.locator('main details'); check('initial details',await details.nth(0).getAttribute('open')!==null && await details.nth(1).getAttribute('open')===null && !(await details.nth(1).locator('p').isVisible()));
      const session=await context.newCDPSession(page); let ax=JSON.stringify(await session.send('Accessibility.getFullAXTree')); const hidden=await details.nth(1).locator('p').textContent(); check('closed answer excluded AX',!ax.includes(hidden));
      await details.nth(1).locator('summary').focus(); await page.keyboard.press('Enter'); ax=JSON.stringify(await session.send('Accessibility.getFullAXTree')); check('keyboard open and AX',await details.nth(1).getAttribute('open')!==null && ax.includes(hidden) && await details.nth(0).getAttribute('open')!==null);
      await details.nth(2).locator('summary').focus(); await page.keyboard.press('Space'); check('keyboard multiopen',await details.nth(2).getAttribute('open')!==null && await details.nth(1).getAttribute('open')!==null);
      check('disabled actions no links',await page.locator('main button:disabled').count()===5 && await page.locator('main a').count()===0);
      const images=await page.locator('main img').evaluateAll(async els=>Promise.all(els.map(async e=>{try{await e.decode()}catch(err){return {error:String(err),src:e.currentSrc}}; const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {src:e.currentSrc,width:r.width,height:r.height,position:s.position,sizes:e.getAttribute('sizes'),naturalWidth:e.naturalWidth}})));
      check('all images decode',images.every(i=>!i.error),JSON.stringify(images.filter(i=>i.error)));
      const nextImages=images.filter(i=>i.src.includes('/_next/image')); check('real optimized Next images',nextImages.length===11,`count ${nextImages.length}`);
      check('next fill geometry',nextImages.filter(i=>i.position==='absolute').every(i=>i.width>0 && i.height>0),JSON.stringify(nextImages.filter(i=>i.position==='absolute').map(({width,height,sizes})=>({width,height,sizes}))));
      const overlap=await page.locator('main').evaluate(main=>{
        const intersects=(a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return x.left<y.right && x.right>y.left && x.top<y.bottom && x.bottom>y.top};
        const cards=[...main.querySelectorAll('article')].map(a=>({title:a.querySelector('h3')?.textContent,overlap:intersects(a.querySelector('img'),a.querySelector('h3'))}));
        const custom=[...main.querySelectorAll('section')].find(s=>s.querySelector('img[src*="11_bouquets_custom"]'));
        return {cards,custom:custom ? intersects(custom.querySelector('img'),custom.querySelector('h2')) : null};
      });
      check('support images do not overlap text',overlap.cards.every(c=>!c.overlap) && overlap.custom===false,JSON.stringify(overlap));
      check('no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.evaluate(()=>document.fonts.ready); check('fonts loaded',await page.evaluate(()=>document.fonts.status==='loaded'));
      check('no browser errors',errors.length===0,JSON.stringify(errors));
      if(locale==='en' && [360,768,1440].includes(width)) await page.screenshot({path:`${out}/next-${locale}-${width}.png`,fullPage:true});
    } catch(e) {check('execution',false,String(e));}
    results.push({locale,width,checks,errors}); await context.close();
    console.log(locale,width,checks.filter(c=>!c.ok).map(c=>c.name).join(', ')||'PASS');
  }
  await run('en',360);
  if(results[0].checks.some(c=>!c.ok && ['HTTP 200','widgets present','execution','all images decode','no browser errors'].includes(c.name))) {fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2)); await browser.close(); process.exit(1)}
  for(const locale of locales) for(const width of widths) if(!(locale==='en' && width===360)) await run(locale,width);
  fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
  await browser.close(); process.exit(results.some(r=>r.checks.some(c=>!c.ok))?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
