import {expect, test} from "@playwright/test";
import {getWeddingsContent} from "../../src/content/weddings";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";

for (const locale of ["en", "ru", "sr"] as const) {
  const labels = {en, ru, sr}[locale].Navigation;

  test(`${locale}: Weddings sections, process anchor and honest enquiry subjects`, async ({page}) => {
    const copy = getWeddingsContent(locale);
    const response = await page.goto(`/${locale}/weddings-events`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveAttribute("data-locale", locale);
    await expect(page.getByRole("heading", {level: 1})).toHaveText(copy.hero.title);
    const sections = page.locator("main > section");
    await expect(sections).toHaveCount(6);
    expect(await sections.evaluateAll(nodes => nodes.map(node => node.getAttribute("data-weddings-section") || node.id))).toEqual([
      "hero", "categories", "approach", "our-process", "inspiration", "cta"
    ]);
    await expect(page.locator("main img")).toHaveCount(11);
    await expect(page.locator("#our-process ol > li")).toHaveCount(4);
    await page.locator('main a[href="#our-process"]').click();
    await expect(page).toHaveURL(/#our-process$/);
    await expect(page.locator("#our-process")).toBeInViewport();
    await expect(page.locator('main a[href="#"]')).toHaveCount(0);
    await expect(page.locator('main a[href*="wa.me"], main a[href*="whatsapp"]')).toHaveCount(0);
    const enquiries = page.locator('main button[aria-describedby="enquiry-unavailable"]');
    await expect(enquiries).toHaveCount(7);
    for (const button of await enquiries.all()) await expect(button).toBeDisabled();
    const categories = page.locator('[data-weddings-section="categories"] button');
    expect(await categories.evaluateAll(nodes => nodes.map(node => node.getAttribute("data-enquiry-subject")))).toEqual(copy.categories.map(item => item.title));
    const subject = copy.hero.title.replace(/\n/g, " ");
    for (const name of ["hero", "inspiration", "cta"]) {
      await expect(page.locator(`[data-weddings-section="${name}"] button`)).toHaveAttribute("data-enquiry-subject", subject);
    }
  });

  test(`${locale}: Weddings continuous widths and native reference compositions`, async ({page}) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/${locale}/weddings-events`);
    for (const width of [320, 360, 390, 430, 599, 600, 601, 639, 640, 641, 767, 768, 769, 900, 1024, 1199, 1200, 1201, 1279, 1280, 1281, 1366, 1440, 1600]) {
      await page.setViewportSize({width, height: 900});
      const geometry = await page.locator("main h1, main h2, main h3, main p, main button, main figure, main figcaption").evaluateAll(nodes => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        clippedText: nodes.filter(node => /^(H1|H2|H3|P|FIGCAPTION)$/.test(node.tagName) && node.clientWidth > 2 && node.scrollWidth > node.clientWidth + 1).map(node => node.textContent),
        outside: nodes.filter(node => {
          const box = node.getBoundingClientRect();
          // The visually-hidden category heading/button labels are deliberately clipped.
          return box.width > 2 && (box.left < -1 || box.right > innerWidth + 1);
        }).map(node => ({tag: node.tagName, text: node.textContent?.slice(0, 60)}))
      }));
      expect(geometry.overflow, `document overflow at ${width}`).toBe(false);
      expect(geometry.clippedText, `clipped text at ${width}`).toEqual([]);
      expect(geometry.outside, `content outside ${width}`).toEqual([]);
    }
    for (const [width, columns, heroFont, processFont] of [[360, 1, 38, 32], [768, 2, 44, 36], [1440, 4, 80, 36]] as const) {
      await page.setViewportSize({width, height: 900});
      expect(await page.locator('#weddings-title').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeCloseTo(heroFont, 1);
      expect(await page.locator('#weddings-process-title').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeCloseTo(processFont, 1);
      for (const selector of ['[data-weddings-section="categories"] li', '[data-weddings-section="inspiration"] figure', '#our-process ol > li']) {
        const rows = await page.locator(selector).evaluateAll(nodes => {
          const counts: Record<string, number> = {};
          for (const node of nodes) {
            const row = Math.round(node.getBoundingClientRect().top);
            counts[row] = (counts[row] || 0) + 1;
          }
          return Object.values(counts);
        });
        expect(rows.every(count => count === columns), `${selector} at ${width}`).toBe(true);
      }
    }
    await expect(page.locator('[data-weddings-section="cta"] img')).toHaveCSS("object-position", "50% 0%");
    expect(errors).toEqual([]);
  });

  test(`${locale}: Weddings header modal focus, nested language, dismissal and resize`, async ({page}) => {
    await page.setViewportSize({width: 768, height: 700});
    await page.goto(`/${locale}/weddings-events`);
    await expect(page.locator('header span[aria-current="page"]')).toHaveText(labels.eventsShort);
    const trigger = page.locator('header button[aria-haspopup="dialog"]');
    const dialog = page.getByRole("dialog", {name: labels.navigation});
    await trigger.click();
    await expect(dialog).toBeVisible();
    const beforeScroll = await page.evaluate(() => scrollY);
    await page.mouse.move(700, 650);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => scrollY)).toBe(beforeScroll);
    const focusable = dialog.locator('a[href], button:not(:disabled)');
    const focusCount = await focusable.count();
    for (let i = 0; i <= focusCount; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Shift+Tab");
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
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
    await trigger.click();
    await dialog.getByRole("button", {name: labels.close, exact: true}).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.locator("[data-navigation-overlay]").click({position: {x: 5, y: 5}});
    await expect(dialog).toBeHidden();
    await trigger.click();
    await dialog.getByRole("link", {name: labels.events, exact: true}).click();
    await expect(dialog).toBeHidden();
    await trigger.click();
    await page.setViewportSize({width: 1440, height: 900});
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("banner").getByRole("link", {name: labels.events, exact: true})).toHaveAttribute("aria-current", "page");
    await page.setViewportSize({width: 360, height: 800});
    await expect(page.locator('header span[aria-current="page"]')).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`${locale}: Weddings language switching preserves route, query and anchor`, async ({page}) => {
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto(`/${locale}/weddings-events?source=qa#our-process`);
    const target = locale === "sr" ? "en" : "sr";
    await page.getByRole("banner").getByRole("button", {name: new RegExp(`^${labels.language}:`)}).click();
    await page.getByRole("banner").getByRole("link", {name: target === "en" ? "English" : "Srpski", exact: true}).click();
    await expect(page).toHaveURL(`/${target}/weddings-events?source=qa#our-process`);
    await expect(page.getByRole("heading", {level: 1})).toHaveText(getWeddingsContent(target).hero.title);
  });
}
