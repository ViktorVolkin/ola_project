# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-next-patch.spec.ts >> known release blocker: raw and no-JS 404 must contain real recovery DOM
- Location: tests/e2e/security-next-patch.spec.ts:4:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 5
+ Received  + 5

  Array [
    Object {
      "route": "/en/missing/security-check",
-     "valid": true,
+     "valid": false,
    },
    Object {
      "route": "/ru/missing/security-check",
-     "valid": true,
+     "valid": false,
    },
    Object {
      "route": "/sr/missing/security-check",
-     "valid": true,
+     "valid": false,
    },
    Object {
      "route": "/xx",
-     "valid": true,
+     "valid": false,
    },
    Object {
      "route": "/xx/missing",
-     "valid": true,
+     "valid": false,
    },
  ]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | // Bounded maintenance checks: trusted local content only; no exploit payloads.
  4   | test("known release blocker: raw and no-JS 404 must contain real recovery DOM", async ({ browser, request }, info) => {
  5   |   const context = await browser.newContext({ javaScriptEnabled: false });
  6   |   const page = await context.newPage();
  7   |   const results = [];
  8   |   try {
  9   |     for (const route of ["/en/missing/security-check", "/ru/missing/security-check", "/sr/missing/security-check", "/xx", "/xx/missing"]) {
  10  |       const response = await request.get(route);
  11  |       const html = await response.text();
  12  |       const rendered = await page.goto(`http://127.0.0.1:3100${route}`);
  13  |       const raw = await page.evaluate(text => {
  14  |         const doc = new DOMParser().parseFromString(text, "text/html");
  15  |         doc.querySelectorAll("script,style,template").forEach(node => node.remove());
  16  |         return { lang: doc.documentElement.lang, h1: doc.querySelector("main h1")?.textContent ?? null, header: !!doc.querySelector("header"), main: !!doc.querySelector("main"), links: doc.querySelectorAll("main a[href]").length };
  17  |       }, html);
  18  |       results.push({ route, status: response.status(), noJSStatus: rendered?.status(), raw, noJS: { heading: await page.locator("main h1").count(), links: await page.locator("main a[href]").count() } });
  19  |     }
  20  |     await info.attach("404-current-diagnostics", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
> 21  |     expect(results.map(result => ({ route: result.route, valid: result.status === 404 && result.noJSStatus === 404 && !!result.raw.h1 && result.raw.header && result.raw.main && result.raw.links >= 2 && result.noJS.heading === 1 && result.noJS.links >= 2 }))).toEqual(results.map(result => ({ route: result.route, valid: true })));
      |                                                                                                                                                                                                                                                                    ^ Error: expect(received).toEqual(expected) // deep equality
  22  |   } finally {
  23  |     await context.close();
  24  |   }
  25  | });
  26  | for (const locale of ["en", "ru", "sr"] as const) {
  27  |   test(`${locale}: six normal pages retain meaningful raw SSR, no-JS and hydration`, async ({ browser, page, request }) => {
  28  |     const context = await browser.newContext({ javaScriptEnabled: false });
  29  |     const noJS = await context.newPage();
  30  |     const errors: string[] = [];
  31  |     page.on("pageerror", error => errors.push(error.message));
  32  |     page.on("console", message => {
  33  |       if (message.type() === "error") errors.push(message.text());
  34  |     });
  35  |     const externalFonts: string[] = [];
  36  |     page.on("request", req => {
  37  |       if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) externalFonts.push(req.url());
  38  |     });
  39  |     try {
  40  |       for (const route of ["", "/about", "/bouquets", "/weddings-events", "/balloons", "/contact"]) {
  41  |         const url = `http://127.0.0.1:3100/${locale}${route}`;
  42  |         const raw = await request.get(url);
  43  |         expect(raw.status(), url).toBe(200);
  44  |         const html = await raw.text();
  45  |         const response = await noJS.goto(url);
  46  |         expect(response?.status(), url).toBe(200);
  47  |         await expect(noJS.locator("html")).toHaveAttribute("lang", locale === "sr" ? "sr-Latn" : locale);
  48  |         await expect(noJS.locator("main h1")).toBeVisible();
  49  |         expect((await noJS.locator("main").innerText()).trim().length).toBeGreaterThan(80);
  50  |         expect(await noJS.locator("main a[href]").count()).toBeGreaterThan(0);
  51  |         const rawDOM = await noJS.evaluate(text => {
  52  |           const doc = new DOMParser().parseFromString(text, "text/html");
  53  |           doc.querySelectorAll("script,style,template").forEach(node => node.remove());
  54  |           return { lang: doc.documentElement.lang, h1: doc.querySelector("main h1")?.textContent?.trim(), links: doc.querySelectorAll("main a[href]").length, text: doc.querySelector("main")?.textContent?.trim().length ?? 0 };
  55  |         }, html);
  56  |         expect(rawDOM.lang).toBe(locale === "sr" ? "sr-Latn" : locale);
  57  |         expect(rawDOM.h1).toBeTruthy();
  58  |         expect(rawDOM.links).toBeGreaterThan(0);
  59  |         expect(rawDOM.text).toBeGreaterThan(80);
  60  |         expect((await page.goto(url))?.status()).toBe(200);
  61  |         await expect(page.locator("main h1")).toBeVisible();
  62  |         await page.evaluate(() => document.fonts.ready);
  63  |         const image = page.locator("main img").first();
  64  |         await image.scrollIntoViewIfNeeded();
  65  |         await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
  66  |         const src = await image.getAttribute("src");
  67  |         expect(src).toBeTruthy();
  68  |         const asset = await request.get(new URL(src!, url).href);
  69  |         expect(asset.status()).toBe(200);
  70  |         expect(asset.headers()["content-type"]).toMatch(/^image\//);
  71  |       }
  72  |       expect(errors).toEqual([]);
  73  |       expect(externalFonts).toEqual([]);
  74  |     } finally {
  75  |       await context.close();
  76  |     }
  77  |   });
  78  | }
  79  | 
  80  | test("root/slash redirects, trusted JPEG optimizer and self-hosted font asset remain valid", async ({ page, request }) => {
  81  |   const root = await request.get("/", { maxRedirects: 0 });
  82  |   expect(root.status()).toBe(308);
  83  |   expect(root.headers().location).toBe("/en");
  84  |   const slash = await request.get("/en/about/", { maxRedirects: 0 });
  85  |   expect(slash.status()).toBe(308);
  86  |   expect(slash.headers().location).toBe("/en/about");
  87  |   await page.goto("/en");
  88  |   const image = page.locator("main img").first();
  89  |   const optimized = new URL((await image.getAttribute("src"))!, "http://127.0.0.1:3100");
  90  |   expect(optimized.pathname).toBe("/_next/image");
  91  |   const local = optimized.searchParams.get("url")!;
  92  |   expect(local).toMatch(/^\/.*\.jpe?g$/i);
  93  |   const original = await request.get(local);
  94  |   expect(original.status()).toBe(200);
  95  |   expect(original.headers()["content-type"]).toMatch(/^image\/jpeg/);
  96  |   const result = await request.get(optimized.href, { headers: { Accept: "image/jpeg" } });
  97  |   expect(result.status()).toBe(200);
  98  |   expect(result.headers()["content-type"]).toMatch(/^image\/jpeg/);
  99  |   expect((await result.body()).length).toBeGreaterThan(1000);
  100 |   const font = await page.locator('link[as="font"]').first().getAttribute("href");
  101 |   expect(font).toMatch(/^\/_next\/static\/.*\.woff2/);
  102 |   expect((await request.get(font!)).status()).toBe(200);
  103 | });
  104 | 
```