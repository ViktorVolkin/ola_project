import { expect, test } from "@playwright/test";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: designed 404 has localized recovery links and responsive static artwork`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto(`/${locale}/missing/design-check`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("main[data-not-found]")).toBeVisible({
      timeout: 1000,
    });
    const copy = { en, ru, sr }[locale].NotFound;
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      copy.title,
    );
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);
    const links = page.locator("main a");
    await expect(links).toHaveCount(2);
    await expect(links.nth(0)).toHaveAttribute("href", `/${locale}`);
    await expect(links.nth(1)).toHaveAttribute("href", `/${locale}/bouquets`);
    await expect(links.nth(0)).toHaveAccessibleName(copy.home);
    await expect(links.nth(1)).toHaveAccessibleName(copy.explore);
    await expect(page.locator("main p").last()).toHaveText(copy.body);
    await expect(page.locator("[data-404-ring]")).toHaveCount(4);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [
      320, 360, 390, 430, 599, 639, 640, 641, 768, 900, 1024, 1199, 1279, 1280,
      1281, 1440, 1600,
    ]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page
        .locator("main h1, main p, main a, [data-404-artwork]")
        .evaluateAll((nodes) => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          clipped: nodes
            .filter(
              (node) =>
                node.clientWidth > 2 && node.scrollWidth > node.clientWidth + 1,
            )
            .map((node) => node.textContent),
          outside: nodes
            .filter((node) => {
              const box = node.getBoundingClientRect();
              return (
                box.width > 2 && (box.left < -1 || box.right > innerWidth + 1)
              );
            })
            .map((node) => node.tagName),
        }));
      expect(geometry, `${locale} at ${width}`).toEqual({
        overflow: false,
        clipped: [],
        outside: [],
      });
    }
    for (const [
      width,
      height,
      fontSize,
      artWidth,
      artHeight,
      outerSize,
      numberTop,
      numberSize,
      signatureTop,
    ] of [
      [360, 800, 36, 260, 248, 192, 34, 112, 212],
      [768, 1024, 44, 360, 360, 300, 68, 144, 314],
      [1440, 900, 56, 640, 600, 520, 155, 200, 552],
    ]) {
      await page.setViewportSize({ width, height });
      expect(
        await page
          .locator("main h1")
          .evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeCloseTo(fontSize, 1);
      const artwork = await page.locator("[data-404-artwork]").boundingBox();
      expect(artwork?.width).toBeCloseTo(artWidth, 0);
      expect(artwork?.height).toBeCloseTo(artHeight, 0);
      const outer = await page.locator("[data-404-ring]").first().boundingBox();
      expect(outer?.width).toBeCloseTo(outerSize, 0);
      const numeral = await page.locator("[data-404-number]").boundingBox();
      expect(numeral!.y - artwork!.y).toBeCloseTo(numberTop, 0);
      expect(numeral?.height).toBeCloseTo(numberSize, 0);
      const signature = await page
        .locator("[data-404-signature]")
        .boundingBox();
      expect(signature!.y - artwork!.y).toBeCloseTo(signatureTop, 0);
      await expect(page.locator("[data-404-artwork]")).toHaveAttribute(
        "data-motion",
        "static",
      );
    }
    await links.first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test(`${locale}: 404 retains keyboard recovery and shared modal/language behavior`, async ({
    page,
  }) => {
    const { Navigation: labels } = { en, ru, sr }[locale];
    await page.setViewportSize({ width: 390, height: 500 });
    await page.goto(`/${locale}/missing/keyboard?source=qa#main-content`);
    const home = page.locator("main a").first();
    await home.focus();
    await expect(home).toBeFocused();
    await expect(home).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Tab");
    await expect(page.locator("main a").last()).toBeFocused();
    await page.evaluate(() => scrollTo(0, 0));
    const trigger = page.locator('header button[aria-haspopup="dialog"]');
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: labels.navigation });
    await expect(dialog).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    for (const key of ["Shift+Tab", ...Array<string>(12).fill("Tab")]) {
      await page.keyboard.press(key);
      expect(
        await page.evaluate(() =>
          Boolean(document.activeElement?.closest('[role="dialog"]')),
        ),
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
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await trigger.click();
    await page
      .locator("[data-navigation-overlay]")
      .click({ position: { x: 4, y: 4 } });
    await expect(dialog).toBeHidden();
    await trigger.click();
    await dialog.getByRole("button", { name: labels.close }).click();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    const header = page.getByRole("banner");
    await expect(header.locator('[aria-current="page"]')).toHaveCount(0);
    await header
      .getByRole("button", { name: new RegExp(`^${labels.language}:`) })
      .click();
    const target = locale === "sr" ? "en" : "sr";
    await header
      .getByRole("link", {
        name: target === "sr" ? "Srpski" : "English",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(
      new RegExp(`/${target}/missing/keyboard\\?source=qa#main-content$`),
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      { en, ru, sr }[target].NotFound.title,
    );
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
  });
}

test("radar intro ends before five seconds and does not replay on resize/scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/missing/motion", { waitUntil: "domcontentloaded" });
  const artwork = page.locator("[data-404-artwork]");
  await expect(artwork).toHaveAttribute("data-motion", "intro");
  const animations = await page
    .locator("[data-404-ring]")
    .evaluateAll((nodes) =>
      nodes.flatMap((node) =>
        node.getAnimations().map((animation) => {
          const timing = animation.effect!.getTiming();
          return {
            duration: Number(timing.duration),
            delay: timing.delay ?? 0,
            iterations: timing.iterations,
          };
        }),
      ),
    );
  expect(animations).toHaveLength(4);
  for (const animation of animations) {
    expect(animation.iterations).toBe(1);
    expect(animation.duration + animation.delay).toBeLessThan(5000);
  }
  await page.evaluate(() => document.fonts.ready);
  const stable = page.locator(
    "main h1, main p, main a, [data-404-centre], [data-404-number], [data-404-signature]",
  );
  const before = await stable.evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return [box.x, box.y, box.width, box.height];
    }),
  );
  await expect(artwork).toHaveAttribute("data-motion", "static", {
    timeout: 5000,
  });
  expect(
    await stable.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return [box.x, box.y, box.width, box.height];
      }),
    ),
  ).toEqual(before);
  await page.setViewportSize({ width: 360, height: 500 });
  await page.mouse.wheel(0, 400);
  await expect(artwork).toHaveAttribute("data-motion", "static");
  expect(
    await artwork.evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("enabling reduced motion stops the intro permanently for this visit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/missing/preference", { waitUntil: "domcontentloaded" });
  const artwork = page.locator("[data-404-artwork]");
  await expect(artwork).toHaveAttribute("data-motion", "intro");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(artwork).toHaveAttribute("data-motion", "static");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(artwork).toHaveAttribute("data-motion", "static");
  expect(
    await artwork.evaluate(
      (node) => node.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("without JavaScript the 404 and recovery links are complete and static", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  try {
    const page = await context.newPage();
    const response = await page.goto("/en/missing/no-js");
    expect(response?.status()).toBe(404);
    await expect(page.locator("[data-404-artwork]")).toHaveAttribute(
      "data-motion",
      "static",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      en.NotFound.title,
    );
    expect(
      await page
        .locator("[data-404-ring]")
        .evaluateAll((nodes) =>
          nodes.map((node) => getComputedStyle(node).animationName),
        ),
    ).toEqual(["none", "none", "none", "none"]);
    await page.locator("main a").first().click();
    await expect(page).toHaveURL(/\/en$/);
  } finally {
    await context.close();
  }
});
