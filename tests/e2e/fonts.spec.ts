import { expect, test } from "@playwright/test";

for (const locale of ["en", "ru", "sr"]) {
  for (const route of [
    "",
    "/about",
    "/weddings-events",
    "/balloons",
    "/contact",
    "/missing/font-check",
  ]) {
    test(`${locale}${route}: real glyphs use the intended self-hosted Google font families`, async ({
      page,
    }) => {
      const externalRequests: string[] = [];
      page.on("request", (request) => {
        if (/fonts\.(googleapis|gstatic)\.com/.test(request.url()))
          externalRequests.push(request.url());
      });
      await page.goto(`/${locale}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator("main > section").first();
      const isNotFound = route === "/missing/font-check";
      // Variable fonts expose their default-instance name through CDP; CSS still selects the requested weight.
      const probes = [
        {
          element:
            route === "/balloons"
              ? hero.locator("h1 span:visible")
              : hero.getByRole("heading", { level: 1 }),
          family: "Cormorant Garamond Light",
        },
        { element: hero.locator("p").first(), family: "Manrope ExtraLight" },
        {
          element: isNotFound
            ? hero.locator("[data-404-signature]")
            : hero.locator("p").last(),
          family: route === "/balloons" ? "Manrope ExtraLight" : "Great Vibes",
        },
        ...(isNotFound
          ? [
              {
                element: hero.locator("[data-404-number]"),
                family: "Cormorant Garamond Light",
              },
            ]
          : []),
      ];
      const cdp = await page.context().newCDPSession(page);
      try {
        await cdp.send("DOM.enable");
        await cdp.send("CSS.enable");
        for (const [index, probe] of probes.entries()) {
          await expect(probe.element).toBeVisible();
          await probe.element.evaluate(
            (element, id) => element.setAttribute("data-font-test", id),
            String(index),
          );
          const { root } = await cdp.send("DOM.getDocument");
          const { nodeId } = await cdp.send("DOM.querySelector", {
            nodeId: root.nodeId,
            selector: `[data-font-test="${index}"]`,
          });
          const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", {
            nodeId,
          });
          const renderedFonts = fonts.filter((font) => font.glyphCount > 0);
          expect(renderedFonts.length).toBeGreaterThan(0);
          for (const font of renderedFonts) {
            expect(font.familyName).toBe(probe.family);
            expect(font.isCustomFont).toBe(true);
          }
          await probe.element.evaluate((element) =>
            element.removeAttribute("data-font-test"),
          );
        }
        await expect(probes[2].element).toHaveCSS("font-style", "normal");
        expect(externalRequests).toEqual([]);
      } finally {
        await cdp.detach();
      }
    });
  }
}
