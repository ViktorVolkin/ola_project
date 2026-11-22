import {expect, test} from "@playwright/test";
import {currentLayoutBoundaries} from "./responsive-widths";

const baselineWidths = [320, 360, 375, 390, 430, 559, 560, 561, 599, 600, 601, 639, 640, 641, 699, 700, 701, 767, 768, 769, 900, 999, 1000, 1001, 1024, 1119, 1120, 1121, 1159, 1160, 1161, 1199, 1200, 1201, 1366, 1440, 1920];
const currentBoundaries = currentLayoutBoundaries();
const widths = [...new Set([...baselineWidths, ...currentBoundaries.flatMap(width => [width - 1, width, width + 1])])].sort((a, b) => a - b);

for (const locale of ["en", "ru", "sr"]) {
  test(`${locale}: modal tracks the fluid header height at intermediate widths`, async ({page}) => {
    await page.goto(`/${locale}`);
    for (const width of [360, 430, 599, 600, 601, 768, 900, 1199]) {
      await page.setViewportSize({width, height: 900});
      const header = await page.locator("header").boundingBox();
      const trigger = page.locator('header button[aria-haspopup="dialog"]');
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const panel = await dialog.boundingBox();
      expect(Math.abs(panel!.y - (header!.y + header!.height)), `${width}px panel/header boundary`).toBeLessThanOrEqual(1);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  });
  test(`${locale}: intrinsic footer preserves phone and tablet/desktop group arrangements`, async ({page}) => {
    await page.goto(`/${locale}`);
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({width, height: 900});
      const groups = await page.locator("footer > div").last().locator(":scope > *").evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON() as {x: number; y: number}));
      expect(groups).toHaveLength(3);
      if (width === 360) {
        expect(groups[1].y).toBeGreaterThan(groups[0].y);
        expect(groups[2].y).toBeGreaterThan(groups[1].y);
      } else {
        expect(Math.abs(groups[1].y - groups[0].y)).toBeLessThanOrEqual(1);
        expect(Math.abs(groups[2].y - groups[0].y)).toBeLessThanOrEqual(1);
        expect(groups[1].x).toBeGreaterThan(groups[0].x);
        expect(groups[2].x).toBeGreaterThan(groups[1].x);
      }
    }
  });
  for (const route of ["", "/about"]) {
    test(`${locale}${route}: fluid layout exposes all content between reference widths`, async ({page}) => {
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`/${locale}${route}`);
      await page.evaluate(() => document.fonts.ready);
      for (const width of widths) {
        await page.setViewportSize({width, height: 900});
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        const result = await page.evaluate(() => {
          const isRailContent = (element: Element) => Boolean(element.closest('[role="region"][tabindex="0"]'));
          const violations = [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button, main figcaption, header a, header button, footer a, footer button")]
            .filter(element => {
              const rect = element.getBoundingClientRect();
              if (!rect.width || !rect.height || isRailContent(element)) return false;
              return rect.left < -1 || rect.right > innerWidth + 1;
            })
            .map(element => ({text: element.textContent?.slice(0, 70), tag: element.tagName}));
          const clipped = [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main p, main figcaption")]
            .filter(element => {
              const style = getComputedStyle(element);
              return element.clientHeight > 0 && ["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
            }).map(element => element.textContent?.slice(0, 70));
          return {documentWidth: document.documentElement.scrollWidth, violations, clipped};
        });
        expect(result.documentWidth, `${width}px document`).toBeLessThanOrEqual(width);
        expect(result.violations, `${width}px bounds`).toEqual([]);
        expect(result.clipped, `${width}px clipped text`).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
}
