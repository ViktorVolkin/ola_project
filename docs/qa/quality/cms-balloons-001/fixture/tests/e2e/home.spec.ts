import {expect, test} from "@playwright/test";
import {getHomeContent} from "../../src/content/home";
import type {Locale} from "next-intl";

for (const locale of ["en", "ru", "sr"] as const satisfies readonly Locale[]) {
  test(`${locale}: Home sections remain readable between reference widths`, async ({page}) => {
    await page.goto(`/${locale}`);
    const content = getHomeContent(locale);
    await expect(page.getByRole("heading", {level: 1})).toHaveText(content.hero.title);
    await expect(page.locator("main > section")).toHaveCount(6);
    await expect(page.locator("main article")).toHaveCount(3);
    for (const width of [1440, 1280, 1024, 768, 599, 390, 360, 320]) {
      await page.setViewportSize({width, height: 900});
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`).toBe(true);
      const controls = await page.locator("main a, main button").evaluateAll((elements) => elements.map((element) => ({
        bounds: element.getBoundingClientRect().toJSON() as {x: number; width: number; height: number},
        inRail: !!element.closest("article")
      })));
      for (const {bounds, inRail} of controls) {
        expect(bounds.width).toBeGreaterThanOrEqual(44);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.x).toBeGreaterThanOrEqual(-1);
        // Off-screen cards belong to the intentional mobile scroll rail.
        if (!inRail) {
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
        }
      }
    }
  });

  test(`${locale}: mobile mood rail and centered extras retain approved geometry`, async ({page}) => {
    await page.setViewportSize({width: 360, height: 800});
    await page.goto(`/${locale}`);
    const rail = page.locator('main [role="region"]');
    expect(await rail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    const photo = page.locator("main article img").first();
    const bounds = await photo.boundingBox();
    expect(bounds?.width).toBe(240);
    expect(bounds?.height).toBe(240);
    await rail.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    const extras = page.locator("main figure");
    await expect(extras).toHaveCount(3);
    const third = await extras.nth(2).boundingBox();
    expect(third!.x + third!.width / 2).toBeCloseTo(180, 0);
    // Measure the photo viewport, not the deliberately enlarged image crop.
    const extraPhoto = await extras.first().locator("img").evaluate((image) => image.parentElement!.getBoundingClientRect().toJSON());
    // Fluid calc() values may round to the adjacent browser layout subpixel.
    expect(extraPhoto?.width).toBeCloseTo(152, 0);
    expect(extraPhoto?.height).toBeCloseTo(116, 0);
  });
}

test("Home never exposes fake enquiry destinations or empty image alternatives", async ({page}) => {
  await page.goto("/en");
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  await expect(page.locator("main button[aria-describedby='enquiry-unavailable']")).toHaveCount(2);
  for (const button of await page.locator("main button[aria-describedby='enquiry-unavailable']").all()) {
    await expect(button).toBeDisabled();
  }
  for (const image of await page.locator("main img").all()) {
    expect((await image.getAttribute("alt"))?.trim()).toBeTruthy();
  }
});
