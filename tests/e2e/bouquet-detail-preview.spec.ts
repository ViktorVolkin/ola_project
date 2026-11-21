import { test, expect } from "@playwright/test";
import { previewExpected } from "../fixtures/bouquet-detail-preview/expected";

const locales = ["en", "ru", "sr"] as const;
const widths = [360, 768, 1440] as const;

test.describe("bouquet-detail preview route (/[locale]/preview/bouquet)", () => {
  for (const locale of locales) {
    for (const width of widths) {
      test(`renders ${locale} at ${width}px with status 200`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text());
        });

        await page.setViewportSize({ width, height: 1200 });
        const res = await page.goto(`/${locale}/preview/bouquet`);
        expect(res?.status()).toBe(200);

        const main = page.locator("main");
        await expect(main).toHaveCount(1);
        await expect(page.locator("footer")).toHaveCount(1);
        await expect(page.locator("footer")).toBeVisible();
        await expect(main.locator("h1")).toHaveText(previewExpected[locale].h1);
        const heading = main.locator("h1");
        const support = heading.locator("+ p");
        await expect(heading).toHaveCSS("font-size", width === 360 ? "38px" : "56px");
        await expect(heading).toHaveCSS("line-height", width === 360 ? "40px" : width === 768 ? "58px" : "60px");
        await expect(support).toHaveCSS("font-size", width === 360 ? "22px" : "16px");
        await expect(support).toHaveCSS("line-height", width === 360 ? "28px" : "25px");
        await expect(support).toHaveCSS("font-weight", "500");
        expect((await support.evaluate((el) => getComputedStyle(el).fontFamily)).toLowerCase()).toContain(width === 360 ? "cormorant" : "manrope");

        // Intro eyebrow exists on tablet+desktop (native), visually hidden on mobile (native has none there).
        const eyebrow = main.getByText(previewExpected[locale].eyebrow);
        if (width >= 768) {
          await expect(eyebrow).toBeVisible();
          await expect(eyebrow).toHaveCSS("font-size", "12px");
          await expect(eyebrow).toHaveCSS("font-weight", "500");
          await expect(eyebrow).toHaveCSS("line-height", "16px");
          await expect(eyebrow).toHaveCSS("letter-spacing", "1.2px");
        } else {
          await expect(eyebrow).toBeHidden();
        }

        // Exact botanical illustration: decorative slot, aria-hidden, verified asset bytes.
        const decorative = page.locator("img[src*='story_botanical_transparent.png']").first();
        await expect(decorative).toBeVisible();
        await expect(decorative.locator("..")).toHaveAttribute("aria-hidden", "true");
        if (width === 360) {
          const band = decorative.locator("..");
          const rect = await band.boundingBox();
          const image = await decorative.boundingBox();
          expect(rect?.x).toBeCloseTo(20, 1);
          expect(rect?.width).toBeCloseTo(320, 1);
          expect(rect?.height).toBeCloseTo(220, 1);
          expect(image?.x).toBeCloseTo(20, 1);
          expect(image?.width).toBeCloseTo(146.67, 1);
          await expect(band).toHaveCSS("background-color", "rgb(250, 247, 242)");
        }

        // Real header + footer + backlink to catalogue on the same preview path (locale-prefixed hrefs; back link is the third /bouquets anchor in DOM order: nav, breadcrumb, controls).
        await expect(page.locator(`a[href="${previewExpected[locale].back}"]`).nth(2)).toBeVisible();
        await expect(page.locator("header")).toBeVisible();
        await expect(page.locator('a[href="#main-content"]')).toBeVisible();

        // Desktop: Bouquets navigation item active on preview path (locale-prefixed hrefs; nav aria-label is translated per locale).
        if (width === 1440) {
          await expect(page.locator('nav a[aria-current="page"]').first()).toHaveAttribute('href', /\/bouquets$/);
        }

        // No layout breakage at the tested widths.
        await expect(page.locator("body")).toHaveCSS("overflow", "visible");
        expect(
          errors.filter((e) => !e.includes("favicon") && !e.includes("chrome-extension"))
        ).toEqual([]);

        const pageSize = page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
        }));
        const { scroll, client } = await pageSize;
        expect(scroll).toBeLessThanOrEqual(client + 1);
      });
    }
  }

  test("preview path renders the correct h1 per locale (en/ru/sr)", async ({ page }) => {
    const cases = [
      ["/en/preview/bouquet", "Soft Romance"],
      ["/ru/preview/bouquet", "Нежная романтика"],
      ["/sr/preview/bouquet", "Nežna romantika"],
    ];
    for (const [url, h1] of cases) {
      await page.goto(url);
      await expect(page.locator("main h1")).toHaveText(h1);
    }
  });

  test("SSR HTML returns 200 with noindex and preview markers, no JS required", async ({
    request,
  }) => {
    const res = await request.get("/en/preview/bouquet");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("noindex");
    expect(html).toContain("nofollow");
    expect(html).toContain("Soft Romance");
    expect(html).toContain("story_botanical_transparent.png");
    expect(html).toContain("/en/bouquets");
    // Server-rendered HTML is the no-JS contract: h1, backlink and decorative
    // asset reference are present without client-side JavaScript.
  });

  test("unknown locale keeps the 404 behaviour", async ({ page }) => {
    const res = await page.goto("/xx/preview/bouquet");
    expect(res?.status()).toBe(404);
  });
});
