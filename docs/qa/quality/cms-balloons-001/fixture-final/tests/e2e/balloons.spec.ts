import { expect, test } from "@playwright/test";
import { getBalloonsContent } from "../../src/content/balloons";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";

for (const locale of ["en", "ru", "sr"] as const) {
  const labels = { en, ru, sr }[locale].Navigation;

  test(`${locale}: Balloons sections, anchor and exact honest enquiry topics`, async ({
    page,
  }) => {
    const copy = getBalloonsContent(locale);
    const response = await page.goto(`/${locale}/balloons`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveAttribute("data-locale", locale);
    await expect(page.locator("main > section")).toHaveCount(5);
    expect(
      await page
        .locator("main > section")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("data-balloons-section")),
        ),
    ).toEqual(["hero", "categories", "favourites", "personalisation", "cta"]);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1 span:visible")).toHaveText(
      copy.hero.title.replace(/\n/g, " "),
    );
    await expect(page.locator("main img")).toHaveCount(15);
    await page.locator('main a[href="#our-favourites"]').click();
    await expect(page).toHaveURL(/#our-favourites$/);
    await expect(page.locator("#our-favourites")).toBeInViewport();
    await expect(
      page.locator(
        'main a[href="#"], main a[href*="wa.me"], main a[href*="whatsapp"]',
      ),
    ).toHaveCount(0);
    const enquiries = page.locator(
      'main button[aria-describedby="enquiry-unavailable"]',
    );
    await expect(enquiries).toHaveCount(14);
    for (const button of await enquiries.all())
      await expect(button).toBeDisabled();
    for (const [selector, topics] of [
      [
        '[data-balloons-section="categories"] button',
        copy.categories.map((item) => item.title),
      ],
      [
        '[data-balloons-section="favourites"] li button',
        copy.favourites.items.map((item) => item.title),
      ],
      [
        '[data-balloons-section="personalisation"] button',
        copy.personalisation.extras.map((item) => item.title),
      ],
    ] as const) {
      expect(
        await page
          .locator(selector)
          .evaluateAll((nodes) =>
            nodes.map((node) => node.getAttribute("data-enquiry-subject")),
          ),
      ).toEqual(topics);
    }
  });

  test(`${locale}: Balloons fluid widths, reference fonts and no clipped copy`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}/balloons`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [
      320, 360, 375, 390, 430, 599, 600, 601, 639, 640, 641, 767, 768, 769, 900,
      1024, 1199, 1200, 1201, 1279, 1280, 1281, 1366, 1440, 1600,
    ]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page
        .locator(
          "main h1, main h2, main h3, main p, main button, main [data-balloon-photo]",
        )
        .evaluateAll((nodes) => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          clippedText: nodes
            .filter(
              (node) =>
                /^(H1|H2|H3|P)$/.test(node.tagName) &&
                node.clientWidth > 2 &&
                node.scrollWidth > node.clientWidth + 1,
            )
            .map((node) => node.textContent),
          outside: nodes
            .filter((node) => {
              const box = node.getBoundingClientRect();
              return (
                box.width > 2 && (box.left < -1 || box.right > innerWidth + 1)
              );
            })
            .map((node) => ({
              tag: node.tagName,
              text: node.textContent?.slice(0, 60),
            })),
        }));
      expect(geometry, `geometry at ${width}`).toEqual({
        overflow: false,
        clippedText: [],
        outside: [],
      });
    }
    for (const [width, fontSize] of [
      [360, 38],
      [768, 44],
      [1440, 80],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page
          .locator("main h1")
          .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeCloseTo(fontSize, 1);
      const wash = page.locator(
        '[data-balloons-section="hero"] div[aria-hidden="true"]',
      );
      const gradient = await wash.evaluate(
        (node) => getComputedStyle(node).backgroundImage,
      );
      // CSSOM may omit the default downward (180deg) direction.
      if (width === 768) {
        expect(gradient).toMatch(/^linear-gradient\((?:180deg,\s*)?rgba\(/);
      } else {
        expect(gradient).toContain("linear-gradient(90deg");
      }
      expect(gradient).toContain(width === 768 ? "0.72" : "0.94");
      for (const section of ["favourites", "personalisation"]) {
        await expect(
          page.locator(`[data-balloons-section="${section}"] li`).first(),
        ).toHaveCSS(
          "background-color",
          width === 1440 ? "rgba(0, 0, 0, 0)" : "rgb(255, 255, 255)",
        );
      }
      await expect(page.locator('[data-balloon-photo="cta"]')).toHaveCSS(
        "border-radius",
        width === 1440 ? "0px" : "4px",
      );
      if (width === 768) {
        // A fractional singleton flex-grow previously left unused tablet space.
        const scene = await page
          .locator('[data-balloon-photo="scene"]')
          .boundingBox();
        expect(scene?.width).toBeCloseTo(704, 0);
      }
      const favouriteAction = page
        .locator('[data-balloons-section="favourites"] li button')
        .first();
      expect(
        await favouriteAction.evaluate(
          (node) => getComputedStyle(node, "::after").height,
        ),
      ).toBe("44px");
      if (locale === "en") {
        const favourites = await page
          .locator('[data-balloons-section="favourites"]')
          .boundingBox();
        expect(favourites?.height).toBeCloseTo(
          { 360: 776, 768: 1070, 1440: 666 }[width],
          0,
        );
      }
    }
    expect(errors).toEqual([]);
  });

  test(`${locale}: Balloons modal keyboard, nested language and route preservation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 700 });
    await page.goto(`/${locale}/balloons?source=qa#our-favourites`);
    const trigger = page.locator('header button[aria-haspopup="dialog"]');
    const dialog = page.getByRole("dialog", { name: labels.navigation });
    await trigger.click();
    await expect(dialog).toBeVisible();
    const y = await page.evaluate(() => scrollY);
    await page.mouse.move(700, 650);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => scrollY)).toBe(y);
    const count = await dialog
      .locator("a[href], button:not(:disabled)")
      .count();
    for (let i = 0; i <= count; i++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((node) => node.contains(document.activeElement)),
      ).toBe(true);
    }
    const language = dialog.getByRole("button", {
      name: new RegExp(`^${labels.language}:`),
    });
    await language.click();
    await dialog.getByRole("link", { name: "English", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(language).toHaveAttribute("aria-expanded", "false");
    await expect(language).toBeFocused();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog
      .getByRole("button", { name: labels.close, exact: true })
      .click();
    await expect(dialog).toBeHidden();
    await trigger.click();
    await page
      .locator("[data-navigation-overlay]")
      .click({ position: { x: 5, y: 5 } });
    await expect(dialog).toBeHidden();
    await trigger.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(dialog).toBeHidden();
    const banner = page.getByRole("banner");
    await banner
      .getByRole("button", { name: new RegExp(`^${labels.language}:`) })
      .click();
    const target = locale === "sr" ? "en" : "sr";
    await banner
      .getByRole("link", {
        name: target === "en" ? "English" : "Srpski",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(
      `/${target}/balloons?source=qa#our-favourites`,
    );
    await expect(page.locator("main")).toHaveAttribute("data-locale", target);
  });
}
