import { expect, test } from "@playwright/test";

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: normal routes retain one shared Header and Footer`, async ({
    page,
  }) => {
    for (const route of ["", "/about", "/weddings-events", "/balloons"]) {
      const response = await page.goto(`/${locale}${route}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      await expect(page.locator("body > header + main + footer")).toHaveCount(
        1,
      );
    }
  });

  test(`${locale}: unknown nested routes have a real 404 and Header, without Footer`, async ({
    page,
    request,
  }) => {
    for (const route of [
      "/does-not-exist",
      "/missing/deep/path",
      "/bouquets/unknown-composition",
    ]) {
      const response = await request.get(`/${locale}${route}`);
      expect(response.status()).toBe(404);
      const navigation = await page.goto(`/${locale}${route}`);
      expect(navigation?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        locale === "sr" ? "sr-Latn" : locale,
      );
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(0, {
        timeout: 1000,
      });
      await expect(page.locator("footer")).toHaveCount(0);
    }
  });
}

test("unsupported locale keeps the framework real-404 fallback", async ({
  request,
}) => {
  const response = await request.get("/fr/missing/deep/path");
  expect(response.status()).toBe(404);
});
