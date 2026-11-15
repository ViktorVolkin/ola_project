# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact-faq-keyboard.spec.ts >> ru: FAQ optional header navigation preserves native controls
- Location: tests/e2e/contact-faq-keyboard.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('main button[aria-controls]').nth(6)
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" locator('main button[aria-controls]').nth(6) with timeout 5000ms
  - waiting for locator('main button[aria-controls]').nth(6)
    13 × locator resolved to <button type="button" aria-expanded="false" class="b-yB9W_trigger" aria-controls="_R_1u5bsnqivb_-answer-6">…</button>
       - unexpected value "inactive"

```

```yaml
- button "Какую информацию отправить?"
```

# Test source

```ts
  1  | import {expect, test} from "@playwright/test";
  2  | 
  3  | for (const locale of ["en", "ru", "sr"]) {
  4  |   test(`${locale}: FAQ optional header navigation preserves native controls`, async ({page}, testInfo) => {
  5  |     await page.goto(`/${locale}/contact`);
  6  |     const buttons = page.locator("main button[aria-controls]");
  7  |     await expect(buttons).toHaveCount(7);
  8  | 
  9  |     const initial = await buttons.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-expanded")));
  10 |     await buttons.nth(0).focus();
  11 |     if ((locale === "ru" && testInfo.project.name === "mobile") || (locale === "sr" && testInfo.project.name === "desktop")) {
  12 |       const stage = process.env.PILOT_STAGE || "after";
  13 |       await buttons.nth(0).press("Tab");
  14 |       await buttons.nth(1).press("Shift+Tab");
  15 |       await buttons.first().locator("../../..").screenshot({path: `docs/qa/pilot/OLA-PILOT-FAQ-001/${stage}-${locale}-${testInfo.project.name}.png`});
  16 |     }
  17 |     const move = async (key: string, target: number) => {
  18 |       await page.keyboard.press(key);
> 19 |       await expect(buttons.nth(target)).toBeFocused();
     |                                         ^ Error: expect(locator).toBeFocused() failed
  20 |       expect(await buttons.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-expanded")))).toEqual(initial);
  21 |     };
  22 |     await move("ArrowUp", 6);
  23 |     await move("ArrowDown", 0);
  24 |     await move("ArrowDown", 1);
  25 |     await move("End", 6);
  26 |     await move("ArrowUp", 5);
  27 |     await move("Home", 0);
  28 |     for (const key of ["Shift+ArrowDown", "Alt+ArrowDown", "Control+Home", "Meta+End", "a"]) {
  29 |       const canceled = await buttons.first().evaluate((node, key) => {
  30 |         const parts = key.split("+");
  31 |         const event = new KeyboardEvent("keydown", {key: parts[parts.length - 1], bubbles: true, cancelable: true, shiftKey: parts.includes("Shift"), altKey: parts.includes("Alt"), ctrlKey: parts.includes("Control"), metaKey: parts.includes("Meta")});
  32 |         return !node.dispatchEvent(event);
  33 |       }, key);
  34 |       expect(canceled).toBe(false);
  35 |       await expect(buttons.first()).toBeFocused();
  36 |     }
  37 |     await page.keyboard.press("Tab"); await expect(buttons.nth(1)).toBeFocused();
  38 |     await page.keyboard.press("Shift+Tab"); await expect(buttons.first()).toBeFocused();
  39 |     await page.keyboard.press("Enter"); await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
  40 |     await page.keyboard.press("Space"); await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
  41 |     const id = await buttons.first().getAttribute("aria-controls");
  42 | 
  43 |     await expect(page.locator(`[id="${id}"]`)).toBeVisible();
  44 |   });
  45 | }
  46 | 
```