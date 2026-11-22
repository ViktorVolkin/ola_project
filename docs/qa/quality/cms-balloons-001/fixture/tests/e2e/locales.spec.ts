import { expect, test } from "@playwright/test";
import { getHomeContent } from "../../src/content/home";
import type { Locale } from "next-intl";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";

for (const [locale, language, missingTitle] of [
  ["en", "en", en.NotFound.title],
  ["ru", "ru", ru.NotFound.title],
  ["sr", "sr-Latn", sr.NotFound.title],
]) {
  test(`${locale}: document, metadata and self-hosted fonts load without runtime errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page).toHaveTitle("OLA Floral Studio");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      getHomeContent(locale as Locale).hero.title,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        Array.from(document.fonts).some((font) => font.status === "loaded"),
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });

  test(`${locale}: nested unknown route is a localized 404`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/bouquets/unknown-slug`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      missingTitle,
    );
  });
}

for (const pathname of [
  "/fr",
  "/fr/bouquets/unknown",
  "/en-US",
  "/about",
  "/missing.svg",
]) {
  test(`${pathname} is a real 404, not a redirect or English fallback`, async ({
    request,
  }) => {
    const response = await request.get(pathname, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    expect(response.headers().location).toBeUndefined();
  });
}

test("trailing slash is removed", async ({ request }) => {
  const response = await request.get("/ru/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/ru");
});

test("a supplied asset is served directly without a locale redirect", async ({
  request,
}) => {
  const response = await request.get("/assets/icons/delivery.svg", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
});
