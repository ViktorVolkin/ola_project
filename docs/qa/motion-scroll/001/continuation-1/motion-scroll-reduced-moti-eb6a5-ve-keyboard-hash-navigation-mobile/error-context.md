# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-scroll.spec.ts >> reduced motion from first load and native keyboard/hash navigation
- Location: tests/e2e/motion-scroll.spec.ts:20:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 100
Received:   0

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
  1   | import {expect, test} from "@playwright/test";
  2   | 
  3   | test("wheel smoothing and live reduced-motion fallback", async ({page}) => {
  4   |   await page.emulateMedia({reducedMotion: "no-preference"});
  5   |   await page.goto("/en");
  6   |   const root = page.locator("html");
  7   |   await expect(root).toHaveClass(/\blenis\b/);
  8   |   await page.mouse.move(500, 400);
  9   |   await page.mouse.wheel(0, 650);
  10  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  11  |   await page.emulateMedia({reducedMotion: "reduce"});
  12  |   await expect(root).not.toHaveClass(/\blenis\b/);
  13  |   const before = await page.evaluate(() => window.scrollY);
  14  |   await page.mouse.wheel(0, 500);
  15  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  16  |   await page.emulateMedia({reducedMotion: "no-preference"});
  17  |   await expect(root).toHaveClass(/\blenis\b/);
  18  | });
  19  | 
  20  | test("reduced motion from first load and native keyboard/hash navigation", async ({page}) => {
  21  |   await page.emulateMedia({reducedMotion: "reduce"});
  22  |   await page.goto("/en#main-content");
  23  |   await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  24  |   await expect(page.locator("#main-content")).toBeVisible();
  25  |   await page.keyboard.press("End");
  26  |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  27  |   await page.keyboard.press("Home");
  28  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  29  |   await page.keyboard.press("PageDown");
> 30  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
      |                                                                ^ Error: expect(received).toBeGreaterThan(expected)
  31  | });
  32  | 
  33  | test("active Lenis interpolates a wheel across animation frames", async ({page}) => {
  34  |   await page.emulateMedia({reducedMotion: "no-preference"});
  35  |   await page.goto("/en");
  36  |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  37  |   await page.mouse.move(300, 400);
  38  |   const samples = page.evaluate(() => new Promise<number[]>((resolve) => {
  39  |     const values: number[] = [];
  40  |     const frame = () => {
  41  |       values.push(window.scrollY);
  42  |       if (values.length < 60) requestAnimationFrame(frame);
  43  |       else resolve(values);
  44  |     };
  45  |     requestAnimationFrame(frame);
  46  |   }));
  47  |   await page.mouse.wheel(0, 650);
  48  |   const values = await samples;
  49  |   expect(new Set(values.filter((value) => value > 0)).size).toBeGreaterThan(3);
  50  | });
  51  | 
  52  | test("active motion retains native keyboard navigation", async ({page}) => {
  53  |   await page.emulateMedia({reducedMotion: "no-preference"});
  54  |   await page.goto("/en");
  55  |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  56  |   await page.keyboard.press("End");
  57  |   await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  58  |   await page.keyboard.press("Home");
  59  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  60  |   await page.keyboard.press("PageDown");
  61  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  62  | });
  63  | 
  64  | test("active motion skip link and browser history preserve native hashes", async ({page}) => {
  65  |   await page.emulateMedia({reducedMotion: "no-preference"});
  66  |   await page.goto("/en");
  67  |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  68  |   await page.keyboard.press("Tab");
  69  |   await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
  70  |   await page.keyboard.press("Enter");
  71  |   await expect(page).toHaveURL(/#main-content$/);
  72  |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  73  |   await page.goBack();
  74  |   await expect(page).toHaveURL(/\/en$/);
  75  |   await page.goForward();
  76  |   await expect(page).toHaveURL(/#main-content$/);
  77  |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  78  |   await page.goto("/en#main-content");
  79  |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  80  |   await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  81  | });
  82  | 
  83  | test("short mobile panel scrolls while background remains locked", async ({page}) => {
  84  |   await page.setViewportSize({width: 390, height: 300});
  85  |   await page.emulateMedia({reducedMotion: "no-preference"});
  86  |   await page.goto("/en");
  87  |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  88  |   await page.getByRole("button", {name: "Open navigation"}).click();
  89  |   const dialog = page.getByRole("dialog");
  90  |   await expect(dialog).toBeVisible();
  91  |   await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  92  |   await page.mouse.move(4, 4);
  93  |   await page.mouse.wheel(0, 500);
  94  |   await page.waitForTimeout(300);
  95  |   expect(await page.evaluate(() => window.scrollY)).toBe(0);
  96  |   await dialog.hover({position: {x: 150, y: 100}});
  97  |   await page.mouse.wheel(0, 400);
  98  |   await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  99  |   await page.keyboard.press("Escape");
  100 |   await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  101 | });
  102 | 
  103 | test("mobile modal suspends Lenis and restores it on Escape", async ({page}) => {
  104 |   await page.setViewportSize({width: 390, height: 700});
  105 |   await page.emulateMedia({reducedMotion: "no-preference"});
  106 |   await page.goto("/en");
  107 |   const root = page.locator("html");
  108 |   await expect(root).toHaveClass(/\blenis\b/);
  109 |   const trigger = page.getByRole("button", {name: "Open navigation"});
  110 |   await trigger.click();
  111 |   await expect(page.getByRole("dialog")).toBeVisible();
  112 |   await expect(root).not.toHaveClass(/\blenis\b/);
  113 |   await page.keyboard.press("Escape");
  114 |   await expect(trigger).toBeFocused();
  115 |   await expect(root).toHaveClass(/\blenis\b/);
  116 | });
  117 | 
```