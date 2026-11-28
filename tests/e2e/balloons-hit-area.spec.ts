import { expect, test } from "@playwright/test";

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: favourite enquiry hit regions do not cover titles`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/balloons`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const overlaps = await page
        .locator('[data-balloons-section="favourites"] li')
        .evaluateAll((cards) =>
          cards.flatMap((card) => {
            const title = card.querySelector("h3")!;
            const action = card.querySelector("button")!;
            const pseudo = getComputedStyle(action, "::after");
            const translateY =
              pseudo.transform === "none"
                ? 0
                : new DOMMatrixReadOnly(pseudo.transform).m42;
            const hitTop =
              action.getBoundingClientRect().top +
              parseFloat(pseudo.top) +
              translateY;
            const titleBottom = title.getBoundingClientRect().bottom;
            return hitTop < titleBottom - 0.1
              ? [{ title: title.textContent, hitTop, titleBottom }]
              : [];
          }),
        );
      expect(overlaps, `hit region overlaps title at ${width}`).toEqual([]);
      const action = page
        .locator('[data-balloons-section="favourites"] li button')
        .first();
      await action.evaluate((node) => node.scrollIntoView({ block: "center" }));
      const hit = await action.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return {
          height: getComputedStyle(node, "::after").height,
          inside: [2, 42].map((offset) =>
            node.contains(
              document.elementFromPoint(
                box.left + box.width / 2,
                box.top + offset,
              ),
            ),
          ),
        };
      });
      expect(hit).toEqual({ height: "44px", inside: [true, true] });
    }
  });
}
