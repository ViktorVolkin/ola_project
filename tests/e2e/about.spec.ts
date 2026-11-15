import { expect, test } from "@playwright/test";
import { getAboutContent } from "../../src/content/about";
import type { Locale } from "next-intl";

for (const locale of ["en", "ru", "sr"] as const satisfies readonly Locale[]) {
  test(`${locale}: About renders the six intended content sections and story anchor`, async ({
    page,
  }) => {
    const copy = getAboutContent(locale);
    await page.goto(`/${locale}/about`);
    await expect(page.locator("main#main-content")).toHaveAttribute(
      "data-locale",
      locale,
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      copy.hero.title,
    );
    await expect(page.locator("main > section")).toHaveCount(6);
    await expect(page.locator("main > section").nth(1)).toHaveAttribute(
      "id",
      "our-story",
    );
    await page.locator('a[href="#our-story"]').click();
    await expect(page).toHaveURL(/#our-story$/);
    await expect(
      page.getByRole("heading", { name: copy.story.title }),
    ).toBeVisible();
    await expect(page.locator('main img[alt]:not([alt=""])')).toHaveCount(7);
    expect(
      await page.locator("main img[alt='']").count(),
    ).toBeGreaterThanOrEqual(4);
    await expect(page.locator("main a[href='#']")).toHaveCount(0);
    const enquiry = page.locator(
      "main button[aria-describedby='enquiry-unavailable']",
    );
    await expect(enquiry).toHaveCount(1);
    await expect(enquiry).toBeDisabled();
  });

  test(`${locale}: approved About composition preserves story, hero and mobile CTA contrast`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/about`);
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktop = await page.evaluate(() => {
      const story = document.querySelector("main > #our-story")!;
      const photo = story.querySelector("div[class*=storyPhoto]")!;
      const copy = story.querySelector("div[class*=storyCopy]")!;
      const heroPhoto = document.querySelector("div[class*=heroPhoto]")!;
      return {
        storyX: story.getBoundingClientRect().x,
        photoX: photo.getBoundingClientRect().x,
        photoWidth: photo.getBoundingClientRect().width,
        copyX: copy.getBoundingClientRect().x,
        heroX: heroPhoto.getBoundingClientRect().x,
        heroWidth: heroPhoto.getBoundingClientRect().width,
        clipping: getComputedStyle(document.querySelector("main")!).overflowX,
      };
    });
    expect(desktop.storyX).toBe(0);
    expect(desktop.photoX).toBe(0);
    expect(desktop.photoWidth).toBeCloseTo(604, 0);
    expect(desktop.copyX).toBeCloseTo(604, 0);
    expect(desktop.heroX).toBe(0);
    expect(desktop.heroWidth).toBe(1440);
    expect(desktop.clipping).not.toBe("hidden");

    await page.setViewportSize({ width: 360, height: 800 });
    const mobileCta = await page.locator("#about-cta-title").locator("..").evaluate((node) => {
      const style = getComputedStyle(node);
      return { background: style.backgroundColor, color: style.color };
    });
    expect(mobileCta.background).toBe("rgb(36, 30, 27)");
    expect(mobileCta.color).toBe("rgb(255, 249, 243)");
  });

  test(`${locale}: About remains inside viewport and exposes all text at responsive widths`, async ({
    page,
  }) => {
    const copy = getAboutContent(locale);
    await page.goto(`/${locale}/about`);
    await expect(
      page.getByRole("heading", { name: copy.why.title }),
    ).toBeVisible();
    for (const width of [1440, 1280, 1024, 768, 600, 599, 390, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `document overflow at ${width}px`,
      ).toBe(true);
      for (const heading of await page.locator("main h1, main h2").all()) {
        const box = await heading.boundingBox();
        expect(box?.width, `heading width at ${width}px`).toBeGreaterThan(0);
        expect(
          box!.x,
          `heading left edge at ${width}px`,
        ).toBeGreaterThanOrEqual(-1);
        expect(
          box!.x + box!.width,
          `heading right edge at ${width}px`,
        ).toBeLessThanOrEqual(width + 1);
      }
    }
    for (const paragraph of [
      ...copy.story.paragraphs,
      copy.why.body,
      copy.cta.body,
    ]) {
      await expect(page.getByText(paragraph, { exact: true })).toBeAttached();
    }
  });
}
