# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bouquet-detail-preferences.spec.ts >> continuous intrinsic geometry across viewport and constraint boundaries
- Location: tests/e2e/bouquet-detail-preferences.spec.ts:287:5

# Error details

```
Error: fieldsetHeight at 472–480

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 8.9
Received:    18
```

# Page snapshot

```yaml
- region [ref=e3]:
  - group [ref=e4]:
    - paragraph [ref=e6]: Illustrative options; the final bouquet and quote are confirmed on enquiry.
    - radiogroup "Preferred fullness" [ref=e7]:
      - generic [ref=e8]:
        - radio "Standard 1 Standard" [checked] [ref=e9]
        - generic [ref=e10] [cursor=pointer]:
          - img "Standard 1" [ref=e11]
          - generic [ref=e12]: Standard
      - generic [ref=e13]:
        - radio "Medium 2 Medium" [ref=e14]
        - generic [ref=e15] [cursor=pointer]:
          - img "Medium 2" [ref=e16]
          - generic [ref=e17]: Medium
      - generic [ref=e18]:
        - radio "Large 3 Large" [ref=e19]
        - generic [ref=e20] [cursor=pointer]:
          - img "Large 3" [ref=e21]
          - generic [ref=e22]: Large
  - group [ref=e23]:
    - group "Make it more personal" [ref=e25]:
      - generic [ref=e26]:
        - checkbox "Balloons 1 Balloons" [ref=e27]
        - generic [ref=e28] [cursor=pointer]:
          - img "Balloons 1" [ref=e29]
          - generic [ref=e30]: Balloons
      - generic [ref=e31]:
        - checkbox "Chocolates 2 Chocolates" [ref=e32]
        - generic [ref=e33] [cursor=pointer]:
          - img "Chocolates 2" [ref=e34]
          - generic [ref=e35]: Chocolates
      - generic [ref=e36]:
        - checkbox "Greeting card 3" [ref=e37]
        - img "Greeting card 3" [ref=e39] [cursor=pointer]
  - generic [ref=e40]:
    - generic [ref=e41]: Preferred date (optional)
    - textbox "Preferred date (optional)" [ref=e42]:
      - /placeholder: Choose a date
  - generic [ref=e43]:
    - generic [ref=e44]: Card message (optional)
    - textbox "Card message (optional)" [ref=e45]:
      - /placeholder: Your message
```

# Test source

```ts
  236 |       await dateInput.fill('15.06.2026');
  237 |       await page.waitForTimeout(100);
  238 |       await dateInput.blur();
  239 |       await page.evaluate(() => console.log('checkpoint: before error check'));
  240 |       await expect(page.locator(`text=${words.dateFormatError}`)).not.toBeVisible();
  241 |       await page.evaluate(() => console.log('checkpoint: date fixed'));
  242 |       await expect(radios.nth(0)).toBeChecked();
  243 |       await expect(checkboxes.nth(1)).toBeChecked();
  244 |       await expect(checkboxes.nth(2)).toBeChecked();
  245 |       await expect(messageTextarea).toHaveValue('Happy birthday!');
  246 | 
  247 |       // Focus order and visible focus states
  248 |       await page.locator('body').click({ position: { x: 2, y: 2 } });
  249 |       await page.evaluate(() => console.log('checkpoint: body clicked'));
  250 |       await page.keyboard.press('Tab');
  251 |       await page.evaluate(() => console.log('checkpoint: tab 1'));
  252 |       // Tab 1: first radio input focused (or currently selected)
  253 |       await expect(page.locator('input[type="radio"]').first()).toBeFocused();
  254 |       // Arrow right to navigate within radio group
  255 |       await page.keyboard.press('ArrowRight');
  256 |       await page.evaluate(() => console.log('checkpoint: arrow right 1'));
  257 |       await expect(page.locator('input[type="radio"]').nth(1)).toBeFocused();
  258 |       await page.keyboard.press('ArrowRight');
  259 |       await page.evaluate(() => console.log('checkpoint: arrow right 2'));
  260 |       await expect(page.locator('input[type="radio"]').nth(2)).toBeFocused();
  261 |       // Tab out of radio group to first checkbox
  262 |       await page.keyboard.press('Tab');
  263 |       await page.evaluate(() => console.log('checkpoint: tab 2'));
  264 |       await expect(page.locator('input[type="checkbox"]').first()).toBeFocused();
  265 |       await page.keyboard.press('Tab');
  266 |       await page.evaluate(() => console.log('checkpoint: tab 3'));
  267 |       await expect(page.locator('input[type="checkbox"]').nth(1)).toBeFocused();
  268 |       await page.keyboard.press('Tab');
  269 |       await page.evaluate(() => console.log('checkpoint: tab 4'));
  270 |       await expect(page.locator('input[type="checkbox"]').nth(2)).toBeFocused();
  271 |       await page.keyboard.press('Tab');
  272 |       await page.evaluate(() => console.log('checkpoint: tab 5'));
  273 |       await expect(page.locator(`input[placeholder="${words.datePlaceholder}"]`)).toBeFocused();
  274 |       await page.keyboard.press('Tab');
  275 |       await page.evaluate(() => console.log('checkpoint: tab 6'));
  276 |       await expect(page.locator(`textarea[placeholder="${words.messagePlaceholder}"]`)).toBeFocused();
  277 |       await page.evaluate(() => console.log('checkpoint: focus order done'));
  278 | 
  279 |       // No horizontal overflow
  280 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  281 |       expect(page.url()).toBe('about:blank');
  282 |       expect(errors).toEqual([]);
  283 |     });
  284 |   }
  285 | }
  286 | 
  287 | test('continuous intrinsic geometry across viewport and constraint boundaries', async ({ page }) => {
  288 |   await page.setViewportSize({ width: 1440, height: 1200 });
  289 |   await page.setContent('<div id="root"></div><script type="application/json" id="data"></script>');
  290 |   const words = labels.en;
  291 |   const imgs = loadImages(words);
  292 |   await page.locator('#data').evaluate((el, data) => {
  293 |     el.textContent = JSON.stringify(data);
  294 |   }, { labels: words, fullnessImages: imgs.fullness, extraImages: imgs.extras });
  295 |   await page.addStyleTag({ content: `*{box-sizing:border-box}body{margin:0}#root{width:320px}${css}` });
  296 |   await page.addScriptTag({ content: script });
  297 |   const samples = await page.evaluate(() => {
  298 |     const root = document.querySelector<HTMLElement>('#root')!;
  299 |     const fieldset = document.querySelector<HTMLElement>('fieldset')!;
  300 |     const points: Array<number> = [];
  301 |     for (let width = 320; width <= 1440; width += 8) points.push(width);
  302 |     points.push(320, 360, 380, 381, 382, 597, 598, 599, 600, 601, 602, 624, 668, 669, 670, 704, 1440);
  303 |     const uniquePoints = [...new Set(points)].sort((a, b) => a - b);
  304 |     return uniquePoints.map((width) => {
  305 |       root.style.width = `${width}px`;
  306 |       const f = fieldset.getBoundingClientRect();
  307 |       return { width, fieldsetWidth: f.width, fieldsetHeight: f.height };
  308 |     });
  309 |   });
  310 |   console.log('geometry sweep', JSON.stringify(samples));
  311 |   const viewportSamples = [];
  312 |   for (const width of [599, 600, 601]) {
  313 |     await page.setViewportSize({ width, height: 1200 });
  314 |     viewportSamples.push(
  315 |       await page.evaluate((width) => {
  316 |         document.querySelector<HTMLElement>('#root')!.style.width = `${width}px`;
  317 |         const f = document.querySelector<HTMLElement>('fieldset')!.getBoundingClientRect();
  318 |         return { width, fieldsetWidth: f.width, fieldsetHeight: f.height };
  319 |       }, width)
  320 |     );
  321 |   }
  322 |   console.log('viewport boundary', JSON.stringify(viewportSamples));
  323 |   for (let i = 1; i < viewportSamples.length; i++) {
  324 |     for (const key of ['fieldsetWidth', 'fieldsetHeight'] as const) {
  325 |       expect(Math.abs(viewportSamples[i][key] - viewportSamples[i - 1][key]), `viewport ${key}`).toBeLessThanOrEqual(1.2);
  326 |     }
  327 |   }
  328 |   for (let i = 1; i < samples.length; i++) {
  329 |     const a = samples[i - 1];
  330 |     const b = samples[i];
  331 |     const delta = b.width - a.width;
  332 |     // Allow known responsive breakpoint at ~400px where fullness options wrap from 1 col to 2 cols
  333 |     const isKnownBreakpoint = a.width < 400 && b.width >= 400;
  334 |     for (const key of ['fieldsetWidth', 'fieldsetHeight'] as const) {
  335 |       const tolerance = isKnownBreakpoint ? delta * 1.1 + 0.1 + 250 : delta * 1.1 + 0.1;
> 336 |       expect(Math.abs(b[key] - a[key]), `${key} at ${a.width}–${b.width}`).toBeLessThanOrEqual(tolerance);
      |                                                                            ^ Error: fieldsetHeight at 472–480
  337 |     }
  338 |   }
  339 | });
```