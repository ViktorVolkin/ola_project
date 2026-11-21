import { expect, test } from "@playwright/test";

// Bounded maintenance checks: trusted local content only; no exploit payloads.
test("known release blocker: raw and no-JS 404 must contain real recovery DOM", async ({ browser, request }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const results = [];
  try {
    for (const route of ["/en/missing/security-check", "/ru/missing/security-check", "/sr/missing/security-check", "/xx", "/xx/missing"]) {
      const response = await request.get(route);
      const html = await response.text();
      const rendered = await page.goto(`http://127.0.0.1:3100${route}`);
      const raw = await page.evaluate(text => {
        const doc = new DOMParser().parseFromString(text, "text/html");
        doc.querySelectorAll("script,style,template").forEach(node => node.remove());
        return { lang: doc.documentElement.lang, h1: doc.querySelector("main h1")?.textContent ?? null, header: !!doc.querySelector("header"), main: !!doc.querySelector("main"), links: doc.querySelectorAll("main a[href]").length };
      }, html);
      results.push({ route, status: response.status(), noJSStatus: rendered?.status(), raw, noJS: { heading: await page.locator("main h1").count(), links: await page.locator("main a[href]").count() } });
    }
    await info.attach("404-current-diagnostics", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
    expect(results.map(result => ({ route: result.route, valid: result.status === 404 && result.noJSStatus === 404 && !!result.raw.h1 && result.raw.header && result.raw.main && result.raw.links >= 2 && result.noJS.heading === 1 && result.noJS.links >= 2 }))).toEqual(results.map(result => ({ route: result.route, valid: true })));
  } finally {
    await context.close();
  }
});
for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: six normal pages retain meaningful raw SSR, no-JS and hydration`, async ({ browser, page, request }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJS = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    const externalFonts: string[] = [];
    page.on("request", req => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) externalFonts.push(req.url());
    });
    try {
      for (const route of ["", "/about", "/bouquets", "/weddings-events", "/balloons", "/contact"]) {
        const url = `http://127.0.0.1:3100/${locale}${route}`;
        const raw = await request.get(url);
        expect(raw.status(), url).toBe(200);
        const html = await raw.text();
        const response = await noJS.goto(url);
        expect(response?.status(), url).toBe(200);
        await expect(noJS.locator("html")).toHaveAttribute("lang", locale === "sr" ? "sr-Latn" : locale);
        await expect(noJS.locator("main h1")).toBeVisible();
        expect((await noJS.locator("main").innerText()).trim().length).toBeGreaterThan(80);
        expect(await noJS.locator("main a[href]").count()).toBeGreaterThan(0);
        const rawDOM = await noJS.evaluate(text => {
          const doc = new DOMParser().parseFromString(text, "text/html");
          doc.querySelectorAll("script,style,template").forEach(node => node.remove());
          return { lang: doc.documentElement.lang, h1: doc.querySelector("main h1")?.textContent?.trim(), links: doc.querySelectorAll("main a[href]").length, text: doc.querySelector("main")?.textContent?.trim().length ?? 0 };
        }, html);
        expect(rawDOM.lang).toBe(locale === "sr" ? "sr-Latn" : locale);
        expect(rawDOM.h1).toBeTruthy();
        expect(rawDOM.links).toBeGreaterThan(0);
        expect(rawDOM.text).toBeGreaterThan(80);
        expect((await page.goto(url))?.status()).toBe(200);
        await expect(page.locator("main h1")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const image = page.locator("main img").first();
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
        const src = await image.getAttribute("src");
        expect(src).toBeTruthy();
        const asset = await request.get(new URL(src!, url).href);
        expect(asset.status()).toBe(200);
        expect(asset.headers()["content-type"]).toMatch(/^image\//);
      }
      expect(errors).toEqual([]);
      expect(externalFonts).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test("root/slash redirects, trusted JPEG optimizer and self-hosted font asset remain valid", async ({ page, request }) => {
  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(308);
  expect(root.headers().location).toBe("/en");
  const slash = await request.get("/en/about/", { maxRedirects: 0 });
  expect(slash.status()).toBe(308);
  expect(slash.headers().location).toBe("/en/about");
  await page.goto("/en");
  const image = page.locator("main img").first();
  const optimized = new URL((await image.getAttribute("src"))!, "http://127.0.0.1:3100");
  expect(optimized.pathname).toBe("/_next/image");
  const local = optimized.searchParams.get("url")!;
  expect(local).toMatch(/^\/.*\.jpe?g$/i);
  const original = await request.get(local);
  expect(original.status()).toBe(200);
  expect(original.headers()["content-type"]).toMatch(/^image\/jpeg/);
  const result = await request.get(optimized.href, { headers: { Accept: "image/jpeg" } });
  expect(result.status()).toBe(200);
  expect(result.headers()["content-type"]).toMatch(/^image\/jpeg/);
  expect((await result.body()).length).toBeGreaterThan(1000);
  const font = await page.locator('link[as="font"]').first().getAttribute("href");
  expect(font).toMatch(/^\/_next\/static\/.*\.woff2/);
  expect((await request.get(font!)).status()).toBe(200);
});
