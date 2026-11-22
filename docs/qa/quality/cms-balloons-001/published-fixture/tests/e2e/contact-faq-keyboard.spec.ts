import {expect, test} from "@playwright/test";

for (const locale of ["en", "ru", "sr"]) {
  test(`${locale}: FAQ optional header navigation preserves native controls`, async ({page}, testInfo) => {
    await page.goto(`/${locale}/contact`);
    const buttons = page.locator("main button[aria-controls]");
    await expect(buttons).toHaveCount(7);

    const initial = await buttons.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-expanded")));
    await buttons.nth(0).focus();
    if ((locale === "ru" && testInfo.project.name === "mobile") || (locale === "sr" && testInfo.project.name === "desktop")) {
      const stage = process.env.PILOT_STAGE || "after";
      await buttons.nth(0).press("Tab");
      await buttons.nth(1).press("Shift+Tab");
      await buttons.first().locator("../../..").screenshot({path: `docs/qa/pilot/OLA-PILOT-FAQ-001/${stage}-${locale}-${testInfo.project.name}.png`});
    }
    const move = async (key: string, target: number) => {
      await page.keyboard.press(key);
      await expect(buttons.nth(target)).toBeFocused();
      expect(await buttons.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-expanded")))).toEqual(initial);
    };
    await move("ArrowUp", 6);
    await move("ArrowDown", 0);
    await move("ArrowDown", 1);
    await move("End", 6);
    await move("ArrowUp", 5);
    await move("Home", 0);
    for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) {
      const canceled = await buttons.first().evaluate((node, value) => !node.dispatchEvent(new KeyboardEvent("keydown", {key: value, bubbles: true, cancelable: true})), key);
      expect(canceled).toBe(true);
      await buttons.first().focus();
    }
    for (const key of ["Shift+ArrowDown", "Alt+ArrowDown", "Control+Home", "Meta+End", "a"]) {
      const canceled = await buttons.first().evaluate((node, key) => {
        const parts = key.split("+");
        const event = new KeyboardEvent("keydown", {key: parts[parts.length - 1], bubbles: true, cancelable: true, shiftKey: parts.includes("Shift"), altKey: parts.includes("Alt"), ctrlKey: parts.includes("Control"), metaKey: parts.includes("Meta")});
        return !node.dispatchEvent(event);
      }, key);
      expect(canceled).toBe(false);
      await expect(buttons.first()).toBeFocused();
    }
    await page.keyboard.press("Tab"); await expect(buttons.nth(1)).toBeFocused();
    await page.keyboard.press("Shift+Tab"); await expect(buttons.first()).toBeFocused();
    await page.keyboard.press("Enter"); await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Space"); await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await buttons.nth(1).focus(); await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown"); await expect(buttons.nth(2)).toBeFocused();
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    const id = await buttons.first().getAttribute("aria-controls");
    await expect(page.locator(`[id="${id}"]`)).toBeVisible();
    const secondId = await buttons.nth(1).getAttribute("aria-controls");
    const answer = page.locator(`[id="${secondId}"]`);
    await expect(answer).toBeVisible();
    await expect(answer.locator("a")).toHaveCount(0);
    const canceledInAnswer = await answer.evaluate(node => !node.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown", bubbles: true, cancelable: true})));
    expect(canceledInAnswer).toBe(false);
    await expect(buttons.nth(2)).toBeFocused();
  });
}
