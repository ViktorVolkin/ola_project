# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-scroll.spec.ts >> reduced motion from first load and native keyboard/hash navigation
- Location: tests/e2e/motion-scroll.spec.ts:122:5

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 10
Received:   4497

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "OLA Floral Studio" [ref=e6] [cursor=pointer]:
        - /url: /en
        - generic [ref=e7]: OLA
        - generic [ref=e8]: FLORAL STUDIO
      - button "Open navigation" [ref=e11] [cursor=pointer]
  - main [ref=e14]:
    - region [ref=e15]:
      - generic [ref=e17]:
        - paragraph [ref=e18]: FLOWERS & BALLOONS
        - heading "Flowers and balloons for every moment." [level=1] [ref=e19]
        - paragraph [ref=e20]: Modern floral design, stylish balloons and thoughtful gifts in Montenegro.
        - generic [ref=e21]:
          - link "Shop bouquets" [ref=e22] [cursor=pointer]:
            - /url: /en/bouquets
          - button "Let OLA choose" [disabled] [ref=e25]
      - generic [ref=e28]:
        - img "A florist holding a pink bouquet beside rose-gold balloons, with Montenegro’s coast behind her." [ref=e29]
        - paragraph [ref=e31]: More than just flowers
    - region "Flowers, balloons and events" [ref=e32]:
      - link [ref=e33] [cursor=pointer]:
        - /url: /en/bouquets
        - img "Pink peonies, roses and small seasonal flowers." [ref=e35]
        - generic [ref=e38]:
          - heading "Flowers" [level=2] [ref=e39]
          - paragraph [ref=e40]: Bouquets for every occasion
      - link [ref=e44] [cursor=pointer]:
        - /url: /en/balloons
        - img "Pink and rose-gold balloons, including a clear balloon filled with confetti." [ref=e46]
        - generic [ref=e49]:
          - heading "Balloons & Gifts" [level=2] [ref=e50]
          - paragraph [ref=e51]: A little joy for every celebration.
      - link [ref=e55] [cursor=pointer]:
        - /url: /en/weddings-events
        - img "A flower-decorated wedding setting overlooking the sea and mountains." [ref=e57]
        - generic [ref=e60]:
          - heading "Weddings & Events" [level=2] [ref=e61]
          - paragraph [ref=e62]: Flowers and thoughtful details for your day.
    - region [ref=e66]:
      - generic [ref=e67]:
        - paragraph [ref=e68]: POPULAR THIS SEASON
        - heading "Flowers by mood." [level=2] [ref=e69]
        - paragraph [ref=e70]: Choose a style, and we’ll create a bouquet with the freshest seasonal flowers.
        - link "Shop bouquets" [ref=e71] [cursor=pointer]:
          - /url: /en/bouquets
        - link "View all bouquets" [ref=e74] [cursor=pointer]:
          - /url: /en/bouquets
      - region "Bouquets by mood" [ref=e77]:
        - article [ref=e78]:
          - img "A soft pink bouquet of peonies and roses." [ref=e80]
          - heading "Soft & Romantic" [level=3] [ref=e81]
          - 'link "View bouquet: Soft & Romantic" [ref=e82] [cursor=pointer]':
            - /url: /en/bouquets#bouquet-soft-romance
            - text: View bouquet
        - article [ref=e85]:
          - img "A colourful bouquet with pink, peach and cream flowers." [ref=e87]
          - heading "Bright & Joyful" [level=3] [ref=e88]
          - 'link "View bouquet: Bright & Joyful" [ref=e89] [cursor=pointer]':
            - /url: /en/bouquets#bouquet-sunset
            - text: View bouquet
        - article [ref=e92]:
          - img "An airy bouquet of white daisies and cream roses with green foliage." [ref=e94]
          - heading "Natural & Airy" [level=3] [ref=e95]
          - 'link "View bouquet: Natural & Airy" [ref=e96] [cursor=pointer]':
            - /url: /en/bouquets#bouquet-natural-airy
            - text: View bouquet
    - region [ref=e99]:
      - generic [ref=e100]:
        - generic [ref=e101]:
          - paragraph [ref=e102]: LET OLA CREATE
          - heading "Not sure what to choose?" [level=2] [ref=e103]
          - paragraph [ref=e104]: Tell us the occasion, mood and budget. We’ll create something personal.
          - button "Let OLA create" [disabled] [ref=e105]
        - img "A pink and peach bouquet beside a wrapped gift box." [ref=e109]
      - generic [ref=e110]:
        - heading "Make it more personal" [level=3] [ref=e111]
        - paragraph [ref=e112]: Balloons, cards and little extras to complete your gift.
        - generic [ref=e113]:
          - figure "Balloons" [ref=e114]:
            - img "Rose-gold balloons for a gift." [ref=e116]
          - figure "Greeting card" [ref=e118]:
            - img "A greeting card and envelope with pink ribbon." [ref=e120]
          - figure "Chocolates" [ref=e122]:
            - img "An open box of assorted chocolates." [ref=e124]
    - region [ref=e126]:
      - generic [ref=e127]:
        - generic [ref=e128]:
          - paragraph [ref=e129]: MEET OLA
          - heading "A floral studio in Montenegro." [level=2] [ref=e130]
          - paragraph [ref=e131]: Every bouquet is personal and thoughtful.
          - paragraph [ref=e132]: Flowers made with love
          - link "About OLA" [ref=e133] [cursor=pointer]:
            - /url: /en/about
        - img "A florist arranging flowers in a sunlit studio." [ref=e137]
    - region [ref=e138]:
      - generic [ref=e140]:
        - paragraph [ref=e141]: WEDDINGS & EVENTS
        - heading "Flowers for life’s biggest moments." [level=2] [ref=e142]
        - paragraph [ref=e143]: From intimate gatherings to large celebrations. Floral design, balloons and full styling.
        - link "Explore events" [ref=e144] [cursor=pointer]:
          - /url: /en/weddings-events
      - img "A celebration table with flowers and candles overlooking Montenegro’s coastline." [ref=e148]
  - contentinfo [ref=e150]:
    - generic [ref=e152]:
      - generic [ref=e153]:
        - link "OLA Floral Studio" [ref=e154] [cursor=pointer]:
          - /url: /en
          - generic [ref=e155]: OLA
        - paragraph [ref=e156]: Floral studio in Montenegro. Flowers, balloons and thoughtful moments.
      - navigation "Explore OLA" [ref=e157]:
        - link "Bouquets" [ref=e158] [cursor=pointer]:
          - /url: /en/bouquets
        - link "Balloons & Gifts" [ref=e159] [cursor=pointer]:
          - /url: /en/balloons
        - link "Weddings & Events" [ref=e160] [cursor=pointer]:
          - /url: /en/weddings-events
      - generic [ref=e161]:
        - navigation "Studio and enquiries" [ref=e162]:
          - link "About OLA" [ref=e163] [cursor=pointer]:
            - /url: /en/about
          - link "Contact" [ref=e164] [cursor=pointer]:
            - /url: /en/contact
        - button "WhatsApp enquiries" [disabled] [ref=e165]
        - 'button "Language: English" [ref=e169] [cursor=pointer]': EN
  - paragraph [ref=e172]: "WhatsApp enquiries are not available yet: the studio contact has not been configured."
  - alert [ref=e173]
```

# Test source

```ts
  30  |   await page.waitForTimeout(50);
  31  |   const before = await page.evaluate(() => ({y: scrollY, root: document.documentElement.className, focus: document.activeElement?.outerHTML.slice(0, 220)}));
  32  |   expect(before.root).toContain("lenis-smooth");
  33  |   return before;
  34  | }
  35  | 
  36  | for (const action of ["Tab", "fragment", "End", "PageUp", "PageDown", "editable"] as const) {
  37  |   test(`active wheel native handoff: ${action}`, async ({page}, info) => {
  38  |     await page.emulateMedia({reducedMotion: "no-preference"});
  39  |     await page.addInitScript(() => {
  40  |       const events: {key: string; root: string; y: number}[] = [];
  41  |       Object.assign(window, {__preProviderKeys: events});
  42  |       window.addEventListener("keydown", event => events.push({key: event.key, root: document.documentElement.className, y: scrollY}), true);
  43  |     });
  44  |     await page.goto("/en");
  45  |     await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  46  |     if (action === "Tab") {
  47  |       const links = page.locator("footer a[href]");
  48  |       expect(await links.count()).toBeGreaterThan(1);
  49  |       await links.nth((await links.count()) - 2).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
  50  |     } else if (action === "fragment") {
  51  |       await page.getByRole("link", {name: "Skip to content"}).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
  52  |     } else if (action === "editable") {
  53  |       await page.evaluate(() => {
  54  |         const input = document.createElement("input");
  55  |         input.id = "handoff-test-input";
  56  |         input.value = "abcdef";
  57  |         input.style.cssText = "position:fixed;top:100px;left:100px;z-index:99999";
  58  |         document.body.append(input);
  59  |         input.focus({preventScroll: true});
  60  |         input.setSelectionRange(4, 4);
  61  |       });
  62  |     }
  63  |     await page.evaluate(() => window.scrollTo(0, 1500));
  64  |     await page.waitForTimeout(150);
  65  |     await armHandoff(page);
  66  |     const before = await activeWheel(page);
  67  |     if (action === "Tab") {
  68  |       const target = page.locator("footer a[href]").last();
  69  |       expect(await target.evaluate(el => el.getBoundingClientRect().top > innerHeight)).toBe(true);
  70  |       await page.keyboard.press("Tab");
  71  |     } else if (action === "fragment") await page.keyboard.press("Enter");
  72  |     else if (action === "editable") await page.keyboard.press("Shift+ArrowLeft");
  73  |     else await page.keyboard.press(action);
  74  |     await expect.poll(() => page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff.frames.length)).toBe(90);
  75  |     const evidence = await page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff);
  76  |     const key = evidence.events.find(event => event.type === "keydown" && event.key !== "Shift")!;
  77  |     const preKey = await page.evaluate(() => (window as unknown as {__preProviderKeys: {key: string; root: string; y: number}[]}).__preProviderKeys.find(event => event.key !== "Shift"));
  78  |     console.log("NATIVE_HANDOFF", action, JSON.stringify({before, preKey, evidence}));
  79  |     await writeFile(info.outputPath(`${action}.json`), JSON.stringify({before, preKey, evidence}, null, 2));
  80  |     expect(preKey?.root).toContain("lenis-smooth");
  81  |     expect(key.trusted).toBe(true);
  82  |     expect(key.prevented).toBe(false);
  83  |     if (action === "Tab") {
  84  |       await expect(page.locator("footer a[href]").last()).toBeFocused();
  85  |       expect(evidence.frames.slice(-30).every(frame => frame.visible)).toBe(true);
  86  |       expect(Math.max(...evidence.frames.slice(-30).map(frame => frame.y)) - Math.min(...evidence.frames.slice(-30).map(frame => frame.y))).toBeLessThan(2);
  87  |     } else if (action === "fragment") {
  88  |       await expect(page).toHaveURL(/#main-content$/);
  89  |       const click = evidence.events.find(event => event.type === "click");
  90  |       expect(click?.trusted).toBe(true);
  91  |       expect(click?.prevented).toBe(false);
  92  |       expect(await page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  93  |     } else if (action === "editable") {
  94  |       const input = page.locator("#handoff-test-input");
  95  |       await expect(input).toBeFocused();
  96  |       expect(await input.evaluate(el => ({value: (el as HTMLInputElement).value, start: (el as HTMLInputElement).selectionStart, end: (el as HTMLInputElement).selectionEnd}))).toEqual({value: "abcdef", start: 3, end: 4});
  97  |     } else if (action === "End") {
  98  |       expect(await page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  99  |     } else if (action === "PageUp") expect(evidence.frames[89].y).toBeLessThan(key.y - 100);
  100 |     else expect(evidence.frames[89].y).toBeGreaterThan(key.y + 100);
  101 |   });
  102 | }
  103 | 
  104 | 
  105 | test("wheel smoothing and live reduced-motion fallback", async ({page}) => {
  106 |   await page.emulateMedia({reducedMotion: "no-preference"});
  107 |   await page.goto("/en");
  108 |   const root = page.locator("html");
  109 |   await expect(root).toHaveClass(/\blenis\b/);
  110 |   await page.mouse.move(500, 400);
  111 |   await page.mouse.wheel(0, 650);
  112 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  113 |   await page.emulateMedia({reducedMotion: "reduce"});
  114 |   await expect(root).not.toHaveClass(/\blenis\b/);
  115 |   const before = await page.evaluate(() => window.scrollY);
  116 |   await page.mouse.wheel(0, 500);
  117 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  118 |   await page.emulateMedia({reducedMotion: "no-preference"});
  119 |   await expect(root).toHaveClass(/\blenis\b/);
  120 | });
  121 | 
  122 | test("reduced motion from first load and native keyboard/hash navigation", async ({page}) => {
  123 |   await page.emulateMedia({reducedMotion: "reduce"});
  124 |   await page.goto("/en#main-content");
  125 |   await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  126 |   await expect(page.locator("#main-content")).toBeVisible();
  127 |   await page.keyboard.press("End");
  128 |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  129 |   await page.keyboard.press("Home");
> 130 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
      |                                                                ^ Error: expect(received).toBeLessThan(expected)
  131 |   await expect.poll(() => page.evaluate(async () => {
  132 |     const before = window.scrollY;
  133 |     await new Promise((resolve) => setTimeout(resolve, 250));
  134 |     return before === 0 && window.scrollY === 0;
  135 |   })).toBe(true);
  136 |   await page.keyboard.press("PageDown");
  137 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  138 | });
  139 | 
  140 | test("active Lenis interpolates a wheel across animation frames", async ({page}) => {
  141 |   await page.emulateMedia({reducedMotion: "no-preference"});
  142 |   await page.goto("/en");
  143 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  144 |   await page.mouse.move(300, 400);
  145 |   const samples = page.evaluate(() => new Promise<number[]>((resolve) => {
  146 |     const values: number[] = [];
  147 |     const frame = () => {
  148 |       values.push(window.scrollY);
  149 |       if (values.length < 60) requestAnimationFrame(frame);
  150 |       else resolve(values);
  151 |     };
  152 |     requestAnimationFrame(frame);
  153 |   }));
  154 |   await page.mouse.wheel(0, 650);
  155 |   const values = await samples;
  156 |   expect(new Set(values.filter((value) => value > 0)).size).toBeGreaterThan(3);
  157 | });
  158 | 
  159 | test("active motion retains native keyboard navigation", async ({page}) => {
  160 |   await page.emulateMedia({reducedMotion: "no-preference"});
  161 |   await page.goto("/en");
  162 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  163 |   await page.keyboard.press("End");
  164 |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  165 |   await page.keyboard.press("Home");
  166 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  167 |   await expect.poll(() => page.evaluate(async () => {
  168 |     const before = window.scrollY;
  169 |     await new Promise((resolve) => setTimeout(resolve, 250));
  170 |     return before === 0 && window.scrollY === 0;
  171 |   })).toBe(true);
  172 |   await page.keyboard.press("PageDown");
  173 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  174 | });
  175 | 
  176 | test("active motion skip link and browser history preserve native hashes", async ({page}) => {
  177 |   await page.emulateMedia({reducedMotion: "no-preference"});
  178 |   await page.goto("/en");
  179 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  180 |   await page.keyboard.press("Tab");
  181 |   await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
  182 |   await page.keyboard.press("Enter");
  183 |   await expect(page).toHaveURL(/#main-content$/);
  184 |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  185 |   await page.goBack();
  186 |   await expect(page).toHaveURL(/\/en$/);
  187 |   await page.goForward();
  188 |   await expect(page).toHaveURL(/#main-content$/);
  189 |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  190 |   await page.goto("/en#main-content");
  191 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  192 |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  193 | });
  194 | 
  195 | test("short mobile panel scrolls while background remains locked", async ({page}) => {
  196 |   await page.setViewportSize({width: 390, height: 300});
  197 |   await page.emulateMedia({reducedMotion: "no-preference"});
  198 |   await page.goto("/en");
  199 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  200 |   await page.getByRole("button", {name: "Open navigation"}).click();
  201 |   const dialog = page.getByRole("dialog");
  202 |   await expect(dialog).toBeVisible();
  203 |   await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  204 |   await page.mouse.move(4, 4);
  205 |   await page.mouse.wheel(0, 500);
  206 |   await page.waitForTimeout(300);
  207 |   expect(await page.evaluate(() => window.scrollY)).toBe(0);
  208 |   await dialog.hover({position: {x: 150, y: 100}});
  209 |   await page.mouse.wheel(0, 400);
  210 |   await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  211 |   await page.keyboard.press("Escape");
  212 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  213 | });
  214 | 
  215 | test("mobile modal suspends Lenis and restores it on Escape", async ({page}) => {
  216 |   await page.setViewportSize({width: 390, height: 700});
  217 |   await page.emulateMedia({reducedMotion: "no-preference"});
  218 |   await page.goto("/en");
  219 |   const root = page.locator("html");
  220 |   await expect(root).toHaveClass(/\blenis\b/);
  221 |   const trigger = page.getByRole("button", {name: "Open navigation"});
  222 |   await trigger.click();
  223 |   await expect(page.getByRole("dialog")).toBeVisible();
  224 |   await expect(root).not.toHaveClass(/\blenis\b/);
  225 |   await page.keyboard.press("Escape");
  226 |   await expect(trigger).toBeFocused();
  227 |   await expect(root).toHaveClass(/\blenis\b/);
  228 | });
  229 | 
```