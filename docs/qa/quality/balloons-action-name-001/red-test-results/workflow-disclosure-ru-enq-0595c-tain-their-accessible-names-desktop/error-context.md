# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-disclosure.spec.ts >> ru: enquiry buttons retain their accessible names
- Location: tests/e2e/workflow-disclosure.spec.ts:11:7

# Error details

```
Error: expect(locator).toHaveAccessibleName(expected) failed

Locator:  locator('[data-balloons-section="personalisation"] button').first()
Expected: "Шоколад"
Received: "Узнать подробнее — Шоколад"
Timeout:  5000ms

Call log:
  - Expect "toHaveAccessibleName" locator('[data-balloons-section="personalisation"] button').first() with timeout 5000ms
  - waiting for locator('[data-balloons-section="personalisation"] button').first()
    14 × locator resolved to <button disabled type="button" data-enquiry-subject="Шоколад" aria-describedby="enquiry-unavailable" title="Обращения в WhatsApp пока недоступны: контакт студии ещё не настроен." class="ActionLink_action__X6mhs ActionLink_text___4Av9 BalloonsPersonalisationBlock_enquire__hLqNC">…</button>
       - unexpected value "Узнать подробнее — Шоколад"

```

```yaml
- button "Узнать подробнее — Шоколад" [disabled]
```

# Test source

```ts
  1   | import {expect, test} from "@playwright/test";
  2   | import {getBalloonsContent} from "../../src/content/balloons";
  3   | import en from "../../src/i18n/messages/balloons/en.json";
  4   | import ru from "../../src/i18n/messages/balloons/ru.json";
  5   | import sr from "../../src/i18n/messages/balloons/sr.json";
  6   | import commonEn from "../../src/i18n/messages/en.json";
  7   | import commonRu from "../../src/i18n/messages/ru.json";
  8   | import commonSr from "../../src/i18n/messages/sr.json";
  9   | 
  10  | for (const locale of ["en", "ru", "sr"] as const) {
  11  |   test(`${locale}: enquiry buttons retain their accessible names`, async ({page}, testInfo) => {
  12  |     await page.goto(`/${locale}/balloons`);
  13  |     const content = getBalloonsContent(locale);
  14  |     const categories = page.locator('[data-balloons-section="categories"] button');
  15  |     const extras = page.locator('[data-balloons-section="personalisation"] button');
  16  |     for (const [index, item] of content.categories.entries()) {
  17  |       await expect(categories.nth(index)).toHaveAccessibleName(item.title);
  18  |       await expect(categories.nth(index)).toBeDisabled();
  19  |       await expect(categories.nth(index)).toHaveAccessibleDescription({en: commonEn, ru: commonRu, sr: commonSr}[locale].Enquiry.unavailable);
  20  |     }
  21  |     for (const [index, item] of content.personalisation.extras.entries()) {
  22  |       const name = testInfo.project.name === "desktop" ? item.title : `${{en, ru, sr}[locale].enquire} — ${item.title}`;
> 23  |       await expect(extras.nth(index)).toHaveAccessibleName(name);
      |                                       ^ Error: expect(locator).toHaveAccessibleName(expected) failed
  24  |       await expect(extras.nth(index)).toBeDisabled();
  25  |     }
  26  |   });
  27  | }
  28  | 
  29  | test("language disclosure closes when keyboard focus leaves, but not between its links", async ({page}) => {
  30  |   await page.setViewportSize({width: 1440, height: 900});
  31  |   await page.goto("/en");
  32  |   const header = page.getByRole("banner");
  33  |   const trigger = header.getByRole("button", {name: /Language/});
  34  |   await trigger.click();
  35  |   const links = header.locator('ul[id] a');
  36  |   await expect(links).toHaveCount(3);
  37  |   await links.first().focus();
  38  |   await page.keyboard.press("Tab");
  39  |   await expect(links.nth(1)).toBeFocused();
  40  |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  41  |   await links.last().focus();
  42  |   await page.keyboard.press("Tab");
  43  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  44  |   await expect(trigger).not.toBeFocused();
  45  | });
  46  | 
  47  | test("reverse keyboard boundary closes disclosure without stealing focus; Escape restores it", async ({page}) => {
  48  |   await page.setViewportSize({width: 1440, height: 900});
  49  |   await page.goto("/en");
  50  |   const header = page.getByRole("banner");
  51  |   const trigger = header.getByRole("button", {name: /Language/});
  52  |   await trigger.click();
  53  |   const links = header.locator('ul[id] a');
  54  |   await trigger.focus();
  55  |   await page.keyboard.press("Tab");
  56  |   await expect(links.first()).toBeFocused();
  57  |   await page.keyboard.press("Tab");
  58  |   await expect(links.nth(1)).toBeFocused();
  59  |   await page.keyboard.press("Shift+Tab");
  60  |   await expect(links.first()).toBeFocused();
  61  |   await page.keyboard.press("Shift+Tab");
  62  |   await expect(trigger).toBeFocused();
  63  |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  64  |   await page.keyboard.press("Shift+Tab");
  65  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  66  |   await expect(trigger).not.toBeFocused();
  67  |   expect(await page.evaluate(() => !!document.activeElement?.closest('[data-language-open]'))).toBe(false);
  68  |   await trigger.click();
  69  |   await links.first().focus();
  70  |   await page.keyboard.press("Escape");
  71  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  72  |   await expect(trigger).toBeFocused();
  73  | });
  74  | 
  75  | for (const [origin, target, name] of [["ru", "en", "English"], ["sr", "ru", "Русский"]] as const) {
  76  |   test(`${origin} to ${target} preserves nested route, query and hash`, async ({page}) => {
  77  |     await page.setViewportSize({width: 1440, height: 900});
  78  |     await page.goto(`/${origin}/about?source=qa&mode=detail#main-content`);
  79  |     const header = page.getByRole("banner");
  80  |     await header.locator('button[aria-controls][data-language-open], [data-language-open] button').click();
  81  |     await header.getByRole("link", {name, exact: true}).click();
  82  |     await expect(page).toHaveURL(new RegExp(`/${target}/about\\?source=qa&mode=detail#main-content$`));
  83  |     await expect(page.locator("html")).toHaveAttribute("lang", target);
  84  |   });
  85  | }
  86  | 
  87  | test("nested mobile language disclosure closes on focus exit without closing the dialog", async ({page}) => {
  88  |   await page.setViewportSize({width: 375, height: 812});
  89  |   await page.goto("/en");
  90  |   await page.getByRole("button", {name: "Open navigation"}).click();
  91  |   const dialog = page.getByRole("dialog");
  92  |   const trigger = dialog.getByRole("button", {name: /Language/});
  93  |   await trigger.click();
  94  |   const links = dialog.locator('ul[id] a');
  95  |   await expect(links).toHaveCount(3);
  96  |   await trigger.focus();
  97  |   await page.keyboard.press("Shift+Tab");
  98  |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  99  |   await expect(trigger).not.toBeFocused();
  100 |   await expect(dialog).toBeVisible();
  101 |   expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  102 |   await trigger.click();
  103 |   await trigger.focus();
  104 |   await page.keyboard.press("Tab");
  105 |   await expect(links.first()).toBeFocused();
  106 |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  107 |   await page.keyboard.press("Tab");
  108 |   await expect(links.nth(1)).toBeFocused();
  109 |   await expect(trigger).toHaveAttribute("aria-expanded", "true");
  110 |   await links.last().focus();
  111 |   await page.keyboard.press("Tab");
  112 |   await expect(trigger).toHaveAttribute("aria-expanded", "false");
  113 |   await expect(trigger).not.toBeFocused();
  114 |   await expect(dialog).toBeVisible();
  115 |   expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  116 | });
  117 | 
```