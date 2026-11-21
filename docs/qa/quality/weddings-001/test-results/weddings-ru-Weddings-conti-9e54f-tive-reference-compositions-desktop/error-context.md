# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: weddings.spec.ts >> ru: Weddings continuous widths and native reference compositions
- Location: tests/e2e/weddings.spec.ts:39:7

# Error details

```
Error: expect(received).toBeCloseTo(expected, precision)

Expected: 38
Received: 16

Expected precision:    1
Expected difference: < 0.05
Received difference:   22
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Перейти к содержимому" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - link "OLA Floral Studio" [ref=e6] [cursor=pointer]:
          - /url: /ru
          - text: OLA FLORAL STUDIO
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
      - generic [ref=e13]:
        - text: Черногория
        - 'button "Язык: RU — Русский" [disabled] [ref=e16]': RU
        - button "Заказать в WhatsApp" [disabled] [ref=e20]
        - generic [ref=e23]:
          - text: Свадьбы
          - button "Открыть навигацию" [disabled] [ref=e24]
  - main [ref=e27]:
    - region [ref=e28]:
      - generic [ref=e30]:
        - paragraph [ref=e31]:
          - link "Главная" [ref=e32] [cursor=pointer]:
            - /url: /ru
          - text: / Свадьбы и события
        - heading "Свадьбы и события" [level=1] [ref=e33]
        - paragraph [ref=e34]: Цветы для самых важных моментов жизни.
        - paragraph [ref=e35]: Цветочные идеи для камерных встреч и масштабных торжеств, вдохновлённые вашим стилем и Черногорией.
        - button "Спланируйте ваше событие" [disabled] [ref=e36]
      - generic [ref=e39]:
        - img "Стол для праздника с цветами и бокалами." [ref=e40]
        - paragraph [aria-hidden] [ref=e41]: Незабываемые моменты
    - region [ref=e42]:
      - heading "Услуги по мероприятиям" [level=2] [ref=e43]
      - list [ref=e45]:
        - listitem [ref=e46]:
          - img "Невеста с цветочным букетом." [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - heading "Свадьбы" [level=3] [ref=e50]
              - paragraph [ref=e51]: Букеты невесты, цветы для церемонии и места проведения.
            - button "Свадьбы" [disabled] [ref=e52]
        - listitem [ref=e55]:
          - img "Цветы и детали стола для частного праздника." [ref=e56]
          - generic [ref=e57]:
            - generic [ref=e58]:
              - heading "Частные мероприятия" [level=3] [ref=e59]
              - paragraph [ref=e60]: Цветочные идеи для дней рождения, юбилеев и помолвок.
            - button "Частные мероприятия" [disabled] [ref=e61]
        - listitem [ref=e64]:
          - img "Цветочные детали в месте проведения мероприятия." [ref=e65]
          - generic [ref=e66]:
            - generic [ref=e67]:
              - heading "Корпоративные мероприятия" [level=3] [ref=e68]
              - paragraph [ref=e69]: Идеи цветочного оформления для деловых встреч.
            - button "Корпоративные мероприятия" [disabled] [ref=e70]
        - listitem [ref=e73]:
          - img "Декоративные детали для места проведения мероприятия." [ref=e74]
          - generic [ref=e75]:
            - generic [ref=e76]:
              - heading "Аренда для мероприятий" [level=3] [ref=e77]
              - paragraph [ref=e78]: Узнайте об арках и деталях оформления мероприятий.
            - button "Аренда для мероприятий" [disabled] [ref=e79]
    - region [ref=e82]:
      - generic [ref=e83]:
        - generic [ref=e84]:
          - paragraph [ref=e85]: НАШ ПОДХОД
          - heading "Каждое событие — уникальная история." [level=2] [ref=e86]
          - paragraph [ref=e87]: Расскажите, какую атмосферу вы представляете. Вместе мы можем подобрать цветы, цвета и детали, отражающие ваш стиль.
          - link "Наш процесс" [ref=e88] [cursor=pointer]:
            - /url: "#our-process"
        - img "Цветочная композиция для стола праздника." [ref=e91]
    - region [ref=e92]:
      - generic [ref=e94]:
        - paragraph [ref=e95]: НАШ ПРОЦЕСС
        - heading "Продуманный процесс — от первой беседы до дня мероприятия." [level=2] [ref=e96]
        - list [ref=e97]:
          - listitem [ref=e98]:
            - text: "01"
            - generic [ref=e99]:
              - heading "Консультация" [level=3] [ref=e100]
              - paragraph [ref=e101]: Расскажите нам о своем мероприятии, стиле и пожеланиях.
          - listitem [ref=e102]:
            - text: "02"
            - generic [ref=e103]:
              - heading "Дизайн-концепция" [level=3] [ref=e104]
              - paragraph [ref=e105]: Обсудите идеи цветочного оформления, палитру и мудборд.
          - listitem [ref=e106]:
            - text: "03"
            - generic [ref=e107]:
              - heading "Подготовка" [level=3] [ref=e108]
              - paragraph [ref=e109]: Спланируйте цветочные детали, материалы и финальные штрихи.
          - listitem [ref=e110]:
            - text: "04"
            - generic [ref=e111]:
              - heading "День мероприятия" [level=3] [ref=e112]
              - paragraph [ref=e113]: Обсудите время, доставку и организацию на месте.
    - region [ref=e114]:
      - generic [ref=e115]:
        - paragraph [ref=e116]: ВДОХНОВЕНИЕ ДЛЯ СОБЫТИЙ
        - heading "Представьте эти моменты." [level=2] [ref=e117]
        - generic [ref=e118]:
          - figure "Свадебная церемония" [ref=e119]:
            - img "Место свадебной церемонии, украшенное цветами." [ref=e120]
          - figure "Частный ужин" [ref=e122]:
            - img "Стол с ужином и цветочными декоративными деталями." [ref=e123]
          - figure "Помолвка" [ref=e125]:
            - img "Цветы для камерного праздника." [ref=e126]
          - figure "Корпоративная встреча" [ref=e128]:
            - img "Цветочный декор в пространстве для встреч." [ref=e129]
        - button "Обсудите ваше событие" [disabled] [ref=e131]
    - region [ref=e134]:
      - generic [ref=e135]:
        - paragraph [ref=e136]: СПЛАНИРУЕМ ВМЕСТЕ
        - heading "Расскажите о вашем мероприятии" [level=2] [ref=e137]
        - paragraph [ref=e138]: Поделитесь идеями своего мероприятия, датой и местом, чтобы начать диалог.
        - button "Свяжитесь с нами через WhatsApp" [disabled] [ref=e139]
        - paragraph [aria-hidden] [ref=e142]: Больше, чем цветы
      - img "Невеста с цветочным букетом." [ref=e143]
  - contentinfo [ref=e144]:
    - generic [ref=e145]:
      - generic [ref=e146]:
        - link "OLA Floral Studio" [ref=e147] [cursor=pointer]:
          - /url: /ru
          - text: OLA
        - paragraph [ref=e148]: Цветочная студия в Черногории. Цветы, шары и особенные моменты.
      - navigation "Услуги OLA" [ref=e149]:
        - link "Букеты" [ref=e150] [cursor=pointer]:
          - /url: /ru/bouquets
        - link "Шары и подарки" [ref=e151] [cursor=pointer]:
          - /url: /ru/balloons
        - link "Свадьбы и события" [ref=e152] [cursor=pointer]:
          - /url: /ru/weddings-events
      - generic [ref=e153]:
        - navigation "Студия и обращения" [ref=e154]:
          - link "О студии OLA" [ref=e155] [cursor=pointer]:
            - /url: /ru/about
          - link "Контакты" [ref=e156] [cursor=pointer]:
            - /url: /ru/contact
        - button "Написать в WhatsApp" [disabled] [ref=e157]
        - 'button "Язык: RU — Русский" [disabled] [ref=e161]': RU
  - paragraph [ref=e164]: "Обращения в WhatsApp пока недоступны: контакт студии ещё не настроен."
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
> 60  |       expect(await page.locator('#weddings-title').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeCloseTo(heroFont, 1);
      |                                                                                                                   ^ Error: expect(received).toBeCloseTo(expected, precision)
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
  84  |     await trigger.click();
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