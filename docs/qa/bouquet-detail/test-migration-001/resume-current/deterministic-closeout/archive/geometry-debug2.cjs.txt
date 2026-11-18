const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1200}});
  await page.goto('http://localhost:3310/en/fixture/detail?widget=preferences');
  await page.waitForLoadState('networkidle');
  
  // Use the same selector as the test
  const root = await page.locator('#preference-container');
  await root.evaluate(el => { el.style.maxWidth = 'none'; });
  
  const widths = [456, 460, 464, 472, 359, 360, 361];
  
  for (const width of widths) {
    await page.setViewportSize({width, height: 1200});
    await page.waitForTimeout(100);
    await root.evaluate(el => { el.style.width = `${width}px`; });
    
    const data = await root.evaluate(() => {
      const root = document.querySelector('#preference-container');
      const fieldset = root.querySelector('fieldset');
      const f = fieldset.getBoundingClientRect();
      
      // Get all radio labels
      const labels = [...root.querySelectorAll('input[type="radio"]')].map(e => e.parentElement);
      const cards = labels.map(label => {
        const box = label.getBoundingClientRect();
        const caption = label.querySelector('[class*="radioLabelText"]');
        const captionBox = caption ? caption.getBoundingClientRect() : null;
        return {
          box: {x: box.x, y: box.y, width: box.width, height: box.height},
          caption: captionBox ? {x: captionBox.x, y: captionBox.y, width: captionBox.width, height: captionBox.height} : null,
        };
      });
      
      // Compute signature like the test
      const ys = cards.map(c => Math.round(c.box.y));
      const first = ys[0];
      const signature = cards.map((c, i) => {
        const caption = c.caption;
        const lineCount = caption ? Math.round(caption.height / 20) : 1;
        return [ys[i] === first ? 0 : ys[i] > first ? 1 : -1, lineCount];
      });
      
      const helper = root.querySelector('[class*="helper"]');
      const helperBox = helper ? helper.getBoundingClientRect() : null;
      const legend = root.querySelector('legend');
      const legendBox = legend ? legend.getBoundingClientRect() : null;
      
      return {
        width,
        fieldset: {width: f.width, height: f.height},
        cards,
        signature,
        helper: helperBox ? {x: helperBox.x, y: helperBox.y, width: helperBox.width, height: helperBox.height} : null,
        legend: legendBox ? {x: legendBox.x, y: legendBox.y, width: legendBox.width, height: legendBox.height} : null,
      };
    });
    
    console.log(`\n=== Width ${width} ===`);
    console.log(`Fieldset: ${data.fieldset.width.toFixed(4)} x ${data.fieldset.height.toFixed(4)}`);
    console.log(`Signature: ${JSON.stringify(data.signature)}`);
    data.cards.forEach((c, i) => {
      console.log(`  Card ${i}: pos=(${c.box.x.toFixed(1)}, ${c.box.y.toFixed(1)}) size=${c.box.width.toFixed(4)}x${c.box.height.toFixed(4)}`);
      if (c.caption) console.log(`    Caption: pos=(${c.caption.x.toFixed(1)}, ${c.caption.y.toFixed(1)}) size=${c.caption.width.toFixed(4)}x${c.caption.height.toFixed(4)}`);
    });
    if (data.helper) console.log(`  Helper: pos=(${data.helper.x.toFixed(1)}, ${data.helper.y.toFixed(1)}) size=${data.helper.width.toFixed(4)}x${data.helper.height.toFixed(4)}`);
    if (data.legend) console.log(`  Legend: pos=(${data.legend.x.toFixed(1)}, ${data.legend.y.toFixed(1)}) size=${data.legend.width.toFixed(4)}x${data.legend.height.toFixed(4)}`);
  }
  
  await browser.close();
})();