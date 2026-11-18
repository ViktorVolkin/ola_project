# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: motion-scroll-accessibility.spec.ts >> ru 360: static chrome, controls and focus bounds
- Location: tests/e2e/motion-scroll-accessibility.spec.ts:79:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('banner')

```

# Page snapshot

```yaml
- generic:
  - link [aria-hidden]:
    - /url: "#main-content"
    - text: Перейти к содержимому
  - banner [aria-hidden]:
    - generic:
      - generic:
        - link:
          - /url: /ru
          - generic: OLA
          - generic: FLORAL STUDIO
      - generic:
        - generic:
          - button [expanded]
  - main [aria-hidden]:
    - region:
      - generic:
        - generic:
          - paragraph: ОБ OLA
          - heading [level=1]: Цветы со смыслом.
          - paragraph: Продуманный цветочный дизайн для дорогих вам людей и важных моментов.
          - link:
            - /url: "#our-story"
            - text: Наша история
      - generic:
        - paragraph: Больше, чем просто цветы
    - region:
      - generic:
        - generic:
          - paragraph: НАША ИСТОРИЯ
          - heading [level=2]: Нас вдохновляют люди, места и моменты.
          - generic:
            - paragraph: Мы создаём цветочные композиции с естественным современным характером. Каждый дизайн начинается с продуманного выбора цвета, фактуры и формы.
            - paragraph: От первого стебля до завершающей упаковки композиция складывается из палитры, силуэта и настроения события.
        - generic:
          - paragraph: Черногория в каждом букете
    - region:
      - generic:
        - list:
          - listitem:
            - generic: Сезонные цветы
          - listitem:
            - generic: Внимание к деталям
          - listitem:
            - generic: Индивидуальный дизайн
          - listitem:
            - generic: Личный подход
    - region:
      - generic:
        - paragraph: НАШ СТИЛЬ
        - heading [level=2]: Естественно. Современно. С душой.
        - paragraph: Выразительные цветы, продуманные палитры и детали формируют эстетику OLA.
        - link:
          - /url: /ru/bouquets
          - text: Посмотреть букеты
    - region:
      - generic:
        - generic:
          - paragraph: Цветы для особенных мест
        - generic:
          - paragraph: ПОЧЕМУ OLA
          - heading [level=2]: Внимание к деталям меняет всё.
          - paragraph: Цвет, форма и фактура соединяются в композициях, созданных с вниманием и личным подходом.
          - list:
            - listitem:
              - generic:
                - strong: Продуманный цвет
                - generic: Сбалансированные оттенки оставляют место самовыражению.
            - listitem:
              - generic:
                - strong: Выразительная композиция
                - generic: Форма, фактура и детали создают целостный образ.
            - listitem:
              - generic:
                - strong: Завершённость деталей
                - generic: Небольшие решения дополняют композицию.
            - listitem:
              - generic:
                - strong: Личный отправной пункт
                - generic: Начинаем с ваших пожеланий и настроения.
    - region:
      - generic:
        - paragraph: Особенные моменты начинаются здесь
      - generic:
        - generic:
          - paragraph: СОЗДАДИМ ВМЕСТЕ
          - heading [level=2]: Расскажите о своей идее.
          - paragraph: Поделитесь моментом, настроением или деталями, которые вы задумали.
          - button [disabled]: Написать нам в WhatsApp
  - contentinfo [aria-hidden]:
    - generic:
      - generic:
        - link:
          - /url: /ru
          - generic: OLA
        - paragraph: Цветочная студия в Черногории. Цветы, шары и особенные моменты.
      - navigation:
        - link:
          - /url: /ru/bouquets
          - text: Букеты
        - link:
          - /url: /ru/balloons
          - text: Шары и подарки
        - link:
          - /url: /ru/weddings-events
          - text: Свадьбы и события
      - generic:
        - navigation:
          - link:
            - /url: /ru/about
            - text: О студии OLA
          - link:
            - /url: /ru/contact
            - text: Контакты
        - button [disabled]: Написать в WhatsApp
        - generic:
          - button: RU
  - paragraph [aria-hidden]: "Обращения в WhatsApp пока недоступны: контакт студии ещё не настроен."
  - alert
  - dialog [ref=e2]:
    - heading "Основная навигация" [level=2] [ref=e3]
    - button "Закрыть навигацию" [active] [ref=e4] [cursor=pointer]
    - navigation "Основная навигация" [ref=e7]:
      - link "Букеты" [ref=e8] [cursor=pointer]:
        - /url: /ru/bouquets
      - link "Шары и подарки" [ref=e9] [cursor=pointer]:
        - /url: /ru/balloons
      - link "Свадьбы и события" [ref=e10] [cursor=pointer]:
        - /url: /ru/weddings-events
      - link "О студии" [ref=e11] [cursor=pointer]:
        - /url: /ru/about
      - link "Контакты" [ref=e12] [cursor=pointer]:
        - /url: /ru/contact
    - button "Заказать в WhatsApp" [disabled] [ref=e14]
    - paragraph [ref=e17]: Черногория
    - 'button "Язык: Русский" [ref=e19] [cursor=pointer]': RU
```

# Test source

```ts
  1   | import {expect, test, type Page} from "@playwright/test";
  2   | import en from "../../src/i18n/messages/en.json";
  3   | import ru from "../../src/i18n/messages/ru.json";
  4   | import sr from "../../src/i18n/messages/sr.json";
  5   | import {writeFile} from "node:fs/promises";
  6   | 
  7   | async function state(page: Page) {
  8   |   return page.evaluate(() => ({url: location.href, y: scrollY, root: document.documentElement.className, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, focus: document.activeElement?.outerHTML.slice(0, 300)}));
  9   | }
  10  | 
  11  | async function settled(page: Page) {
  12  |   await page.evaluate(() => new Promise<void>((resolve, reject) => {
  13  |     let last = scrollY, stable = 0, frames = 0;
  14  |     const tick = () => { stable = Math.abs(scrollY - last) < 0.5 ? stable + 1 : 0; last = scrollY; if (stable >= 12) resolve(); else if (++frames > 360) reject(new Error("scroll did not settle")); else requestAnimationFrame(tick); };
  15  |     requestAnimationFrame(tick);
  16  |   }));
  17  | }
  18  | 
  19  | for (const motion of ["no-preference", "reduce"] as const) {
  20  |   test(`${motion}: keyboard focus, skip and full route history`, async ({page}, info) => {
  21  |     const observations: unknown[] = [];
  22  |     await page.emulateMedia({reducedMotion: motion});
  23  |     await page.setViewportSize({width: 1440, height: 900});
  24  |     await page.goto("/en");
  25  |     if (motion === "reduce") await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  26  |     else await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  27  |     await page.keyboard.press("Tab");
  28  |     await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
  29  |     await page.keyboard.press("Enter");
  30  |     await expect(page).toHaveURL(/#main-content$/);
  31  |     await expect.poll(() => page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  32  |     observations.push({step: "skip", ...(await state(page))});
  33  |     const target = page.locator("footer a[href]").last();
  34  |     await target.focus();
  35  |     await expect(target).toBeFocused();
  36  |     await expect.poll(() => target.evaluate(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })).toBe(true);
  37  |     await settled(page);
  38  |     observations.push({step: "offscreen focus", ...(await state(page))});
  39  |     await page.goto("/en/about");
  40  |     await page.keyboard.press("End");
  41  |     await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  42  |     await settled(page);
  43  |     await page.keyboard.press("Home");
  44  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  45  |     await settled(page);
  46  |     observations.push({step: "home settled", ...(await state(page))});
  47  |     await page.keyboard.press("PageDown");
  48  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  49  |     await settled(page);
  50  |     observations.push({step: "page down", ...(await state(page))});
  51  |     const link = page.getByRole("banner").getByRole("link", {name: "Contact", exact: true});
  52  |     await link.focus();
  53  |     await settled(page);
  54  |     const beforeRoute = await page.evaluate(() => scrollY);
  55  |     await link.click();
  56  |     await expect(page).toHaveURL(/\/en\/contact$/);
  57  |     observations.push({step: "contact", ...(await state(page))});
  58  |     await page.goBack();
  59  |     await expect(page).toHaveURL(/\/en\/about$/);
  60  |     await settled(page);
  61  |     await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(beforeRoute, 0);
  62  |     observations.push({step: "back", beforeRoute, ...(await state(page))});
  63  |     await page.goForward();
  64  |     await expect(page).toHaveURL(/\/en\/contact$/);
  65  |     await settled(page);
  66  |     observations.push({step: "forward", ...(await state(page))});
  67  |     const header = page.getByRole("banner");
  68  |     await header.getByRole("button", {name: /Language/}).click();
  69  |     await header.getByRole("link", {name: "Srpski", exact: true}).click();
  70  |     await expect(page).toHaveURL(/\/sr\/contact$/);
  71  |     await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
  72  |     observations.push({step: "locale", ...(await state(page))});
  73  |     await info.attach("focus-history.json", {body: JSON.stringify(observations, null, 2), contentType: "application/json"});
  74  |   });
  75  | }
  76  | 
  77  | for (const [locale, {Navigation: labels}] of Object.entries({en, ru, sr})) {
  78  |   for (const width of [360, 768, 1440]) {
  79  |     test(`${locale} ${width}: static chrome, controls and focus bounds`, async ({page}, info) => {
  80  |       await page.setViewportSize({width, height: 900});
  81  |       await page.emulateMedia({reducedMotion: "no-preference"});
  82  |       await page.goto(`/${locale}/about`);
  83  |       await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  84  |       await page.evaluate(() => document.fonts.ready);
  85  |       const header = page.getByRole("banner");
  86  |       const control = width < 1000 ? header.locator('button[aria-haspopup="dialog"]') : header.getByRole("navigation", {name: labels.navigation});
  87  |       await expect(control).toBeVisible();
  88  |       if (width < 1000) {
  89  |         await control.focus();
  90  |         await expect(control).toBeFocused();
  91  |         await control.click();
  92  |         await expect(page.getByRole("dialog")).toBeVisible();
  93  |       }
  94  |       const scope = width < 1000 ? page.getByRole("dialog") : control;
  95  |       const metrics = await scope.locator("a:visible, button:visible").evaluateAll(elements => elements.map(el => {
  96  |         const r = el.getBoundingClientRect(), css = getComputedStyle(el);
  97  |         return {text: el.textContent?.trim(), x: r.x, y: r.y, width: r.width, height: r.height, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, color: css.color, font: css.fontFamily};
  98  |       }));
> 99  |       const headerBounds = await header.evaluate(el => el.getBoundingClientRect().toJSON());
      |                                         ^ Error: locator.evaluate: Test timeout of 30000ms exceeded.
  100 |       const focusBounds = await control.evaluate(el => ({rect: el.getBoundingClientRect().toJSON(), focused: document.activeElement === el}));
  101 |       await writeFile(info.outputPath("bounds.json"), JSON.stringify({locale, width, headerBounds, focusBounds, metrics}, null, 2));
  102 |       expect(metrics.length).toBeGreaterThan(0);
  103 |       for (const r of metrics) {
  104 |         expect(r.width).toBeGreaterThan(0);
  105 |         expect(r.x).toBeGreaterThanOrEqual(-1);
  106 |         expect(r.x + r.width).toBeLessThanOrEqual(width + 1);
  107 |         expect(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth + 1);
  108 |       }
  109 |       await info.attach("bounds.json", {body: JSON.stringify(metrics, null, 2), contentType: "application/json"});
  110 |       await page.screenshot({path: info.outputPath("chrome.png")});
  111 |       if (width < 1000) {
  112 |         await page.keyboard.press("Escape");
  113 |         await expect(control).toBeFocused();
  114 |       }
  115 |     });
  116 |   }
  117 | }
  118 | 
  119 | test("touch control diagnostic", async ({browser}, info) => {
  120 |   for (const mode of ["control", "main-reduce", "main-normal", "reduce", "normal"] as const) {
  121 |     const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 390, height: 300}, hasTouch: true, isMobile: true, reducedMotion: mode.includes("reduce") ? "reduce" : "no-preference"});
  122 |     const page = await context.newPage();
  123 |     if (mode === "control") await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="control" style="overflow:auto;height:220px;width:390px"><div style="height:504px">control</div></div>');
  124 |     else { await page.goto('/en'); if (!mode.startsWith('main')) await page.getByRole('button', {name: 'Open navigation'}).tap(); else if (mode === 'main-normal') await expect(page.locator('html')).toHaveClass(/\blenis\b/); }
  125 |     const surface = mode === "control" ? page.locator('#control') : mode.startsWith('main') ? page.locator('html') : page.getByRole('dialog');
  126 |     await expect(surface).toBeVisible();
  127 |     const box = (await surface.boundingBox())!;
  128 |     const x = mode.startsWith('main') ? 195 : box.x + box.width / 2, y = mode.startsWith('main') ? 260 : Math.min(box.y + box.height - 30, 260);
  129 |     await page.evaluate(() => {
  130 |       const events: unknown[] = [];
  131 |       (window as unknown as {touchLog: unknown[]}).touchLog = events;
  132 |       for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) document.addEventListener(type, e => {
  133 |         const target = e.target as Element;
  134 |         const record = {type, trusted: e.isTrusted, cancelable: e.cancelable, prevented: false, target: target?.outerHTML.slice(0, 200)};
  135 |         events.push(record); setTimeout(() => {record.prevented = e.defaultPrevented;}, 0);
  136 |       }, {capture: true, passive: true});
  137 |     });
  138 |     const before = await surface.evaluate((el, point) => {
  139 |       const hit = document.elementFromPoint(point.x, point.y); const ancestors = [];
  140 |       for (let node = hit; node; node = node.parentElement) { const c = getComputedStyle(node); ancestors.push({tag: node.tagName, className: node.className, overflowY: c.overflowY, touchAction: c.touchAction, scrollTop: node.scrollTop, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight}); }
  141 |       return {touch: navigator.maxTouchPoints, rect: el.getBoundingClientRect().toJSON(), hit: hit?.outerHTML.slice(0, 200), ancestors, windowY: scrollY, root: document.documentElement.className};
  142 |     }, {x, y});
  143 |     const session = await context.newCDPSession(page);
  144 |     await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
  145 |     for (let step = 1; step <= 6; step++) await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x, y: y - step * 30}]});
  146 |     await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  147 |     await page.waitForTimeout(500);
  148 |     const after = await surface.evaluate(el => ({scrollTop: el.scrollTop, windowY: scrollY, events: (window as unknown as {touchLog: unknown[]}).touchLog}));
  149 |     console.log('CONTROL_DIAGNOSTIC', JSON.stringify({mode, x, y, before, after}));
  150 |     await writeFile(info.outputPath(`${mode}.json`), JSON.stringify({mode, x, y, before, after}, null, 2));
  151 |     expect(after.events.length).toBeGreaterThan(2);
  152 |     if (mode.startsWith('main')) expect(after.windowY).toBeGreaterThan(0);
  153 |     else { expect(after.scrollTop).toBeGreaterThan(0); expect(after.windowY).toBe(0); }
  154 |     await context.close();
  155 |   }
  156 | });
  157 | 
  158 | test("touch-emulated short menu accepts native panel swipe", async ({browser}, info) => {
  159 |   const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 390, height: 300}, hasTouch: true, isMobile: true, reducedMotion: "no-preference"});
  160 |   const page = await context.newPage();
  161 |   await page.goto("/en");
  162 |   await page.getByRole("button", {name: "Open navigation"}).tap();
  163 |   const panel = page.getByRole("dialog");
  164 |   await expect(panel).toBeVisible();
  165 |   const box = (await panel.boundingBox())!;
  166 |   const session = await context.newCDPSession(page);
  167 |   const x = box.x + box.width / 2, y = Math.min(box.y + box.height - 30, 260);
  168 |   const before = await panel.evaluate((el, point) => ({scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, rect: el.getBoundingClientRect().toJSON(), hit: document.elementFromPoint(point.x, point.y)?.outerHTML.slice(0, 300), viewport: {width: innerWidth, height: innerHeight}}), {x, y});
  169 |   console.log("touch-before", JSON.stringify(before));
  170 |   await session.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x, y}]});
  171 |   for (let step = 1; step <= 6; step++) await session.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x, y: y - step * 30}]});
  172 |   await session.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
  173 |   await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  174 |   await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  175 |   await info.attach("touch.json", {body: JSON.stringify({panelScroll: await panel.evaluate(el => el.scrollTop), windowScroll: await page.evaluate(() => scrollY), box}, null, 2), contentType: "application/json"});
  176 |   await context.close();
  177 | });
  178 | 
  179 | test("current SSR and hydrated reduced and normal chrome at rest", async ({browser}, info) => {
  180 |   const samples = [];
  181 |   for (const mode of ["no-js", "reduce", "normal"] as const) {
  182 |     const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 1440, height: 900}, javaScriptEnabled: mode !== "no-js", reducedMotion: mode === "reduce" ? "reduce" : "no-preference"});
  183 |     const page = await context.newPage();
  184 |     await page.goto("/en/about");
  185 |     await page.evaluate(() => document.fonts.ready);
  186 |     if (mode === "normal") await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  187 |     const sample = await page.locator("header").evaluate(el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el); return {x: r.x, y: r.y, width: r.width, height: r.height, color: c.color, font: c.fontFamily}; });
  188 |     samples.push({mode, ...sample});
  189 |     await page.screenshot({path: info.outputPath(`${mode}.png`)});
  190 |     await context.close();
  191 |   }
  192 |   expect(samples[1].height).toBe(samples[0].height);
  193 |   expect(samples[2].height).toBe(samples[0].height);
  194 |   await info.attach("render-comparison.json", {body: JSON.stringify(samples, null, 2), contentType: "application/json"});
  195 | });
  196 | 
```