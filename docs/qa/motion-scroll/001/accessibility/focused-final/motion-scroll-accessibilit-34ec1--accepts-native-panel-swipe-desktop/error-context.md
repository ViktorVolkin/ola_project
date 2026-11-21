# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-scroll-accessibility.spec.ts >> touch-emulated short menu accepts native panel swipe
- Location: tests/e2e/motion-scroll-accessibility.spec.ts:115:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic:
  - link [aria-hidden]:
    - /url: "#main-content"
    - text: Skip to content
  - banner [aria-hidden]:
    - generic:
      - generic:
        - link:
          - /url: /en
          - generic: OLA
          - generic: FLORAL STUDIO
      - generic:
        - generic:
          - button [expanded]
  - main [aria-hidden]:
    - region:
      - generic:
        - generic:
          - paragraph: FLOWERS & BALLOONS
          - heading [level=1]: Flowers and balloons for every moment.
          - paragraph: Modern floral design, stylish balloons and thoughtful gifts in Montenegro.
          - generic:
            - link:
              - /url: /en/bouquets
              - text: Shop bouquets
            - button [disabled]: Let OLA choose
      - generic:
        - paragraph: More than just flowers
    - region:
      - link:
        - /url: /en/bouquets
        - generic:
          - generic:
            - heading [level=2]: Flowers
            - paragraph: Bouquets for every occasion
      - link:
        - /url: /en/balloons
        - generic:
          - generic:
            - heading [level=2]: Balloons & Gifts
            - paragraph: A little joy for every celebration.
      - link:
        - /url: /en/weddings-events
        - generic:
          - generic:
            - heading [level=2]: Weddings & Events
            - paragraph: Flowers and thoughtful details for your day.
    - region:
      - generic:
        - paragraph: POPULAR THIS SEASON
        - heading [level=2]: Flowers by mood.
        - paragraph: Choose a style, and we’ll create a bouquet with the freshest seasonal flowers.
        - link:
          - /url: /en/bouquets
          - text: Shop bouquets
        - link:
          - /url: /en/bouquets
          - text: View all bouquets
      - region:
        - article:
          - heading [level=3]: Soft & Romantic
          - link:
            - /url: /en/bouquets#bouquet-soft-romance
            - text: View bouquet
        - article:
          - heading [level=3]: Bright & Joyful
          - link:
            - /url: /en/bouquets#bouquet-sunset
            - text: View bouquet
        - article:
          - heading [level=3]: Natural & Airy
          - link:
            - /url: /en/bouquets#bouquet-natural-airy
            - text: View bouquet
    - region:
      - generic:
        - generic:
          - paragraph: LET OLA CREATE
          - heading [level=2]: Not sure what to choose?
          - paragraph: Tell us the occasion, mood and budget. We’ll create something personal.
          - button [disabled]: Let OLA create
      - generic:
        - heading [level=3]: Make it more personal
        - paragraph: Balloons, cards and little extras to complete your gift.
        - generic:
          - figure:
            - generic: Balloons
          - figure:
            - generic: Greeting card
          - figure:
            - generic: Chocolates
    - region:
      - generic:
        - generic:
          - paragraph: MEET OLA
          - heading [level=2]: A floral studio in Montenegro.
          - paragraph: Every bouquet is personal and thoughtful.
          - paragraph: Flowers made with love
          - link:
            - /url: /en/about
            - text: About OLA
    - region:
      - generic:
        - generic:
          - paragraph: WEDDINGS & EVENTS
          - heading [level=2]: Flowers for life’s biggest moments.
          - paragraph: From intimate gatherings to large celebrations. Floral design, balloons and full styling.
          - link:
            - /url: /en/weddings-events
            - text: Explore events
  - contentinfo [aria-hidden]:
    - generic:
      - generic:
        - link:
          - /url: /en
          - generic: OLA
        - paragraph: Floral studio in Montenegro. Flowers, balloons and thoughtful moments.
      - navigation:
        - link:
          - /url: /en/bouquets
          - text: Bouquets
        - link:
          - /url: /en/balloons
          - text: Balloons & Gifts
        - link:
          - /url: /en/weddings-events
          - text: Weddings & Events
      - generic:
        - navigation:
          - link:
            - /url: /en/about
            - text: About OLA
          - link:
            - /url: /en/contact
            - text: Contact
        - button [disabled]: WhatsApp enquiries
        - generic:
          - button: EN
  - paragraph [aria-hidden]: "WhatsApp enquiries are not available yet: the studio contact has not been configured."
  - alert
  - dialog [ref=e2]:
    - heading "Main navigation" [level=2] [ref=e3]
    - button "Close navigation" [active] [ref=e4] [cursor=pointer]
    - navigation "Main navigation" [ref=e7]:
      - link "Bouquets" [ref=e8] [cursor=pointer]:
        - /url: /en/bouquets
      - link "Balloons & Gifts" [ref=e9] [cursor=pointer]:
        - /url: /en/balloons
      - link "Weddings & Events" [ref=e10] [cursor=pointer]:
        - /url: /en/weddings-events
      - link "About" [ref=e11] [cursor=pointer]:
        - /url: /en/about
      - link "Contact" [ref=e12] [cursor=pointer]:
        - /url: /en/contact
    - button "Order via WhatsApp" [disabled] [ref=e14]
    - paragraph [ref=e17]: Montenegro
    - 'button "Language: English" [ref=e19] [cursor=pointer]': EN
```

# Test source

```ts
  26  |     await page.keyboard.press("Tab");
  27  |     await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
  28  |     await page.keyboard.press("Enter");
  29  |     await expect(page).toHaveURL(/#main-content$/);
  30  |     await expect.poll(() => page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  31  |     observations.push({step: "skip", ...(await state(page))});
  32  |     const target = page.locator("footer a[href]").last();
  33  |     await target.focus();
  34  |     await expect(target).toBeFocused();
  35  |     await expect.poll(() => target.evaluate(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })).toBe(true);
  36  |     await settled(page);
  37  |     observations.push({step: "offscreen focus", ...(await state(page))});
  38  |     await page.goto("/en/about");
  39  |     await page.keyboard.press("End");
  40  |     await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  41  |     await settled(page);
  42  |     await page.keyboard.press("Home");
  43  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  44  |     await settled(page);
  45  |     observations.push({step: "home settled", ...(await state(page))});
  46  |     await page.keyboard.press("PageDown");
  47  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  48  |     await settled(page);
  49  |     observations.push({step: "page down", ...(await state(page))});
  50  |     const link = page.getByRole("banner").getByRole("link", {name: "Contact", exact: true});
  51  |     await link.focus();
  52  |     await settled(page);
  53  |     const beforeRoute = await page.evaluate(() => scrollY);
  54  |     await link.click();
  55  |     await expect(page).toHaveURL(/\/en\/contact$/);
  56  |     observations.push({step: "contact", ...(await state(page))});
  57  |     await page.goBack();
  58  |     await expect(page).toHaveURL(/\/en\/about$/);
  59  |     await settled(page);
  60  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(beforeRoute, 0);
  61  |     observations.push({step: "back", beforeRoute, ...(await state(page))});
  62  |     await page.goForward();
  63  |     await expect(page).toHaveURL(/\/en\/contact$/);
  64  |     await settled(page);
  65  |     observations.push({step: "forward", ...(await state(page))});
  66  |     const header = page.getByRole("banner");
  67  |     await header.getByRole("button", {name: /Language/}).click();
  68  |     await header.getByRole("link", {name: "Srpski", exact: true}).click();
  69  |     await expect(page).toHaveURL(/\/sr\/contact$/);
  70  |     await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
  71  |     observations.push({step: "locale", ...(await state(page))});
  72  |     await info.attach("focus-history.json", {body: JSON.stringify(observations, null, 2), contentType: "application/json"});
  73  |   });
  74  | }
  75  | 
  76  | for (const [locale, {Navigation: labels}] of Object.entries({en, ru, sr})) {
  77  |   for (const width of [360, 768, 1440]) {
  78  |     test(`${locale} ${width}: static chrome, controls and focus bounds`, async ({page}, info) => {
  79  |       await page.setViewportSize({width, height: 900});
  80  |       await page.emulateMedia({reducedMotion: "no-preference"});
  81  |       await page.goto(`/${locale}/about`);
  82  |       await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  83  |       await page.evaluate(() => document.fonts.ready);
  84  |       const header = page.getByRole("banner");
  85  |       const control = width < 1000 ? header.locator('button[aria-haspopup="dialog"]') : header.getByRole("navigation", {name: labels.navigation});
  86  |       await expect(control).toBeVisible();
  87  |       if (width < 1000) {
  88  |         await control.focus();
  89  |         await expect(control).toBeFocused();
  90  |         await control.click();
  91  |         await expect(page.getByRole("dialog")).toBeVisible();
  92  |       }
  93  |       const scope = width < 1000 ? page.getByRole("dialog") : control;
  94  |       const metrics = await scope.locator("a:visible, button:visible").evaluateAll(elements => elements.map(el => {
  95  |         const r = el.getBoundingClientRect(), css = getComputedStyle(el);
  96  |         return {text: el.textContent?.trim(), x: r.x, y: r.y, width: r.width, height: r.height, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, color: css.color, font: css.fontFamily};
  97  |       }));
  98  |       expect(metrics.length).toBeGreaterThan(0);
  99  |       for (const r of metrics) {
  100 |         expect(r.width).toBeGreaterThan(0);
  101 |         expect(r.x).toBeGreaterThanOrEqual(-1);
  102 |         expect(r.x + r.width).toBeLessThanOrEqual(width + 1);
  103 |         expect(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth + 1);
  104 |       }
  105 |       await info.attach("bounds.json", {body: JSON.stringify(metrics, null, 2), contentType: "application/json"});
  106 |       await page.screenshot({path: info.outputPath("chrome.png")});
  107 |       if (width < 1000) {
  108 |         await page.keyboard.press("Escape");
  109 |         await expect(control).toBeFocused();
  110 |       }
  111 |     });
  112 |   }
  113 | }
  114 | 
  115 | test("touch-emulated short menu accepts native panel swipe", async ({browser}, info) => {
  116 |   const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 390, height: 300}, hasTouch: true, isMobile: true, reducedMotion: "no-preference"});
  117 |   const page = await context.newPage();
  118 |   await page.goto("/en");
  119 |   await page.getByRole("button", {name: "Open navigation"}).tap();
  120 |   const panel = page.getByRole("dialog");
  121 |   await expect(panel).toBeVisible();
  122 |   const box = (await panel.boundingBox())!;
  123 |   const session = await context.newCDPSession(page);
  124 |   const x = box.x + box.width / 2, y = Math.min(box.y + box.height - 30, 260);
  125 |   await session.send("Input.synthesizeScrollGesture", {x, y, yDistance: -180, gestureSourceType: "touch", speed: 600});
> 126 |   await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      |                                                               ^ Error: expect(received).toBeGreaterThan(expected)
  127 |   await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  128 |   await info.attach("touch.json", {body: JSON.stringify({panelScroll: await panel.evaluate(el => el.scrollTop), windowScroll: await page.evaluate(() => scrollY), box}, null, 2), contentType: "application/json"});
  129 |   await context.close();
  130 | });
  131 | 
  132 | test("current SSR and hydrated reduced and normal chrome at rest", async ({browser}, info) => {
  133 |   const samples = [];
  134 |   for (const mode of ["no-js", "reduce", "normal"] as const) {
  135 |     const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 1440, height: 900}, javaScriptEnabled: mode !== "no-js", reducedMotion: mode === "reduce" ? "reduce" : "no-preference"});
  136 |     const page = await context.newPage();
  137 |     await page.goto("/en/about");
  138 |     await page.evaluate(() => document.fonts.ready);
  139 |     if (mode === "normal") await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  140 |     const sample = await page.locator("header").evaluate(el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el); return {x: r.x, y: r.y, width: r.width, height: r.height, color: c.color, font: c.fontFamily}; });
  141 |     samples.push({mode, ...sample});
  142 |     await page.screenshot({path: info.outputPath(`${mode}.png`)});
  143 |     await context.close();
  144 |   }
  145 |   expect(samples[1].height).toBe(samples[0].height);
  146 |   expect(samples[2].height).toBe(samples[0].height);
  147 |   await info.attach("render-comparison.json", {body: JSON.stringify(samples, null, 2), contentType: "application/json"});
  148 | });
  149 | 
```