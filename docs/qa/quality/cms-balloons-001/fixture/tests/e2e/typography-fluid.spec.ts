import {expect, test, type Page} from "@playwright/test";
import {currentLayoutBoundaries} from "./responsive-widths";

// Include retired thresholds so a leftover size override cannot escape coverage.
const previousThresholds = [560, 600, 640, 700, 768, 1000, 1120, 1160, 1200];
const currentThresholds = currentLayoutBoundaries();
const thresholds = [...new Set([...previousThresholds, ...currentThresholds])].sort((a, b) => a - b);

async function typographyAt(page: Page, width: number) {
  await page.setViewportSize({width, height: 900});
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  return page.locator("main h1, main h2, main h3, main p, main figcaption, footer p").evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      text: element.textContent?.slice(0, 70),
      visible: rect.width > 0 && rect.height > 0,
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight)
    };
  }));
}

for (const locale of ["en", "ru", "sr"]) {
  for (const route of ["", "/about"]) {
    test(`${locale}${route}: typography stays continuous across layout boundaries`, async ({page}) => {
      test.setTimeout(90_000);
      await page.goto(`/${locale}${route}`);
      await page.evaluate(() => document.fonts.ready);
      for (const threshold of thresholds) {
        const below = await typographyAt(page, threshold - 1);
        const above = await typographyAt(page, threshold + 1);
        expect(above).toHaveLength(below.length);
        for (const [index, element] of below.entries()) {
          const next = above[index];
          if (!element.visible || !next.visible) continue;
          for (const property of ["fontSize", "lineHeight"] as const) {
            if (!Number.isFinite(element[property]) || !Number.isFinite(next[property])) continue;
            expect(Math.abs(next[property] - element[property]), `${threshold}px ${property}: ${element.text}`).toBeLessThanOrEqual(0.35);
          }
        }
      }
    });

    test(`${locale}${route}: fluid headings retain the approved reference sizes`, async ({page}) => {
      await page.goto(`/${locale}${route}`);
      for (const [index, width] of [360, 768, 1440].entries()) {
        await page.setViewportSize({width, height: 900});
        const heroSize = await page.locator("main h1").evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
        expect(heroSize, `${width}px H1`).toBeCloseTo([38, 44, 80][index], 1);
        const headings = route ? ["about-story", "about-style", "about-why", "about-cta"] : ["home-mood", "home-custom", "home-meet", "home-events"];
        for (const heading of headings) {
          const size = await page.locator(`#${heading}-title`).evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
          const expected = route ? [32, 36, heading === "about-style" ? 48 : 52][index] : [32, 32, 52][index];
          expect(size, `${width}px ${heading}`).toBeCloseTo(expected, 1);
        }
      }
    });
  }
}
