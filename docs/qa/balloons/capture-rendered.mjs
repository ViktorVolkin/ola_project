import {chromium} from "@playwright/test";
import {createHash} from "node:crypto";
import {mkdir, readFile, readdir, writeFile} from "node:fs/promises";
import {join} from "node:path";

const output = process.argv[2] ?? "docs/qa/balloons/rendered";
await mkdir(output, {recursive: true});
const intake = JSON.parse(await readFile("docs/design/balloons-intake.json", "utf8"));
const references = {360: "mobile360", 768: "tablet768", 1440: "desktop1440"};
const configFiles = ["package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "playwright.config.ts", "vitest.config.mts", "eslint.config.mjs"];
async function walk(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}
async function fingerprint() {
  const files = [...await walk("src"), ...await walk("tests"), ...configFiles].sort();
  const hashes = await Promise.all(files.map(async file => [file, createHash("sha256").update(await readFile(file)).digest("hex")]));
  return {files: hashes, sha256: createHash("sha256").update(JSON.stringify(hashes)).digest("hex")};
}
const sourceBefore = await fingerprint();
const browser = await chromium.launch({headless: true});
const results = [];
try {
  for (const locale of ["en", "ru", "sr"]) {
    for (const width of [360, 768, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 900}, deviceScaleFactor: 1});
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const response = await page.goto(`http://127.0.0.1:3120/${locale}/balloons`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.querySelectorAll("main img")) {
          image.scrollIntoView();
          await image.decode();
        }
        scrollTo(0, 0);
      });
      const geometry = await page.locator("main [data-balloon-photo]").evaluateAll(nodes => nodes.map(node => {
        const outer = node.getBoundingClientRect();
        const inner = node.firstElementChild.getBoundingClientRect();
        const image = node.querySelector("img");
        const url = new URL(image.currentSrc, location.href);
        return {
          kind: node.getAttribute("data-balloon-photo"),
          source: url.searchParams.get("url") ?? url.pathname,
          viewport: {width: outer.width, height: outer.height},
          imageRectangle: {width: inner.width, height: inner.height, x: inner.left - outer.left, y: inner.top - outer.top},
          decoded: image.complete && image.naturalWidth > 0,
          fit: getComputedStyle(image).objectFit
        };
      }));
      const cropDifferences = [];
      for (const [index, image] of geometry.entries()) {
        const id = `B${String(index + 1).padStart(2, "0")}`;
        const expected = intake.photoCrops[references[width]][id];
        for (const group of ["viewport", "imageRectangle"]) {
          for (const [key, value] of Object.entries(expected[group])) {
            const actual = image[group][key];
            if (Math.abs(actual - value) > 1) cropDifferences.push({id, group, key, expected: value, actual});
          }
        }
      }
      const screenshot = `${output}/${locale}-${width}.png`;
      await page.screenshot({path: screenshot, fullPage: true});
      if (locale === "en" || (locale === "ru" && width === 360)) {
        await page.locator('[data-balloons-section="personalisation"]').screenshot({path: `${output}/${locale}-${width}-personalisation.png`});
      }
      results.push({locale, width, httpStatus: response.status(), screenshot, pageErrors: errors, documentOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), geometry, cropDifferences});
      await page.close();
    }
  }
} finally {
  await browser.close();
}
const sourceAfter = await fingerprint();
const manifest = {
  capturedAt: new Date().toISOString(),
  buildId: (await readFile(".next/BUILD_ID", "utf8")).trim(),
  browser: "Playwright Chromium, headless, deviceScaleFactor=1",
  source: sourceBefore,
  sourceUnchanged: sourceBefore.sha256 === sourceAfter.sha256,
  results
};
await writeFile(`${output}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({buildId: manifest.buildId, sourceUnchanged: manifest.sourceUnchanged, captures: results.length, findings: results.flatMap(result => result.cropDifferences.map(finding => ({locale: result.locale, width: result.width, ...finding}))), pageErrors: results.flatMap(result => result.pageErrors), documentOverflow: results.some(result => result.documentOverflow)}, null, 2));
