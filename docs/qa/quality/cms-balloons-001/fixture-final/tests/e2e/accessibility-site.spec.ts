import {test, expect, type Page, type TestInfo} from "@playwright/test";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import type {AxeResults, RunOptions} from "axe-core";

const output = "docs/qa/accessibility/site-001/names-revision-1/run/raw";
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const routes = ["", "/about", "/bouquets", "/weddings-events", "/balloons", "/contact"];
const locales = ["en", "ru", "sr"];
const axePath = require.resolve("axe-core/axe.min.js");

test.setTimeout(120_000);

async function record(page: Page, info: TestInfo, locale: string, route: string, state: string) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  const result: Record<string, unknown> = {locale, route: `/${locale}${route}`, state, project: info.project.name, tags, errors};
  let failure: unknown;
  try {
    const response = await page.goto(`/${locale}${route}`, {waitUntil: "load"});
    result.status = response?.status();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.race([Promise.all(Array.from(document.images).filter(img => img.getBoundingClientRect().top < innerHeight).map(img => img.decode().catch(() => undefined))), new Promise(resolve => setTimeout(resolve, 4000))]);
    });
    const banner = page.getByRole("banner");
    const headerLanguage = banner.locator('[data-language-open] button').filter({visible: true});
    result.backgroundBefore = {bannerCount: await banner.count(), bannerAriaHidden: await banner.first().getAttribute("aria-hidden"), wordmarkAX: await banner.locator('a[aria-label="OLA Floral Studio"]').ariaSnapshot(), languageAX: await headerLanguage.count() ? await headerLanguage.first().ariaSnapshot() : null};
    await page.keyboard.press("Tab");
    result.firstTab = await page.locator(":focus").ariaSnapshot().catch(() => "unavailable");
    await page.locator(":focus").evaluate(element => (element as HTMLElement).blur());
    if (state === "menu" || state === "menu-language") {
      await page.locator('header button[aria-haspopup="dialog"]').click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
    if (state === "language" || state === "menu-language") {
      const container = state === "menu-language" ? page.getByRole("dialog") : page.locator("header");
      await container.locator('[data-language-open="false"] button').filter({visible: true}).click();
    }
    if (state === "faq") {
      const button = page.locator('main h3 button[aria-expanded]').nth(1);
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(button).toHaveAttribute("aria-expanded", "true");
      result.faqName = await button.ariaSnapshot();
    }
    result.document = await page.evaluate(() => ({lang: document.documentElement.lang, main: document.querySelectorAll("main").length, h1: Array.from(document.querySelectorAll("h1"), x => x.textContent?.trim()), bannerAriaHidden: document.querySelector("header")?.getAttribute("aria-hidden"), active: document.activeElement?.outerHTML.slice(0, 500), dialogs: document.querySelectorAll('[role="dialog"]').length}));
    await page.addScriptTag({path: axePath});
    const scan = await page.evaluate(async (options: RunOptions) => {
      const axe = (window as unknown as {axe: typeof import("axe-core")}).axe;
      return {version: axe.version, rules: axe.getRules(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]), results: await axe.run(document, options)};
    }, {runOnly: {type: "tag", values: tags}} as RunOptions);
    result.axe = scan;
    const axe = scan.results as AxeResults;
    expect(response?.status(), "HTTP response").toBe(200);
    expect(axe.violations.length, "axe violation rule count (full data in raw JSON)").toBe(0);
    expect(errors, "console/page errors").toEqual([]);
  } catch (error) { failure = error; result.failure = String(error); }
  await mkdir(output, {recursive: true});
  const name = `${info.project.name}-${locale}-${route.slice(1) || "home"}-${state}.json`;
  await writeFile(path.join(output, name), JSON.stringify(result, null, 2));
  if (failure) throw failure;
}

for (const locale of locales) {
  for (const route of routes) {
    test(`${locale} ${route || "/"} normal`, async ({page}, info) => record(page, info, locale, route, "normal"));
  }
  test(`${locale} language desktop`, async ({page}, info) => record(page, info, locale, "", "language"));
  test(`${locale} menu mobile`, async ({page}, info) => record(page, info, locale, "", "menu"));
  test(`${locale} menu language mobile`, async ({page}, info) => record(page, info, locale, "", "menu-language"));
  test(`${locale} contact faq`, async ({page}, info) => record(page, info, locale, "/contact", "faq"));
}
