import {expect, test} from "@playwright/test";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";

for (const [locale, {Navigation: labels}] of Object.entries({en, ru, sr})) {
  test(`${locale}: translated modal semantics and nested Escape order`, async ({page}) => {
    await page.setViewportSize({width: 430, height: 700});
    await page.goto(`/${locale}/about`);
    await page.setViewportSize({width: 768, height: 900});
    const context = page.locator('header span[aria-current="page"]');
    await expect(context).toHaveText(labels.about);
    await expect(context).toBeVisible();
    await page.setViewportSize({width: 430, height: 700});
    await expect(context).toBeHidden();
    const trigger = page.locator('header button[aria-haspopup="dialog"]');
    await expect(trigger).toHaveAccessibleName(labels.open);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    const dialog = page.getByRole("dialog", {name: labels.navigation});
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog).toHaveAttribute("id", (await trigger.getAttribute("aria-controls"))!);
    const language = dialog.getByRole("button", {name: new RegExp(`^${labels.language}:`)});
    await language.click();
    await dialog.getByRole("link", {name: "English", exact: true}).focus();
    await page.keyboard.press("Escape");
    await expect(language).toHaveAttribute("aria-expanded", "false");
    await expect(language).toBeFocused();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

test("shared chrome retains CSS Module styling", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/en");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 247, 242)");
  await expect(page.getByRole("banner").getByRole("navigation", {name: "Main navigation"})).toHaveCSS("display", "flex");
});

test("language disclosure closes on Escape and keeps the equivalent route", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/en?source=qa#main-content");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", {name: /Language/});
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await header.getByRole("link", {name: "Srpski", exact: true}).click();
  await expect(page).toHaveURL(/\/sr\?source=qa#main-content$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
});

for (const region of ["banner", "contentinfo"] as const) {
  test(`${region}: language disclosure closes on an outside pointer click`, async ({page}) => {
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto("/en");
    const trigger = page.getByRole(region).getByRole("button", {name: /Language/});
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("heading", {level: 1}).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
}

test("About has its native tablet context label without changing Home or mobile chrome", async ({page}) => {
  await page.setViewportSize({width: 768, height: 900});
  await page.goto("/en/about");
  const context = page.getByRole("banner").locator('span[aria-current="page"]');
  await expect(context).toHaveText("About");
  await expect(context).toBeVisible();
  await page.setViewportSize({width: 360, height: 800});
  await expect(context).toBeHidden();
  await page.setViewportSize({width: 768, height: 900});
  await page.goto("/en");
  await expect(page.getByRole("banner").locator('span[aria-current="page"]')).toHaveCount(0);
});

test("compact navigation traps focus, restores trigger, and closes via Escape, Close, backdrop and link", async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto("/en");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", {name: "Open navigation", exact: true});
  const open = async () => { await trigger.click(); const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); return dialog; };
  let dialog = await open();
  for (const key of ["Shift+Tab", ...Array<string>(12).fill("Tab")]) {
    await page.keyboard.press(key);
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  dialog = await open();
  await dialog.getByRole("button", {name: "Close navigation"}).click();
  await expect(trigger).toBeFocused();
  dialog = await open();
  await page.locator("[data-navigation-overlay]").click({position: {x: 4, y: 4}});
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  dialog = await open();
  await dialog.getByRole("navigation").getByRole("link", {name: "About"}).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("modal blocks background scroll, preserves header layout, and handles language Escape independently", async ({page}) => {
  await page.setViewportSize({width: 390, height: 700});
  await page.goto("/en");
  const header = page.getByRole("banner");
  const trigger = header.getByRole("button", {name: "Open navigation"});
  const before = await header.boundingBox();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(page.locator("header")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  const after = await page.locator("header").boundingBox();
  expect(after).toEqual(before);
  await page.mouse.move(4, 4);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  const language = dialog.getByRole("button", {name: /Language/});
  await language.click();
  await expect(language).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(language).toHaveAttribute("aria-expanded", "false");
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await dialog.getByRole("button", {name: "Close navigation"}).click();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(trigger).toBeFocused();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("modal closes and releases its scroll lock when resized into desktop navigation", async ({page}) => {
  await page.setViewportSize({width: 768, height: 900});
  await page.goto("/en/about");
  const trigger = page.getByRole("banner").getByRole("button", {name: "Open navigation"});
  await expect(page.getByRole("banner").locator('span[aria-current="page"]')).toHaveText("About");
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.setViewportSize({width: 1200, height: 900});
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("banner").getByRole("navigation", {name: "Main navigation"})).toBeVisible();
});
