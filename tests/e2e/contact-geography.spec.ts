import {expect, test} from "@playwright/test";
import en from "../../src/i18n/messages/contact/en.json";
import ru from "../../src/i18n/messages/contact/ru.json";
import sr from "../../src/i18n/messages/contact/sr.json";

test('Serbian Geography title keeps its first word intact', async ({page}) => {
  for (const width of [360, 768, 1099, 1100, 1101, 1199, 1200, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('/sr/contact');
    await page.evaluate(() => document.fonts.ready);
    const heading = page.getByRole('heading', {name: sr.panelTitle.replace('\n', ' ')});
    await expect(heading).toHaveText('Razgovarajmo\no detaljima.');
    const lines = await heading.evaluate(node => {
      const text = node.firstChild!;
      const groups: {top: number; text: string}[] = [];
      for (let i = 0; i < text.textContent!.length; i++) {
        const char = text.textContent![i];
        if (char === '\n') continue;
        const range = document.createRange(); range.setStart(text, i); range.setEnd(text, i + 1);
        const rect = range.getBoundingClientRect();
        let line = groups.find(group => Math.abs(group.top - rect.top) < 1);
        if (!line) {line = {top: rect.top, text: ''}; groups.push(line);}
        line.text += char;
      }
      return groups.map(group => group.text.trim());
    });
    console.log(`WORDLINES ${JSON.stringify({width, lines})}`);
    expect.soft(lines[0], `SR ${width} first word fragmented: ${JSON.stringify(lines)}`).toBe('Razgovarajmo');
  }
});

for (const [locale, c] of Object.entries({en, ru, sr})) {
  test(`${locale}: Geography photo remains in its track and clear of panel content`, async ({page}) => {
    for (const width of [1099, 1100, 1101, 1199, 1200, 1440]) {
      await page.setViewportSize({width, height: 900});
      await page.goto(`/${locale}/contact`);
      await page.evaluate(() => document.fonts.ready);
      const image = page.locator('main img[src*="02_contact"]');
      await image.evaluate(async (node: HTMLImageElement) => {node.loading = "eager"; await node.decode();});
      const photo = image.locator('..');
      const panel = photo.locator('+ div');
      const heading = panel.getByRole('heading', {name: c.panelTitle.replace('\n', ' ')});
      const body = panel.getByText(c.panelBody, {exact: true});
      const action = panel.getByRole('button', {name: c.panelAction});
      await expect(heading).toBeVisible(); await expect(body).toBeVisible(); await expect(action).toBeVisible();
      const textFits = await heading.evaluate(node => {
        const range = document.createRange(); range.selectNodeContents(node);
        const panelRight = node.parentElement!.getBoundingClientRect().right;
        return Array.from(range.getClientRects()).every(rect => rect.right <= panelRight + 0.25);
      });
      expect.soft(textFits, `${locale} ${width} heading text exceeds panel`).toBe(true);
      const bounds = await panel.evaluate((node) => {
        const rect = (e: Element) => {const r = e.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
        const photo = node.previousElementSibling!;
        return {photo:rect(photo), panel:rect(node), children:Array.from(node.children, rect), group:rect(node.parentElement!)};
      });
      console.log(`GEOGRAPHY ${JSON.stringify({locale,width,...bounds,textFits})}`);
      const overlaps = (a: typeof bounds.photo, b: typeof bounds.photo) => Math.min(a.right,b.right)-Math.max(a.left,b.left) > 0.25 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top) > 0.25;
      expect.soft(overlaps(bounds.photo,bounds.panel), `${locale} ${width} photo/panel overlap ${JSON.stringify(bounds)}`).toBe(false);
      for (const child of bounds.children) expect.soft(overlaps(bounds.photo,child), `${locale} ${width} photo/panel content overlap`).toBe(false);
      expect.soft(bounds.photo.right).toBeLessThanOrEqual(bounds.group.right + 0.25);
      if (width === 1100) await page.screenshot({path:`docs/qa/contact/revision-3/green-${locale}-1100.png`,fullPage:true});
    }
  });
}
