import {test, expect} from "@playwright/test";

const cases = [
  {locale: "en", title: "Bouquets", pending: "Card action awaits a decision.", action: "Enquire"},
  {locale: "ru", title: "Букеты", pending: "Действие для карточки ожидает решения.", action: "Узнать подробнее"},
  {locale: "sr", title: "Buketi", pending: "Odluka o radnji za karticu još nije doneta.", action: "Raspitajte se"},
];
const ids = ["bouquet-soft-romance", "bouquet-natural-airy", "bouquet-peachy-mood", "bouquet-wild-beauty", "bouquet-sunset", "bouquet-lavender-haze", "bouquet-garden-style", "bouquet-natural-beauty"];

for (const {locale} of cases) {
  test(`${locale}: each Home mood opens the intended catalogue fragment`, async ({page}) => {
    const targets = ["bouquet-soft-romance", "bouquet-sunset", "bouquet-natural-airy"];
    for (const target of targets) {
      await page.goto(`/${locale}`);
      const link = page.locator(`main a[href$="#${target}"]`);
      await expect(link).toHaveCount(1);
      await link.click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(`/${locale}/bouquets`);
      await expect.poll(() => new URL(page.url()).hash).toBe(`#${target}`);
      await expect(page.locator(`[id="${target}"]`)).toBeVisible();
      await expect(page.locator(`[id="${target}"]`)).toBeFocused();
      await page.reload();
      await expect(page.locator(`[id="${target}"]`)).toBeVisible();
      await expect(page.locator(`[id="${target}"]`)).toBeFocused();
      expect(new URL(page.url()).hash).toBe(`#${target}`);
    }
  });
}

for (const {locale, title, pending, action} of cases) {
  test(`${locale}: catalogue anchors and held actions`, async ({page}) => {
    const response = await page.goto(`/${locale}/bouquets`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "sr" ? "sr-Latn" : locale);
    const main = page.locator("main");
    await expect(main.getByRole("heading", {level: 1, name: title})).toBeVisible();
    await expect(main.locator("#bouquet-inspiration")).toHaveCount(1);
    for (const id of ids) {
      const card = main.locator(`[id="${id}"]`);
      await expect(card).toHaveCount(1);
      await expect(card).toBeVisible();
      const button = card.getByRole("button", {name: action});
      await expect(button).toBeDisabled();
      await expect(button).toHaveAccessibleDescription(pending);
      const description = await button.getAttribute("aria-describedby");
      expect(description).toBeTruthy();
      await expect(page.locator(`[id="${description}"]`)).toBeVisible();
      await expect(card.locator("a")).toHaveCount(0);
    }
    const targets = ["bouquet-inspiration", ids[0], ids[4], ids[1], ids[3]];
    const selectors = main.locator('a').filter({has: page.locator('img')});
    await page.emulateMedia({reducedMotion: "reduce"});
    for (const target of targets) {
      const index = await selectors.evaluateAll((links, targetId) => links.findIndex(link => new URL((link as HTMLAnchorElement).href).hash === `#${targetId}`), target);
      expect(index).toBeGreaterThanOrEqual(0);
      const selector = selectors.nth(index);
      await expect(selector).toBeVisible();
      await selector.focus();
      await page.keyboard.press("Enter");
      expect(new URL(page.url()).pathname).toBe(`/${locale}/bouquets`);
      expect(new URL(page.url()).hash).toBe(`#${target}`);
      await expect(page.locator(`[id="${target}"]`)).toBeFocused();
    }
    for (const id of ids) await expect(main.locator(`[id="${id}"]`)).toBeVisible();
  });
}
