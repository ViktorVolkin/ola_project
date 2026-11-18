# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: not-found.spec.ts >> without JavaScript the 404 and recovery links are complete and static
- Location: tests/e2e/not-found.spec.ts:255:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: locator('[data-404-artwork]')
Expected: "static"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" locator('[data-404-artwork]') with timeout 5000ms
  - waiting for locator('[data-404-artwork]')

```

# Test source

```ts
  166 |         name: target === "sr" ? "Srpski" : "English",
  167 |         exact: true,
  168 |       })
  169 |       .click();
  170 |     await expect(page).toHaveURL(
  171 |       new RegExp(`/${target}/missing/keyboard\\?source=qa#main-content$`),
  172 |     );
  173 |     await expect(page.getByRole("heading", { level: 1 })).toHaveText(
  174 |       { en, ru, sr }[target].NotFound.title,
  175 |     );
  176 |     await expect(page.getByRole("contentinfo")).toHaveCount(0);
  177 |   });
  178 | }
  179 | 
  180 | test("radar intro ends before five seconds and does not replay on resize/scroll", async ({
  181 |   page,
  182 | }) => {
  183 |   await page.emulateMedia({ reducedMotion: "no-preference" });
  184 |   await page.goto("/en/missing/motion", { waitUntil: "domcontentloaded" });
  185 |   const artwork = page.locator("[data-404-artwork]");
  186 |   await expect(artwork).toHaveAttribute("data-motion", "intro");
  187 |   const animations = await page
  188 |     .locator("[data-404-ring]")
  189 |     .evaluateAll((nodes) =>
  190 |       nodes.flatMap((node) =>
  191 |         node.getAnimations().map((animation) => {
  192 |           const timing = animation.effect!.getTiming();
  193 |           return {
  194 |             duration: Number(timing.duration),
  195 |             delay: timing.delay ?? 0,
  196 |             iterations: timing.iterations,
  197 |           };
  198 |         }),
  199 |       ),
  200 |     );
  201 |   expect(animations).toHaveLength(4);
  202 |   for (const animation of animations) {
  203 |     expect(animation.iterations).toBe(1);
  204 |     expect(animation.duration + animation.delay).toBeLessThan(5000);
  205 |   }
  206 |   await page.evaluate(() => document.fonts.ready);
  207 |   const stable = page.locator(
  208 |     "main h1, main p, main a, [data-404-centre], [data-404-number], [data-404-signature]",
  209 |   );
  210 |   const before = await stable.evaluateAll((nodes) =>
  211 |     nodes.map((node) => {
  212 |       const box = node.getBoundingClientRect();
  213 |       return [box.x, box.y, box.width, box.height];
  214 |     }),
  215 |   );
  216 |   await expect(artwork).toHaveAttribute("data-motion", "static", {
  217 |     timeout: 5000,
  218 |   });
  219 |   expect(
  220 |     await stable.evaluateAll((nodes) =>
  221 |       nodes.map((node) => {
  222 |         const box = node.getBoundingClientRect();
  223 |         return [box.x, box.y, box.width, box.height];
  224 |       }),
  225 |     ),
  226 |   ).toEqual(before);
  227 |   await page.setViewportSize({ width: 360, height: 500 });
  228 |   await page.mouse.wheel(0, 400);
  229 |   await expect(artwork).toHaveAttribute("data-motion", "static");
  230 |   expect(
  231 |     await artwork.evaluate(
  232 |       (node) => node.getAnimations({ subtree: true }).length,
  233 |     ),
  234 |   ).toBe(0);
  235 | });
  236 | 
  237 | test("enabling reduced motion stops the intro permanently for this visit", async ({
  238 |   page,
  239 | }) => {
  240 |   await page.emulateMedia({ reducedMotion: "no-preference" });
  241 |   await page.goto("/en/missing/preference", { waitUntil: "domcontentloaded" });
  242 |   const artwork = page.locator("[data-404-artwork]");
  243 |   await expect(artwork).toHaveAttribute("data-motion", "intro");
  244 |   await page.emulateMedia({ reducedMotion: "reduce" });
  245 |   await expect(artwork).toHaveAttribute("data-motion", "static");
  246 |   await page.emulateMedia({ reducedMotion: "no-preference" });
  247 |   await expect(artwork).toHaveAttribute("data-motion", "static");
  248 |   expect(
  249 |     await artwork.evaluate(
  250 |       (node) => node.getAnimations({ subtree: true }).length,
  251 |     ),
  252 |   ).toBe(0);
  253 | });
  254 | 
  255 | test("without JavaScript the 404 and recovery links are complete and static", async ({
  256 |   browser,
  257 | }) => {
  258 |   const context = await browser.newContext({
  259 |     javaScriptEnabled: false,
  260 |     viewport: { width: 360, height: 800 },
  261 |   });
  262 |   try {
  263 |     const page = await context.newPage();
  264 |     const response = await page.goto("/en/missing/no-js");
  265 |     expect(response?.status()).toBe(404);
> 266 |     await expect(page.locator("[data-404-artwork]")).toHaveAttribute(
      |                                                      ^ Error: expect(locator).toHaveAttribute(expected) failed
  267 |       "data-motion",
  268 |       "static",
  269 |     );
  270 |     await expect(page.getByRole("heading", { level: 1 })).toHaveText(
  271 |       en.NotFound.title,
  272 |     );
  273 |     expect(
  274 |       await page
  275 |         .locator("[data-404-ring]")
  276 |         .evaluateAll((nodes) =>
  277 |           nodes.map((node) => getComputedStyle(node).animationName),
  278 |         ),
  279 |     ).toEqual(["none", "none", "none", "none"]);
  280 |     await page.locator("main a").first().click();
  281 |     await expect(page).toHaveURL(/\/en$/);
  282 |   } finally {
  283 |     await context.close();
  284 |   }
  285 | });
  286 | 
```