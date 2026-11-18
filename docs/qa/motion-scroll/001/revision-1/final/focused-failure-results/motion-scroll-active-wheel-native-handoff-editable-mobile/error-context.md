# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-scroll.spec.ts >> active wheel native handoff: editable
- Location: tests/e2e/motion-scroll.spec.ts:37:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 90
Received: 91

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
  - textbox [active] [ref=e174]: abcdef
```

# Test source

```ts
  1   | import {expect, test, type Page} from "@playwright/test";
  2   | import {writeFile} from "node:fs/promises";
  3   | 
  4   | type HandoffEvidence = {events: {type: string; key: string; trusted: boolean; prevented: boolean; y: number; focus: string}[]; frames: {y: number; focus: string; visible: boolean}[]};
  5   | 
  6   | async function armHandoff(page: Page) {
  7   |   await page.evaluate(() => {
  8   |     const evidence: HandoffEvidence = {events: [], frames: []};
  9   |     Object.assign(window, {__nativeHandoff: evidence});
  10  |     const describe = () => {
  11  |       const el = document.activeElement as HTMLElement | null;
  12  |       const r = el?.getBoundingClientRect();
  13  |       return {y: scrollY, focus: el?.outerHTML.slice(0, 220) ?? "", visible: !!r && r.bottom > 0 && r.top < innerHeight};
  14  |     };
  15  |     for (const type of ["keydown", "click", "focusin"]) document.addEventListener(type, event => {
  16  |       const entry = {type, key: event instanceof KeyboardEvent ? event.key : "", trusted: event.isTrusted, prevented: event.defaultPrevented, y: scrollY, focus: describe().focus};
  17  |       evidence.events.push(entry);
  18  |       queueMicrotask(() => { entry.prevented = event.defaultPrevented; });
  19  |       if (type === "keydown" && evidence.frames.length === 0) {
  20  |         const tick = () => { evidence.frames.push(describe()); if (evidence.frames.length < 90) requestAnimationFrame(tick); };
  21  |         requestAnimationFrame(tick);
  22  |       }
  23  |     }, {capture: true});
  24  |   });
  25  | }
  26  | 
  27  | async function activeWheel(page: Page) {
  28  |   await page.mouse.move(200, 300);
  29  |   await page.mouse.wheel(0, 1000);
  30  |   await page.waitForTimeout(50);
  31  |   const before = await page.evaluate(() => ({y: scrollY, root: document.documentElement.className, focus: document.activeElement?.outerHTML.slice(0, 220)}));
  32  |   expect(before.root).toContain("lenis-smooth");
  33  |   return before;
  34  | }
  35  | 
  36  | for (const action of ["Tab", "fragment", "End", "PageUp", "PageDown", "editable"] as const) {
  37  |   test(`active wheel native handoff: ${action}`, async ({page}, info) => {
  38  |     await page.emulateMedia({reducedMotion: "no-preference"});
  39  |     await page.goto("/en");
  40  |     await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  41  |     if (action === "Tab") {
  42  |       const links = page.locator("footer a[href]");
  43  |       expect(await links.count()).toBeGreaterThan(1);
  44  |       await links.nth((await links.count()) - 2).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
  45  |     } else if (action === "fragment") {
  46  |       await page.getByRole("link", {name: "Skip to content"}).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
  47  |     } else if (action === "editable") {
  48  |       await page.evaluate(() => {
  49  |         const input = document.createElement("input");
  50  |         input.id = "handoff-test-input";
  51  |         input.value = "abcdef";
  52  |         input.style.cssText = "position:fixed;top:100px;left:100px;z-index:99999";
  53  |         document.body.append(input);
  54  |         input.focus({preventScroll: true});
  55  |         input.setSelectionRange(4, 4);
  56  |       });
  57  |     }
  58  |     await page.evaluate(() => window.scrollTo(0, 1500));
  59  |     await page.waitForTimeout(150);
  60  |     await armHandoff(page);
  61  |     const before = await activeWheel(page);
  62  |     if (action === "Tab") {
  63  |       const target = page.locator("footer a[href]").last();
  64  |       expect(await target.evaluate(el => el.getBoundingClientRect().top > innerHeight)).toBe(true);
  65  |       await page.keyboard.press("Tab");
  66  |     } else if (action === "fragment") await page.keyboard.press("Enter");
  67  |     else if (action === "editable") await page.keyboard.press("Shift+ArrowLeft");
  68  |     else await page.keyboard.press(action);
> 69  |     await expect.poll(() => page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff.frames.length)).toBe(90);
      |                                                                                                                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  70  |     const evidence = await page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff);
  71  |     const key = evidence.events.find(event => event.type === "keydown" && event.key !== "Shift")!;
  72  |     console.log("NATIVE_HANDOFF", action, JSON.stringify({before, evidence}));
  73  |     await writeFile(info.outputPath(`${action}.json`), JSON.stringify({before, evidence}, null, 2));
  74  |     expect(key.trusted).toBe(true);
  75  |     expect(key.prevented).toBe(false);
  76  |     if (action === "Tab") {
  77  |       await expect(page.locator("footer a[href]").last()).toBeFocused();
  78  |       expect(evidence.frames.slice(-30).every(frame => frame.visible)).toBe(true);
  79  |       expect(Math.max(...evidence.frames.slice(-30).map(frame => frame.y)) - Math.min(...evidence.frames.slice(-30).map(frame => frame.y))).toBeLessThan(2);
  80  |     } else if (action === "fragment") {
  81  |       await expect(page).toHaveURL(/#main-content$/);
  82  |       const click = evidence.events.find(event => event.type === "click");
  83  |       expect(click?.trusted).toBe(true);
  84  |       expect(click?.prevented).toBe(false);
  85  |       expect(await page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  86  |     } else if (action === "editable") {
  87  |       const input = page.locator("#handoff-test-input");
  88  |       await expect(input).toBeFocused();
  89  |       expect(await input.evaluate(el => ({value: (el as HTMLInputElement).value, start: (el as HTMLInputElement).selectionStart, end: (el as HTMLInputElement).selectionEnd}))).toEqual({value: "abcdef", start: 3, end: 4});
  90  |     } else if (action === "End") {
  91  |       expect(await page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  92  |     } else if (action === "PageUp") expect(evidence.frames[89].y).toBeLessThan(key.y - 100);
  93  |     else expect(evidence.frames[89].y).toBeGreaterThan(key.y + 100);
  94  |   });
  95  | }
  96  | 
  97  | 
  98  | test("wheel smoothing and live reduced-motion fallback", async ({page}) => {
  99  |   await page.emulateMedia({reducedMotion: "no-preference"});
  100 |   await page.goto("/en");
  101 |   const root = page.locator("html");
  102 |   await expect(root).toHaveClass(/\blenis\b/);
  103 |   await page.mouse.move(500, 400);
  104 |   await page.mouse.wheel(0, 650);
  105 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  106 |   await page.emulateMedia({reducedMotion: "reduce"});
  107 |   await expect(root).not.toHaveClass(/\blenis\b/);
  108 |   const before = await page.evaluate(() => window.scrollY);
  109 |   await page.mouse.wheel(0, 500);
  110 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  111 |   await page.emulateMedia({reducedMotion: "no-preference"});
  112 |   await expect(root).toHaveClass(/\blenis\b/);
  113 | });
  114 | 
  115 | test("reduced motion from first load and native keyboard/hash navigation", async ({page}) => {
  116 |   await page.emulateMedia({reducedMotion: "reduce"});
  117 |   await page.goto("/en#main-content");
  118 |   await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  119 |   await expect(page.locator("#main-content")).toBeVisible();
  120 |   await page.keyboard.press("End");
  121 |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  122 |   await page.keyboard.press("Home");
  123 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  124 |   await expect.poll(() => page.evaluate(async () => {
  125 |     const before = window.scrollY;
  126 |     await new Promise((resolve) => setTimeout(resolve, 250));
  127 |     return before === 0 && window.scrollY === 0;
  128 |   })).toBe(true);
  129 |   await page.keyboard.press("PageDown");
  130 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  131 | });
  132 | 
  133 | test("active Lenis interpolates a wheel across animation frames", async ({page}) => {
  134 |   await page.emulateMedia({reducedMotion: "no-preference"});
  135 |   await page.goto("/en");
  136 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  137 |   await page.mouse.move(300, 400);
  138 |   const samples = page.evaluate(() => new Promise<number[]>((resolve) => {
  139 |     const values: number[] = [];
  140 |     const frame = () => {
  141 |       values.push(window.scrollY);
  142 |       if (values.length < 60) requestAnimationFrame(frame);
  143 |       else resolve(values);
  144 |     };
  145 |     requestAnimationFrame(frame);
  146 |   }));
  147 |   await page.mouse.wheel(0, 650);
  148 |   const values = await samples;
  149 |   expect(new Set(values.filter((value) => value > 0)).size).toBeGreaterThan(3);
  150 | });
  151 | 
  152 | test("active motion retains native keyboard navigation", async ({page}) => {
  153 |   await page.emulateMedia({reducedMotion: "no-preference"});
  154 |   await page.goto("/en");
  155 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  156 |   await page.keyboard.press("End");
  157 |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  158 |   await page.keyboard.press("Home");
  159 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  160 |   await expect.poll(() => page.evaluate(async () => {
  161 |     const before = window.scrollY;
  162 |     await new Promise((resolve) => setTimeout(resolve, 250));
  163 |     return before === 0 && window.scrollY === 0;
  164 |   })).toBe(true);
  165 |   await page.keyboard.press("PageDown");
  166 |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  167 | });
  168 | 
  169 | test("active motion skip link and browser history preserve native hashes", async ({page}) => {
```