import {expect, test} from "@playwright/test";
import {getBalloonsContent} from "../../src/content/balloons";
import en from "../../src/i18n/messages/balloons/en.json";
import ru from "../../src/i18n/messages/balloons/ru.json";
import sr from "../../src/i18n/messages/balloons/sr.json";
import commonEn from "../../src/i18n/messages/en.json";
import commonRu from "../../src/i18n/messages/ru.json";
import commonSr from "../../src/i18n/messages/sr.json";

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: enquiry buttons retain their accessible names`, async ({page}, testInfo) => {
    await page.goto(`/${locale}/balloons`);
    const content = getBalloonsContent(locale);
    const categories = page.locator('[data-balloons-section="categories"] button');
    const extras = page.locator('[data-balloons-section="personalisation"] button');
    for (const [index, item] of content.categories.entries()) {
      await expect(categories.nth(index)).toHaveAccessibleName(item.title);
      await expect(categories.nth(index)).toBeDisabled();
      await expect(categories.nth(index)).toHaveAccessibleDescription({en: commonEn, ru: commonRu, sr: commonSr}[locale].Enquiry.unavailable);
    }
    for (const [index, item] of content.personalisation.extras.entries()) {
      const name = testInfo.project.name === "desktop" ? item.title : `${{en, ru, sr}[locale].enquire} — ${item.title}`;
      await expect(extras.nth(index)).toHaveAccessibleName(name);
      await expect(extras.nth(index)).toBeDisabled();
    }
  });
}

test("language disclosure closes when keyboard focus leaves, but not between its links", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/en");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", {name: /Language/});
  await trigger.click();
  const links = header.locator('ul[id] a');
  await expect(links).toHaveCount(3);
  await links.first().focus();
  await page.keyboard.press("Tab");
  await expect(links.nth(1)).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await links.last().focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
});

test("reverse keyboard boundary closes disclosure without stealing focus; Escape restores it", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/en");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", {name: /Language/});
  await trigger.click();
  const links = header.locator('ul[id] a');
  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(links.first()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(links.first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
  expect(await page.evaluate(() => !!document.activeElement?.closest('[data-language-open]'))).toBe(false);
  await trigger.click();
  await links.first().focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

for (const [origin, target, name] of [["ru", "en", "English"], ["sr", "ru", "Русский"]] as const) {
  test(`${origin} to ${target} preserves nested route, query and hash`, async ({page}) => {
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto(`/${origin}/about?source=qa&mode=detail#main-content`);
    const header = page.getByRole("banner");
    await header.locator('button[aria-controls][data-language-open], [data-language-open] button').click();
    await header.getByRole("link", {name, exact: true}).click();
    await expect(page).toHaveURL(new RegExp(`/${target}/about\\?source=qa&mode=detail#main-content$`));
    await expect(page.locator("html")).toHaveAttribute("lang", target);
  });
}

test("nested mobile language disclosure closes on focus exit without closing the dialog", async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto("/en");
  await page.getByRole("button", {name: "Open navigation"}).click();
  const dialog = page.getByRole("dialog");
  const trigger = dialog.getByRole("button", {name: /Language/});
  await trigger.click();
  const links = dialog.locator('ul[id] a');
  await expect(links).toHaveCount(3);
  await trigger.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  await trigger.click();
  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(links.first()).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(links.nth(1)).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await links.last().focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
});
