# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: weddings.spec.ts >> en: Weddings header modal focus, nested language, dismissal and resize
- Location: tests/e2e/weddings.spec.ts:78:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('header button[aria-haspopup="dialog"]')
    - locator resolved to <button disabled type="button" data-state="closed" aria-expanded="false" aria-haspopup="dialog" aria-label="Open navigation" class="Header_menuButton___uWKx">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - link "OLA Floral Studio" [ref=e6] [cursor=pointer]:
          - /url: /en
          - text: OLA FLORAL STUDIO
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
      - generic [ref=e13]:
        - text: Montenegro
        - 'button "Language: EN — English" [disabled] [ref=e16]': EN
        - button "Order via WhatsApp" [disabled] [ref=e20]
        - generic [ref=e23]:
          - text: Weddings
          - button "Open navigation" [disabled] [ref=e24]
  - main [ref=e27]:
    - region [ref=e28]:
      - generic [ref=e30]:
        - paragraph [ref=e31]:
          - link "Home" [ref=e32] [cursor=pointer]:
            - /url: /en
          - text: / Weddings & Events
        - heading "Weddings & Events" [level=1] [ref=e33]
        - paragraph [ref=e34]: Flowers for life’s biggest moments.
        - paragraph [ref=e35]: Floral ideas for intimate gatherings and grand celebrations, inspired by your style and Montenegro.
        - button "Plan your event" [disabled] [ref=e36]
      - generic [ref=e39]:
        - img "A celebration table with flowers and glassware." [ref=e40]
        - paragraph [aria-hidden] [ref=e41]: Unforgettable Moments
    - region [ref=e42]:
      - heading "Event services" [level=2] [ref=e43]
      - list [ref=e45]:
        - listitem [ref=e46]:
          - img "A bride holding a floral bouquet." [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - heading "Weddings" [level=3] [ref=e50]
              - paragraph [ref=e51]: Bridal bouquets, ceremony and venue flowers.
            - button "Weddings" [disabled] [ref=e52]
        - listitem [ref=e55]:
          - img "Flowers and table details for a private celebration." [ref=e56]
          - generic [ref=e57]:
            - generic [ref=e58]:
              - heading "Private Events" [level=3] [ref=e59]
              - paragraph [ref=e60]: Floral ideas for birthdays, anniversaries and engagements.
            - button "Private Events" [disabled] [ref=e61]
        - listitem [ref=e64]:
          - img "Floral details in an event setting." [ref=e65]
          - generic [ref=e66]:
            - generic [ref=e67]:
              - heading "Corporate Events" [level=3] [ref=e68]
              - paragraph [ref=e69]: Floral styling ideas for business gatherings.
            - button "Corporate Events" [disabled] [ref=e70]
        - listitem [ref=e73]:
          - img "Decorative details for an event setting." [ref=e74]
          - generic [ref=e75]:
            - generic [ref=e76]:
              - heading "Event Rentals" [level=3] [ref=e77]
              - paragraph [ref=e78]: Ask about arches and event styling details.
            - button "Event Rentals" [disabled] [ref=e79]
    - region [ref=e82]:
      - generic [ref=e83]:
        - generic [ref=e84]:
          - paragraph [ref=e85]: OUR APPROACH
          - heading "Every event is a unique story." [level=2] [ref=e86]
          - paragraph [ref=e87]: Tell us about the atmosphere you imagine. Together, we can explore flowers, colours and details that reflect your style.
          - link "Our process" [ref=e88] [cursor=pointer]:
            - /url: "#our-process"
        - img "A floral centerpiece arranged for a celebration table." [ref=e91]
    - region [ref=e92]:
      - generic [ref=e94]:
        - paragraph [ref=e95]: OUR PROCESS
        - heading "A thoughtful process, from first conversation to event day." [level=2] [ref=e96]
        - list [ref=e97]:
          - listitem [ref=e98]:
            - text: "01"
            - generic [ref=e99]:
              - heading "Consultation" [level=3] [ref=e100]
              - paragraph [ref=e101]: Tell us about your event, style and wishes.
          - listitem [ref=e102]:
            - text: "02"
            - generic [ref=e103]:
              - heading "Design proposal" [level=3] [ref=e104]
              - paragraph [ref=e105]: Explore a floral direction, palette and moodboard.
          - listitem [ref=e106]:
            - text: "03"
            - generic [ref=e107]:
              - heading "Preparation" [level=3] [ref=e108]
              - paragraph [ref=e109]: Plan the floral details, materials and finishing touches.
          - listitem [ref=e110]:
            - text: "04"
            - generic [ref=e111]:
              - heading "Event day" [level=3] [ref=e112]
              - paragraph [ref=e113]: Discuss timing, delivery and on-site arrangements.
    - region [ref=e114]:
      - generic [ref=e115]:
        - paragraph [ref=e116]: EVENT INSPIRATION
        - heading "Moments to imagine." [level=2] [ref=e117]
        - generic [ref=e118]:
          - figure "Wedding ceremony" [ref=e119]:
            - img "A flower-decorated wedding ceremony setting." [ref=e120]
          - figure "Private dinner" [ref=e122]:
            - img "A dinner table with flowers and decorative details." [ref=e123]
          - figure "Engagement" [ref=e125]:
            - img "Flowers arranged for an intimate celebration." [ref=e126]
          - figure "Corporate gathering" [ref=e128]:
            - img "Floral decor in a gathering space." [ref=e129]
        - button "Discuss your event" [disabled] [ref=e131]
    - region [ref=e134]:
      - generic [ref=e135]:
        - paragraph [ref=e136]: LET’S PLAN TOGETHER
        - heading "Tell us about your event" [level=2] [ref=e137]
        - paragraph [ref=e138]: Share your event ideas, date and location to start the conversation.
        - button "Contact us via WhatsApp" [disabled] [ref=e139]
        - paragraph [aria-hidden] [ref=e142]: More than just flowers
      - img "A bride with a floral bouquet." [ref=e143]
  - contentinfo [ref=e144]:
    - generic [ref=e145]:
      - generic [ref=e146]:
        - link "OLA Floral Studio" [ref=e147] [cursor=pointer]:
          - /url: /en
          - text: OLA
        - paragraph [ref=e148]: Floral studio in Montenegro. Flowers, balloons and thoughtful moments.
      - navigation "Explore OLA" [ref=e149]:
        - link "Bouquets" [ref=e150] [cursor=pointer]:
          - /url: /en/bouquets
        - link "Balloons & Gifts" [ref=e151] [cursor=pointer]:
          - /url: /en/balloons
        - link "Weddings & Events" [ref=e152] [cursor=pointer]:
          - /url: /en/weddings-events
      - generic [ref=e153]:
        - navigation "Studio and enquiries" [ref=e154]:
          - link "About OLA" [ref=e155] [cursor=pointer]:
            - /url: /en/about
          - link "Contact" [ref=e156] [cursor=pointer]:
            - /url: /en/contact
        - button "WhatsApp enquiries" [disabled] [ref=e157]
        - 'button "Language: EN — English" [disabled] [ref=e161]': EN
  - paragraph [ref=e164]: "WhatsApp enquiries are not available yet: the studio contact has not been configured."
```

# Test source

```ts
  1   | import {expect, test} from "@playwright/test";
  2   | import {getWeddingsContent} from "../../src/content/weddings";
  3   | import en from "../../src/i18n/messages/en.json";
  4   | import ru from "../../src/i18n/messages/ru.json";
  5   | import sr from "../../src/i18n/messages/sr.json";
  6   | 
  7   | for (const locale of ["en", "ru", "sr"] as const) {
  8   |   const labels = {en, ru, sr}[locale].Navigation;
  9   | 
  10  |   test(`${locale}: Weddings sections, process anchor and honest enquiry subjects`, async ({page}) => {
  11  |     const copy = getWeddingsContent(locale);
  12  |     const response = await page.goto(`/${locale}/weddings-events`);
  13  |     expect(response?.status()).toBe(200);
  14  |     await expect(page.locator("main")).toHaveAttribute("data-locale", locale);
  15  |     await expect(page.getByRole("heading", {level: 1})).toHaveText(copy.hero.title);
  16  |     const sections = page.locator("main > section");
  17  |     await expect(sections).toHaveCount(6);
  18  |     expect(await sections.evaluateAll(nodes => nodes.map(node => node.getAttribute("data-weddings-section") || node.id))).toEqual([
  19  |       "hero", "categories", "approach", "our-process", "inspiration", "cta"
  20  |     ]);
  21  |     await expect(page.locator("main img")).toHaveCount(11);
  22  |     await expect(page.locator("#our-process ol > li")).toHaveCount(4);
  23  |     await page.locator('main a[href="#our-process"]').click();
  24  |     await expect(page).toHaveURL(/#our-process$/);
  25  |     await expect(page.locator("#our-process")).toBeInViewport();
  26  |     await expect(page.locator('main a[href="#"]')).toHaveCount(0);
  27  |     await expect(page.locator('main a[href*="wa.me"], main a[href*="whatsapp"]')).toHaveCount(0);
  28  |     const enquiries = page.locator('main button[aria-describedby="enquiry-unavailable"]');
  29  |     await expect(enquiries).toHaveCount(7);
  30  |     for (const button of await enquiries.all()) await expect(button).toBeDisabled();
  31  |     const categories = page.locator('[data-weddings-section="categories"] button');
  32  |     expect(await categories.evaluateAll(nodes => nodes.map(node => node.getAttribute("data-enquiry-subject")))).toEqual(copy.categories.map(item => item.title));
  33  |     const subject = copy.hero.title.replace(/\n/g, " ");
  34  |     for (const name of ["hero", "inspiration", "cta"]) {
  35  |       await expect(page.locator(`[data-weddings-section="${name}"] button`)).toHaveAttribute("data-enquiry-subject", subject);
  36  |     }
  37  |   });
  38  | 
  39  |   test(`${locale}: Weddings continuous widths and native reference compositions`, async ({page}) => {
  40  |     const errors: string[] = [];
  41  |     page.on("pageerror", error => errors.push(error.message));
  42  |     await page.goto(`/${locale}/weddings-events`);
  43  |     for (const width of [320, 360, 390, 430, 599, 600, 601, 639, 640, 641, 767, 768, 769, 900, 1024, 1199, 1200, 1201, 1279, 1280, 1281, 1366, 1440, 1600]) {
  44  |       await page.setViewportSize({width, height: 900});
  45  |       const geometry = await page.locator("main h1, main h2, main h3, main p, main button, main figure, main figcaption").evaluateAll(nodes => ({
  46  |         overflow: document.documentElement.scrollWidth > innerWidth + 1,
  47  |         clippedText: nodes.filter(node => /^(H1|H2|H3|P|FIGCAPTION)$/.test(node.tagName) && node.clientWidth > 2 && node.scrollWidth > node.clientWidth + 1).map(node => node.textContent),
  48  |         outside: nodes.filter(node => {
  49  |           const box = node.getBoundingClientRect();
  50  |           // The visually-hidden category heading/button labels are deliberately clipped.
  51  |           return box.width > 2 && (box.left < -1 || box.right > innerWidth + 1);
  52  |         }).map(node => ({tag: node.tagName, text: node.textContent?.slice(0, 60)}))
  53  |       }));
  54  |       expect(geometry.overflow, `document overflow at ${width}`).toBe(false);
  55  |       expect(geometry.clippedText, `clipped text at ${width}`).toEqual([]);
  56  |       expect(geometry.outside, `content outside ${width}`).toEqual([]);
  57  |     }
  58  |     for (const [width, columns, heroFont, processFont] of [[360, 1, 38, 32], [768, 2, 44, 36], [1440, 4, 80, 36]] as const) {
  59  |       await page.setViewportSize({width, height: 900});
  60  |       expect(await page.locator('#weddings-title').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeCloseTo(heroFont, 1);
  61  |       expect(await page.locator('#weddings-process-title').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeCloseTo(processFont, 1);
  62  |       for (const selector of ['[data-weddings-section="categories"] li', '[data-weddings-section="inspiration"] figure', '#our-process ol > li']) {
  63  |         const rows = await page.locator(selector).evaluateAll(nodes => {
  64  |           const counts: Record<string, number> = {};
  65  |           for (const node of nodes) {
  66  |             const row = Math.round(node.getBoundingClientRect().top);
  67  |             counts[row] = (counts[row] || 0) + 1;
  68  |           }
  69  |           return Object.values(counts);
  70  |         });
  71  |         expect(rows.every(count => count === columns), `${selector} at ${width}`).toBe(true);
  72  |       }
  73  |     }
  74  |     await expect(page.locator('[data-weddings-section="cta"] img')).toHaveCSS("object-position", "50% 0%");
  75  |     expect(errors).toEqual([]);
  76  |   });
  77  | 
  78  |   test(`${locale}: Weddings header modal focus, nested language, dismissal and resize`, async ({page}) => {
  79  |     await page.setViewportSize({width: 768, height: 700});
  80  |     await page.goto(`/${locale}/weddings-events`);
  81  |     await expect(page.locator('header span[aria-current="page"]')).toHaveText(labels.eventsShort);
  82  |     const trigger = page.locator('header button[aria-haspopup="dialog"]');
  83  |     const dialog = page.getByRole("dialog", {name: labels.navigation});
> 84  |     await trigger.click();
      |                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  85  |     await expect(dialog).toBeVisible();
  86  |     const beforeScroll = await page.evaluate(() => scrollY);
  87  |     await page.mouse.move(700, 650);
  88  |     await page.mouse.wheel(0, 400);
  89  |     await page.waitForTimeout(100);
  90  |     expect(await page.evaluate(() => scrollY)).toBe(beforeScroll);
  91  |     const focusable = dialog.locator('a[href], button:not(:disabled)');
  92  |     const focusCount = await focusable.count();
  93  |     for (let i = 0; i <= focusCount; i++) {
  94  |       await page.keyboard.press("Tab");
  95  |       expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  96  |     }
  97  |     await page.keyboard.press("Shift+Tab");
  98  |     expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  99  |     const language = dialog.getByRole("button", {name: new RegExp(`^${labels.language}:`)});
  100 |     await language.click();
  101 |     await dialog.getByRole("link", {name: "English", exact: true}).focus();
  102 |     await page.keyboard.press("Escape");
  103 |     await expect(language).toHaveAttribute("aria-expanded", "false");
  104 |     await expect(language).toBeFocused();
  105 |     await expect(dialog).toBeVisible();
  106 |     await page.keyboard.press("Escape");
  107 |     await expect(dialog).toBeHidden();
  108 |     await expect(trigger).toBeFocused();
  109 |     await trigger.click();
  110 |     await dialog.getByRole("button", {name: labels.close, exact: true}).click();
  111 |     await expect(dialog).toBeHidden();
  112 |     await expect(trigger).toBeFocused();
  113 |     await trigger.click();
  114 |     await page.locator("[data-navigation-overlay]").click({position: {x: 5, y: 5}});
  115 |     await expect(dialog).toBeHidden();
  116 |     await trigger.click();
  117 |     await dialog.getByRole("link", {name: labels.events, exact: true}).click();
  118 |     await expect(dialog).toBeHidden();
  119 |     await trigger.click();
  120 |     await page.setViewportSize({width: 1440, height: 900});
  121 |     await expect(dialog).toBeHidden();
  122 |     await expect(page.getByRole("banner").getByRole("link", {name: labels.events, exact: true})).toHaveAttribute("aria-current", "page");
  123 |     await page.setViewportSize({width: 360, height: 800});
  124 |     await expect(page.locator('header span[aria-current="page"]')).toBeHidden();
  125 |     await expect(trigger).toHaveAttribute("aria-expanded", "false");
  126 |   });
  127 | 
  128 |   test(`${locale}: Weddings language switching preserves route, query and anchor`, async ({page}) => {
  129 |     await page.setViewportSize({width: 1440, height: 900});
  130 |     await page.goto(`/${locale}/weddings-events?source=qa#our-process`);
  131 |     const target = locale === "sr" ? "en" : "sr";
  132 |     await page.getByRole("banner").getByRole("button", {name: new RegExp(`^${labels.language}:`)}).click();
  133 |     await page.getByRole("banner").getByRole("link", {name: target === "en" ? "English" : "Srpski", exact: true}).click();
  134 |     await expect(page).toHaveURL(`/${target}/weddings-events?source=qa#our-process`);
  135 |     await expect(page.getByRole("heading", {level: 1})).toHaveText(getWeddingsContent(target).hero.title);
  136 |   });
  137 | }
  138 | 
```