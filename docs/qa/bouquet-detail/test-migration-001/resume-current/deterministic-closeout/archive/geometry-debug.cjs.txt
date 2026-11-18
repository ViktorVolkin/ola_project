const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1200}});
  await page.goto('http://localhost:3310/en/fixture/detail?widget=preferences');
  await page.waitForLoadState('networkidle');
  
  const widths = [456, 460, 464, 472];
  
  for (const width of widths) {
    await page.setViewportSize({width, height: 1200});
    await page.waitForTimeout(100);
    
    const data = await page.evaluate(() => {
      const root = document.querySelector('#preference-container');
      if (!root) return {error: 'no preference-container'};
      root.style.maxWidth = 'none';
      root.style.width = `${width}px`;
      
      const fieldset = root.querySelector('[class*="fieldset"]');
      if (!fieldset) {
        // Debug: find all elements with class containing fieldset
        const all = [...root.querySelectorAll('[class*="fieldset"i]')];
        return {error: 'no fieldset', allClasses: all.map(e => e.className)};
      }
      const f = fieldset.getBoundingClientRect();
      
      // Get all radio labels
      const labels = [...root.querySelectorAll('[class*="fullnessOption"]')];
      const cards = labels.map(label => {
        const box = label.getBoundingClientRect();
        const caption = label.querySelector('[class*="radioLabelText"]');
        const captionBox = caption ? caption.getBoundingClientRect() : null;
        const helper = root.querySelector('[class*="helper"]');
        const helperBox = helper ? helper.getBoundingClientRect() : null;
        return {
          box: {x: box.x, y: box.y, width: box.width, height: box.height},
          caption: captionBox ? {x: captionBox.x, y: captionBox.y, width: captionBox.width, height: captionBox.height} : null,
          helper: helperBox ? {x: helperBox.x, y: helperBox.y, width: helperBox.width, height: helperBox.height} : null,
        };
      });
      
      return {width, fieldset: {width: f.width, height: f.height}, cards};
    });
    
    console.log('Raw data:', JSON.stringify(data, null, 2));
    console.log(`\n=== Width ${width} ===`);
    if (data.error) {
      console.log('Error:', data.error);
      if (data.allClasses) console.log('All fieldset-like classes:', data.allClasses);
      continue;
    }
    console.log(`Fieldset: ${data.fieldset.width.toFixed(4)} x ${data.fieldset.height.toFixed(4)}`);
    data.cards.forEach((c, i) => {
      console.log(`  Card ${i}: pos=(${c.box.x.toFixed(1)}, ${c.box.y.toFixed(1)}) size=${c.box.width.toFixed(4)}x${c.box.height.toFixed(4)}`);
      if (c.caption) console.log(`    Caption: pos=(${c.caption.x.toFixed(1)}, ${c.caption.y.toFixed(1)}) size=${c.caption.width.toFixed(4)}x${c.caption.height.toFixed(4)}`);
    });
    if (data.cards[0]?.helper) console.log(`  Helper: pos=(${data.cards[0].helper.x.toFixed(1)}, ${data.cards[0].helper.y.toFixed(1)}) size=${data.cards[0].helper.width.toFixed(4)}x${data.cards[0].helper.height.toFixed(4)}`);
  }
  
  await browser.close();
})();