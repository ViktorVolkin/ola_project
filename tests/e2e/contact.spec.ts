import {expect, test} from "@playwright/test";
import en from "../../src/i18n/messages/contact/en.json";
import ru from "../../src/i18n/messages/contact/ru.json";
import sr from "../../src/i18n/messages/contact/sr.json";
import fs from "node:fs";

for (const [locale, c] of Object.entries({en, ru, sr})) {
  test(`${locale}: page, FAQ and unavailable enquiries`, async ({page}) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(`/${locale}/contact`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("title")).not.toBeEmpty();
    await expect(page.getByRole("heading", {level: 1})).toHaveText(c.heroTitle.replace("\n", " "));
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeAttached();
    const faq = page.locator("main button[aria-controls]");
    await expect(faq).toHaveCount(7);
    const ids = await faq.evaluateAll(nodes => nodes.map(node => node.getAttribute("aria-controls")));
    expect(new Set(ids).size).toBe(7);
    for (let i = 0; i < 7; i++) {
      await expect(faq.nth(i)).toHaveAttribute("aria-expanded", i === 0 ? "true" : "false");
      const panel = page.locator(`[id="${ids[i]}"]`);
      await expect(panel).toHaveText(c[`a${i+1}` as keyof typeof c]);
      if (i) await expect(panel).toBeHidden();
      const box = await faq.nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    // Start with a real pointer interaction, then traverse using native tab order.
    await faq.nth(0).click();
    await page.keyboard.press("Tab"); await expect(faq.nth(1)).toBeFocused();
    await page.keyboard.press("Shift+Tab"); await expect(faq.nth(0)).toBeFocused();
    await page.keyboard.press("Tab"); await expect(faq.nth(1)).toBeFocused();
    const closedTree = await page.locator("main").ariaSnapshot();
    expect(closedTree).not.toContain(c.a2);
    await page.keyboard.press("Enter");
    expect(await page.locator("main").ariaSnapshot()).toContain(c.a2);
    await expect(faq.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(faq.nth(1)).toHaveAttribute("aria-expanded", "true");
    await faq.nth(0).click(); await expect(faq.nth(0)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab"); await expect(faq.nth(1)).toBeFocused();
    await page.keyboard.press("Space"); await expect(faq.nth(1)).toHaveAttribute("aria-expanded", "false");
    await faq.nth(0).click(); await expect(faq.nth(0)).toHaveAttribute("aria-expanded", "false");
    const actions = page.locator('main button[aria-describedby="enquiry-unavailable"]');
    expect(await actions.count()).toBeGreaterThanOrEqual(6);
    for (const action of await actions.all()) { await expect(action).toBeDisabled(); await expect(action).toHaveAccessibleDescription(/\S/); }
    for (const title of [c.topic1Title,c.topic2Title,c.topic3Title]) {
      await expect(page.locator('button[data-enquiry-subject]').filter({hasText: title})).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
}

test("responsive production geometry and captures", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  test.setTimeout(300000);
  const evidence: unknown[] = [];
  const imageFailures: string[] = [];
  page.on("response", response => { if (response.request().resourceType() === "image" && response.status() >= 400) imageFailures.push(`${response.status()} ${response.url()}`); });
  page.on("requestfailed", request => { if (request.resourceType() === "image") imageFailures.push(`${request.failure()?.errorText} ${request.url()}`); });
  fs.mkdirSync("docs/qa/contact/revision-2", {recursive:true});
  for (const locale of ["en", "ru", "sr"]) for (const width of [320,360,375,559,560,561,599,600,601,639,640,641,768,900,1024,1099,1100,1101,1199,1200,1201,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(`/${locale}/contact`);
    await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all(Array.from(document.images, async i => { await i.decode(); if (!i.complete || i.naturalWidth <= 0) throw new Error(`Image failed: ${i.currentSrc}`); })); });
    const data = await page.evaluate(() => {
      const rect = (e: Element) => {const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height};};
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('main img'));
      return {scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, height:document.documentElement.scrollHeight, sections:Array.from(document.querySelectorAll('main > section'),rect), crops:images.filter(i => /02_contact|03_contact/.test(i.getAttribute('src') || '')).map(i => ({src:i.getAttribute('src'), viewport:rect(i.parentElement!), image:rect(i), natural:[i.naturalWidth,i.naturalHeight]}))};
    });
    evidence.push({locale,width,...data});
    expect(data.scrollWidth).toBeLessThanOrEqual(data.clientWidth);
    expect(data.crops).toHaveLength(2);
    expect(imageFailures).toEqual([]);
    await page.screenshot({path:`docs/qa/contact/revision-2/${locale}-${width}.png`,fullPage:true});
  }
  fs.writeFileSync("docs/qa/contact/revision-2/geometry.json",JSON.stringify(evidence,null,2));
});

test("CT02 photo fully covers the tablet viewport after decoding", async ({page}) => {
  await page.setViewportSize({width:768,height:900});
  await page.goto("/en/contact");
  const image = page.locator('main img[src*="02_contact"]');
  await image.evaluate(async (node: HTMLImageElement) => { node.loading = "eager"; await node.decode(); });
  const bounds = await image.evaluate(node => {
    const image = node.getBoundingClientRect();
    const viewport = node.parentElement!.getBoundingClientRect();
    return {left: image.left - viewport.left, right: viewport.right - image.right};
  });
  expect(bounds.left).toBeLessThanOrEqual(0.25);
  expect(bounds.right).toBeLessThanOrEqual(0.25);
});

test("unknown and nested contact paths remain 404", async ({request}) => {
  for (const path of ["/xx/contact","/en/contact/missing","/ru/contact/missing","/sr/contact/missing"]) expect((await request.get(path)).status()).toBe(404);
});


test("contact chrome: nested Escape, focus lock, scroll, resize and locale navigation", async ({page}) => {
  await page.setViewportSize({width: 360,height: 800});
  await page.goto("/en/contact?source=qa#main-content");
  const trigger = page.getByRole("banner").getByRole("button", {name:"Open navigation"});
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow","hidden");
  for (const key of ["Shift+Tab", ...Array<string>(12).fill("Tab")]) { await page.keyboard.press(key); expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true); }
  const language = dialog.getByRole("button", {name:/Language/});
  await language.click(); await page.keyboard.press("Escape");
  await expect(language).toHaveAttribute("aria-expanded","false"); await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape"); await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
  await trigger.click(); await dialog.getByRole("button",{name:"Close navigation"}).click(); await expect(trigger).toBeFocused();
  await trigger.click(); await page.setViewportSize({width:1200,height:900}); await expect(dialog).toHaveCount(0); await expect(page.locator("body")).not.toHaveCSS("overflow","hidden");
  const header = page.getByRole("banner"); await header.getByRole("button",{name:/Language/}).click();
  await header.getByRole("link",{name:"Srpski",exact:true}).click(); await expect(page).toHaveURL(/\/sr\/contact\?source=qa#main-content$/);
  const footer = page.getByRole("contentinfo"); await footer.getByRole("button",{name:/Jezik/}).click();
  await footer.getByRole("link",{name:"English",exact:true}).click(); await expect(page).toHaveURL(/\/en\/contact\?source=qa#main-content$/);
});
